import axios from "axios"
import { BigNumber, Contract, providers, getDefaultProvider } from 'ethers'
const { getNetwork } = providers
import { formatUnits } from "ethers/lib/utils"
import { DEFAULT_ENDPOINT, STAKING_REWARDS_ADDRESS, XSLOCKER_ADDRESS } from "../constants"
import xsLocker from '../abis/xsLocker.json'
import stakingRewards from '../abis/StakingRewards.json'
import { rangeFrom0, withBackoffRetries } from "../utils"
import { getProvider } from "../utils/ethers"
import { LockData, UserLocksInfo, GlobalLockInfo, UserLocksData } from "../types/lock"
import { MulticallContract, MulticallProvider } from "../utils/multicall";
import invariant from "tiny-invariant"

export class Lock {

    provider: providers.Provider
    chainId: number
    xslAddr: string
    srAddr: string

    constructor(chainId: number, provider?: providers.Provider) {
      const xslAddr = XSLOCKER_ADDRESS[chainId]
      const srAddr = STAKING_REWARDS_ADDRESS[chainId]
      invariant(xslAddr, `XSLOCKER_ADDRESS[${chainId}] not found`)
      invariant(srAddr, `STAKING_REWARDS_ADDRESS[${chainId}] not found`)

      this.xslAddr = xslAddr
      this.srAddr = srAddr

      if (!provider) {
        if (DEFAULT_ENDPOINT[chainId]) {
          this.provider = getProvider(DEFAULT_ENDPOINT[chainId])
        } else {
          this.provider = getDefaultProvider(getNetwork(chainId))
        }
      } else {
        this.provider = provider
      }
      this.chainId = chainId
    }

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

    public async getGlobalLockStats (): Promise<GlobalLockInfo> {

      let _provider_multicall = null

      if (DEFAULT_ENDPOINT[this.chainId]) {
          _provider_multicall = new MulticallProvider(this.provider, this.chainId)
      } else {
          _provider_multicall = new MulticallProvider(this.provider, this.chainId)
      }

      const xsl_multicall = new MulticallContract(this.xslAddr, xsLocker)
      const sr_multicall = new MulticallContract(this.srAddr, stakingRewards)
      const xsl = new Contract(this.xslAddr, xsLocker, this.provider)
      let totalSolaceStaked = BigNumber.from(0)

      const [blockTag, [rewardPerSecond, valueStaked, numlocks]] = await Promise.all([
        this.provider.getBlockNumber(),
        _provider_multicall.all([
          sr_multicall.rewardPerSecond(), // across all locks
          sr_multicall.valueStaked(), // across all locks
          xsl_multicall.totalSupply(),
        ])
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

      locks.forEach((lock: any) => {
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

    public async getUserLocks (address: string): Promise<UserLocksData> {

      const xsl = new Contract(this.xslAddr, xsLocker, this.provider)
      const sr = new Contract(this.srAddr, stakingRewards, this.provider)

      // const blockTag = await _provider.getBlockNumber()
      // const latestBlock = await _provider.getBlock(blockTag)
      // const timestamp = latestBlock.timestamp

      // Is getting the timestamp from the last block, worth waiting for 2 API requests?
      const timestamp = Math.floor ( new Date().getTime() / 1000 )

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
          // const rewards: BigNumber = await withBackoffRetries(async () => sr.pendingRewardsOfLock(xsLockID))
          // const lock = await withBackoffRetries(async () => xsl.locks(xsLockID))
          // const stakedLock = await withBackoffRetries(async () => sr.stakedLockInfo(xsLockID))

          const [rewards, lock, stakedLock] = await Promise.all([
            withBackoffRetries(async () => sr.pendingRewardsOfLock(xsLockID)),
            withBackoffRetries(async () => xsl.locks(xsLockID)),
            withBackoffRetries(async () => sr.stakedLockInfo(xsLockID))
          ])

          const timeLeft: BigNumber = lock.end.gt(timestamp) ? lock.end.sub(timestamp) : BigNumber.from(0)

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

    public async getUserLockerBalances (account: string): Promise<{ stakedBalance: string, lockedBalance: string, unlockedBalance: string }> {
      const block = await this.provider.getBlock('latest')
      const timestamp = block.timestamp

      const xsl = new Contract(this.xslAddr, xsLocker, this.provider)

      let stakedBalance = BigNumber.from(0) // staked = locked + unlocked
      let lockedBalance = BigNumber.from(0)
      let unlockedBalance = BigNumber.from(0)
      const numLocks = await withBackoffRetries(async () => xsl.balanceOf(account))
      const indices = rangeFrom0(numLocks.toNumber())
      const xsLockIDs = await Promise.all(
        indices.map(async (index) => {
          return await withBackoffRetries(async () => xsl.tokenOfOwnerByIndex(account, index))
        })
      )
      const locks = await Promise.all(
        xsLockIDs.map(async (xsLockID) => {
          return await withBackoffRetries(async () => xsl.locks(xsLockID))
        })
      )
      locks.forEach((lock) => {
        stakedBalance = stakedBalance.add(lock.amount)
        if (lock.end.gt(timestamp)) lockedBalance = lockedBalance.add(lock.amount)
        else unlockedBalance = unlockedBalance.add(lock.amount)
      })

      return {
        stakedBalance: formatUnits(stakedBalance, 18),
        lockedBalance: formatUnits(lockedBalance, 18),
        unlockedBalance: formatUnits(unlockedBalance, 18),
      }
    }
}