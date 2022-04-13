import axios from "axios"
import { BigNumber, Contract, providers, getDefaultProvider } from 'ethers'
const { getNetwork } = providers
import { formatUnits } from "ethers/lib/utils"
import { STAKING_REWARDS_ADDRESS, XSLOCKER_ADDRESS } from "../constants"
import xsLocker from '../abis/xsLocker.json'
import stakingRewards from '../abis/StakingRewards.json'
import { rangeFrom0, withBackoffRetries } from "../utils"
import { getProvider } from "../utils/ethers"

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

    public async getGlobalStats (chainId: number) {
      const xslAddr = XSLOCKER_ADDRESS[chainId]
      const srAddr = STAKING_REWARDS_ADDRESS[chainId]
      if (!xslAddr || !srAddr) return {
        solaceStaked: BigNumber.from(0),
        valueStaked: BigNumber.from(0),
        numLocks: BigNumber.from(0),
        rewardPerSecond: BigNumber.from(0),
        apr: BigNumber.from(0),
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
        rewardPerSecond: rewardPerSecond,
      }
    }
}