import axios from "axios"
import { BigNumber, Contract, providers, getDefaultProvider } from 'ethers'
const { getNetwork } = providers
import { formatUnits } from "ethers/lib/utils"
import { STAKING_REWARDS_ADDRESS, XSLOCKER_ADDRESS } from "../constants"
import xsLocker from '../abis/xsLocker.json'
import stakingRewards from '../abis/StakingRewards.json'
import { rangeFrom0, withBackoffRetries } from "../utils"
import { getProvider } from "../utils/ethers"
import { LockData, UserLocksInfo, GlobalLockInfo, UserLocksData } from "../types/lock"

export class Lock {
    public async getXsLocker() {
        return await axios.get('https://stats.solace.fi/analytics/').then((data: any) => {
            const xsLocker = data.data.xslocker
            return xsLocker
        })
    }

    public async getVotePowerByAccount() {
        function votePowerOfLock(xslock: any, time: any) {
            // The maximum duration of a lock in seconds.
            const MAX_LOCK_DURATION = 60 * 60 * 24 * 365 * 4; // 4 years
            // The vote power multiplier at max lock in bps.
            const MAX_LOCK_MULTIPLIER_BPS = 40000;  // 4X
            // The vote power multiplier when unlocked in bps.
            const UNLOCKED_MULTIPLIER_BPS = 10000; // 1X
            // 1 bps = 1/10000
            const MAX_BPS = 10000;
          
            let end = BigNumber.from(xslock.end)
            let amount = BigNumber.from(xslock.amount)
            let base = amount.mul(UNLOCKED_MULTIPLIER_BPS).div(MAX_BPS)
            let bonus = (end.lte(time))
              ? 0
              : (amount.mul(end.sub(time)).mul(MAX_LOCK_MULTIPLIER_BPS-UNLOCKED_MULTIPLIER_BPS).div(MAX_LOCK_DURATION*MAX_BPS))
            return base.add(bonus)
          }

        return await axios.get('https://stats.solace.fi/analytics/').then((data: any) => {
            const xsLocker = data.data.xslocker
            let keys = Object.keys(xsLocker)
            let now = Math.floor(Date.now()/1000)
            let owners: any = {}
            keys.forEach(chainID => {
                console.log(chainID, typeof(chainID), xsLocker[chainID])
                xsLocker[chainID].forEach((xslock: any) => {
                  if(!owners.hasOwnProperty(xslock.owner)) owners[xslock.owner] = BigNumber.from(0)
                  owners[xslock.owner] = owners[xslock.owner].add(votePowerOfLock(xslock, now))
                })
              })
            let ownerArr: any[] = Object.keys(owners).map(owner => {
              return {name: owner, votePower: formatUnits(owners[owner],18)}
            })
            ownerArr.sort((a,b) => b.votePower - a.votePower)

            return ownerArr
        })
    }

    public async getGlobalLockStats (chainId: number): Promise<GlobalLockInfo> {
      const xslAddr = XSLOCKER_ADDRESS[chainId]
      const srAddr = STAKING_REWARDS_ADDRESS[chainId]
      if (!xslAddr || !srAddr) return {
        solaceStaked: '0',
        valueStaked: '0',
        numLocks: '0',
        rewardPerSecond: '0',
        apr: '0',
        successfulFetch: false
      }

      let _provider = null

      if (chainId == 137) {
          _provider = getProvider("https://polygon-rpc.com")
      } else if (chainId == 1313161554) {
          _provider = getProvider("https://mainnet.aurora.dev")
      } else {
          _provider = getDefaultProvider(getNetwork(chainId))
      }
      const blockTag = await _provider.getBlockNumber()

      const xsl = new Contract(xslAddr, xsLocker, _provider)
      const sr = new Contract(srAddr, stakingRewards, _provider)

      let totalSolaceStaked = BigNumber.from(0)
      const [rewardPerSecond, valueStaked, numlocks] = await Promise.all([
        withBackoffRetries(async () => sr.rewardPerSecond({ blockTag: blockTag })), // across all locks
        withBackoffRetries(async () => sr.valueStaked({ blockTag: blockTag })), // across all locks
        withBackoffRetries(async () => xsl.totalSupply({ blockTag: blockTag })),
      ])
      const indices = rangeFrom0(numlocks.toNumber())
      const xsLockIDs = await Promise.all(
        indices.map(async (index) => {
          return await withBackoffRetries(async () => xsl.tokenByIndex(index, { blockTag: blockTag }))
        })
      )
      const locks = await Promise.all(
        xsLockIDs.map(async (xsLockID) => {
          return await withBackoffRetries(async () => xsl.locks(xsLockID, { blockTag: blockTag }))
        })
      )
      locks.forEach((lock) => {
        totalSolaceStaked = totalSolaceStaked.add(lock.amount)
      })
      const apr = totalSolaceStaked.gt(0)
        ? rewardPerSecond.mul(BigNumber.from(31536000)).mul(BigNumber.from(100)).div(totalSolaceStaked)
        : BigNumber.from(1000)
      return {
        solaceStaked: formatUnits(totalSolaceStaked, 18),
        valueStaked: formatUnits(valueStaked, 18),
        numLocks: numlocks.toString(),
        apr: apr.toString(), // individual lock apr may be up to 2.5x this
        rewardPerSecond: formatUnits(rewardPerSecond, 18),
        successfulFetch: true
      }
    }

    public async getUserLocks (chainId: number, address: string): Promise<UserLocksData> {
      const xslAddr = XSLOCKER_ADDRESS[chainId]
      const srAddr = STAKING_REWARDS_ADDRESS[chainId]

      if (!xslAddr || !srAddr) return {
        user: {
          pendingRewards: BigNumber.from(0),
          stakedBalance: BigNumber.from(0),
          lockedBalance: BigNumber.from(0),
          unlockedBalance: BigNumber.from(0),
          yearlyReturns: BigNumber.from(0),
          apr: BigNumber.from(0),
        },
        locks: [],
        successfulFetch: false,
      }

      let _provider = null

      if (chainId == 137) {
          _provider = getProvider("https://polygon-rpc.com")
      } else if (chainId == 1313161554) {
          _provider = getProvider("https://mainnet.aurora.dev")
      } else {
          _provider = getDefaultProvider(getNetwork(chainId))
      }

      const xsl = new Contract(xslAddr, xsLocker, _provider)
      const sr = new Contract(srAddr, stakingRewards, _provider)

      const blockTag = await _provider.getBlockNumber()
      const latestBlock = await _provider.getBlock(blockTag)

      const timestamp = latestBlock.timestamp
      let stakedBalance = BigNumber.from(0) // staked = locked + unlocked
      let lockedBalance = BigNumber.from(0) // measured in SOLACE
      let unlockedBalance = BigNumber.from(0)
      let pendingRewards = BigNumber.from(0)
      let userValue = BigNumber.from(0) // measured in SOLACE * rewards multiplier
      const [rewardPerSecond, valueStaked, numLocks] = await Promise.all([
        withBackoffRetries(async () => sr.rewardPerSecond()), // across all locks
        withBackoffRetries(async () => sr.valueStaked()), // across all locks from all users
        withBackoffRetries(async () => xsl.balanceOf(address)),
      ])
      const indices = rangeFrom0(numLocks)
      const xsLockIDs = await Promise.all(
        indices.map(async (index) => {
          return await withBackoffRetries(async () => xsl.tokenOfOwnerByIndex(address, index))
        })
      )
      const locks: LockData[] = await Promise.all(
        xsLockIDs.map(async (xsLockID) => {
          const rewards: BigNumber = await withBackoffRetries(async () => sr.pendingRewardsOfLock(xsLockID))
          const lock = await withBackoffRetries(async () => xsl.locks(xsLockID))
          const timeLeft: BigNumber = lock.end.gt(timestamp) ? lock.end.sub(timestamp) : BigNumber.from(0)
          const stakedLock = await withBackoffRetries(async () => sr.stakedLockInfo(xsLockID))
          const yearlyReturns: BigNumber = valueStaked.gt(BigNumber.from(0))
            ? rewardPerSecond.mul(BigNumber.from(31536000)).mul(stakedLock.value).div(valueStaked)
            : BigNumber.from(0)
          const apr: BigNumber = lock.amount.gt(BigNumber.from(0)) ? yearlyReturns.mul(100).div(lock.amount) : BigNumber.from(0)
          const _lock: LockData = {
            xsLockID: xsLockID,
            unboostedAmount: lock.amount,
            end: lock.end,
            timeLeft: timeLeft,
            boostedValue: stakedLock.value,
            pendingRewards: rewards,
            apr: apr,
          }
          return _lock
        })
      )
      locks.forEach((lock) => {
        pendingRewards = pendingRewards.add(lock.pendingRewards)
        stakedBalance = stakedBalance.add(lock.unboostedAmount)
        if (lock.end.gt(timestamp)) lockedBalance = lockedBalance.add(lock.unboostedAmount)
        else unlockedBalance = unlockedBalance.add(lock.unboostedAmount)
        userValue = userValue.add(lock.boostedValue)
      })
      const userYearlyReturns: BigNumber = valueStaked.gt(BigNumber.from(0))
        ? rewardPerSecond.mul(BigNumber.from(31536000)).mul(userValue).div(valueStaked)
        : BigNumber.from(0)
      const userApr: BigNumber = stakedBalance.gt(BigNumber.from(0)) ? userYearlyReturns.mul(100).div(stakedBalance) : BigNumber.from(0)
      const userInfo: UserLocksInfo = {
        pendingRewards: pendingRewards,
        stakedBalance: stakedBalance,
        lockedBalance: lockedBalance,
        unlockedBalance: unlockedBalance,
        yearlyReturns: userYearlyReturns,
        apr: userApr,
      }
      const data = {
        user: userInfo,
        locks: locks,
        successfulFetch: true,
      }
      return data
    }
}