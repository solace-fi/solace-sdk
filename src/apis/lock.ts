import axios from "axios"
import { BigNumber, Contract, providers, getDefaultProvider } from "ethers"
const { getNetwork } = providers
import { formatUnits } from "ethers/lib/utils"
import {
  STAKING_REWARDS_ADDRESS,
  XSLOCKER_ADDRESS,
  ZERO_ADDRESS,
  DEFAULT_ENDPOINT,
  STAKING_REWARDS_V2_ADDRESS,
  foundNetwork
} from "../constants"

import { xsLocker_ABI, StakingRewards_ABI } from "../"

import { rangeFrom0, sortBNs, withBackoffRetries } from "../utils"
import { getProvider } from "../utils/ethers"
import { LockData, UserLocksInfo, GlobalLockInfo, UserLocksData } from "../types/lock"
import invariant from "tiny-invariant"
import { MulticallProvider } from "../utils/multicall"
import multicall from "ethers-multicall"

export class Lock {
  provider: providers.Provider
  chainId: number
  xslAddr: string
  srAddr: string

  constructor(chainId: number, provider?: providers.Provider) {
    const xslAddr = XSLOCKER_ADDRESS[chainId]
    const srAddr = foundNetwork(chainId)?.features.general.stakingRewardsV2
      ? STAKING_REWARDS_V2_ADDRESS[chainId]
      : STAKING_REWARDS_ADDRESS[chainId]
    invariant(xslAddr, `XSLOCKER_ADDRESS[${chainId}] not found`)
    invariant(srAddr, `STAKING_REWARDS_V2_ADDRESS[${chainId}] or STAKING_REWARDS_ADDRESS[${chainId}] not found`)

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
    return await axios.get("https://stats-cache.solace.fi/analytics-stats.json").then((data: any) => {
      const xsLocker = data.data.xslocker
      return xsLocker
    })
  }

  public async getVotePowerByAccount() {
    function votePowerOfLock(xslock: any, time: any) {
      // The maximum duration of a lock in seconds.
      const MAX_LOCK_DURATION = 60 * 60 * 24 * 365 * 4 // 4 years
      // The vote power multiplier at max lock in bps.
      const MAX_LOCK_MULTIPLIER_BPS = 40000 // 4X
      // The vote power multiplier when unlocked in bps.
      const UNLOCKED_MULTIPLIER_BPS = 10000 // 1X
      // 1 bps = 1/10000
      const MAX_BPS = 10000

      let end = BigNumber.from(xslock.end)
      let amount = BigNumber.from(xslock.amount)
      let base = amount.mul(UNLOCKED_MULTIPLIER_BPS).div(MAX_BPS)
      let bonus = end.lte(time)
        ? 0
        : amount
            .mul(end.sub(time))
            .mul(MAX_LOCK_MULTIPLIER_BPS - UNLOCKED_MULTIPLIER_BPS)
            .div(MAX_LOCK_DURATION * MAX_BPS)
      return base.add(bonus)
    }

    return await axios.get("https://stats-cache.solace.fi/analytics-stats.json").then((data: any) => {
      const xsLocker = data.data.xslocker
      let keys = Object.keys(xsLocker)
      let now = Math.floor(Date.now() / 1000)
      let owners: any = {}
      keys.forEach(chainID => {
        xsLocker[chainID].forEach((xslock: any) => {
          if (!owners.hasOwnProperty(xslock.owner)) owners[xslock.owner] = BigNumber.from(0)
          owners[xslock.owner] = owners[xslock.owner].add(votePowerOfLock(xslock, now))
        })
      })
      let ownerArr: any[] = Object.keys(owners).map(owner => {
        return { name: owner, votePower: formatUnits(owners[owner], 18) }
      })
      ownerArr.sort((a, b) => b.votePower - a.votePower)

      return ownerArr
    })
  }

  public async getGlobalLockStats(): Promise<GlobalLockInfo> {
    const xsl = new Contract(this.xslAddr, xsLocker_ABI, this.provider)
    const sr = new Contract(this.srAddr, StakingRewards_ABI, this.provider)

    if (!xsl || !sr)
      return {
        solaceStaked: "0",
        valueStaked: "0",
        numLocks: "0",
        rewardPerSecond: "0",
        apr: "0",
        successfulFetch: false
      }

    let totalSolaceStaked = BigNumber.from(0)

    const filterLockCreated = xsl.filters.LockCreated()
    const filterLockBurned = xsl.filters.Transfer(null, ZERO_ADDRESS)

    // Ran trials with Multicall vs Promise.all, Promise.all is on average 1s faster
    // Syntax for Multicall slightly more convoluted
    // The concern with Promise.all is that we aren't getting info from the same block
    // But surely if you commence all your network requests at the same time, you can be reasonably sure that they will return information for the same block?
    const [blockTag, rewardPerSecond, valueStaked, lockCreatedEvents, lockBurnedEvents] = await Promise.all([
      this.provider.getBlockNumber(),
      sr.rewardPerSecond(), // across all locks
      sr.valueStaked(), // across all locks
      xsl.queryFilter(filterLockCreated),
      xsl.queryFilter(filterLockBurned)
    ])

    const xsLockIDs_burned = []

    for (const event of lockBurnedEvents) {
      xsLockIDs_burned.push(event.args?.tokenId.toNumber())
    }

    const xsLockIDs = []

    for (const event of lockCreatedEvents) {
      if (!xsLockIDs_burned.includes(event.args?.xsLockID.toNumber())) {
        xsLockIDs.push(event.args?.xsLockID.toNumber())
      }
    }

    const numlocks = xsLockIDs.length

    const locks = await Promise.all(
      xsLockIDs.map(async xsLockID => {
        return withBackoffRetries(async () => xsl.locks(xsLockID, { blockTag: blockTag }))
      })
    )

    locks.forEach((lock: any) => {
      totalSolaceStaked = totalSolaceStaked.add(lock.amount)
    })

    const apr = totalSolaceStaked.gt(0)
      ? rewardPerSecond
          .mul(BigNumber.from(31536000))
          .mul(BigNumber.from(100))
          .div(totalSolaceStaked)
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

  public async getUserLocks(address: string): Promise<UserLocksData> {
    // Is getting the timestamp from the last block, worth waiting for 2 API requests?
    const timestamp = Math.floor(new Date().getTime() / 1000)

    let stakedBalance = BigNumber.from(0) // staked = locked + unlocked
    let lockedBalance = BigNumber.from(0) // measured in SOLACE
    let unlockedBalance = BigNumber.from(0)
    let pendingRewards = BigNumber.from(0)
    let userValue = BigNumber.from(0) // measured in SOLACE * rewards multiplier

    const mcProvider = new MulticallProvider(this.provider, this.chainId)
    let blockTag = await mcProvider._provider.getBlockNumber()
    let xsLocker = new Contract(this.xslAddr, xsLocker_ABI, mcProvider._provider)
    let xsLockerMC = new multicall.Contract(this.xslAddr, xsLocker_ABI)
    const sr = new Contract(this.srAddr, StakingRewards_ABI, this.provider)
    let balance = (await xsLocker.balanceOf(address)).toNumber()
    let indices = rangeFrom0(balance)
    let xsLockIDs = await mcProvider.all(
      indices.map(index => xsLockerMC.tokenOfOwnerByIndex(address, index), { blockTag: blockTag })
    )
    xsLockIDs.sort(sortBNs)

    const [rewardPerSecond, valueStaked] = await Promise.all([
      sr.rewardPerSecond(), // across all locks
      sr.valueStaked() // across all locks from all users
    ])

    const locks: LockData[] = await Promise.all(
      xsLockIDs.map(async xsLockID => {
        const [rewards, lock, stakedLock] = await Promise.all([
          withBackoffRetries(async () => sr.pendingRewardsOfLock(xsLockID)),
          withBackoffRetries(async () => xsLocker.locks(xsLockID)),
          withBackoffRetries(async () => sr.stakedLockInfo(xsLockID))
        ])

        const timeLeft: BigNumber = lock.end.gt(timestamp) ? lock.end.sub(timestamp) : BigNumber.from(0)

        const yearlyReturns: BigNumber = valueStaked.gt(BigNumber.from(0))
          ? rewardPerSecond
              .mul(BigNumber.from(31536000))
              .mul(stakedLock.value)
              .div(valueStaked)
          : BigNumber.from(0)

        const apr: BigNumber = lock.amount.gt(BigNumber.from(0))
          ? yearlyReturns.mul(100).div(lock.amount)
          : BigNumber.from(0)

        const _lock: LockData = {
          xsLockID: xsLockID,
          unboostedAmount: lock.amount,
          end: lock.end,
          timeLeft: timeLeft,
          boostedValue: stakedLock.value,
          pendingRewards: rewards,
          apr: apr
        }

        return _lock
      })
    )

    locks.forEach(lock => {
      pendingRewards = pendingRewards.add(lock.pendingRewards)
      stakedBalance = stakedBalance.add(lock.unboostedAmount)
      if (lock.end.gt(timestamp)) lockedBalance = lockedBalance.add(lock.unboostedAmount)
      else unlockedBalance = unlockedBalance.add(lock.unboostedAmount)
      userValue = userValue.add(lock.boostedValue)
    })

    const userYearlyReturns: BigNumber = valueStaked.gt(BigNumber.from(0))
      ? rewardPerSecond
          .mul(BigNumber.from(31536000))
          .mul(userValue)
          .div(valueStaked)
      : BigNumber.from(0)

    const userApr: BigNumber = stakedBalance.gt(BigNumber.from(0))
      ? userYearlyReturns.mul(100).div(stakedBalance)
      : BigNumber.from(0)

    const userInfo: UserLocksInfo = {
      pendingRewards: pendingRewards,
      stakedBalance: stakedBalance,
      lockedBalance: lockedBalance,
      unlockedBalance: unlockedBalance,
      yearlyReturns: userYearlyReturns,
      apr: userApr
    }

    const data = {
      user: userInfo,
      locks: locks,
      successfulFetch: true
    }

    return data
  }

  public async getUserLockerBalances(
    account: string
  ): Promise<{ stakedBalance: string; lockedBalance: string; unlockedBalance: string }> {
    const timestamp = Math.floor(new Date().getTime() / 1000)
    const xsl = new Contract(this.xslAddr, xsLocker_ABI, this.provider)

    let stakedBalance = BigNumber.from(0) // staked = locked + unlocked
    let lockedBalance = BigNumber.from(0)
    let unlockedBalance = BigNumber.from(0)

    const filterLockCreated = xsl.filters.Transfer(ZERO_ADDRESS, account)
    const filterLockBurned = xsl.filters.Transfer(account, ZERO_ADDRESS)

    const [lockCreatedEvents, lockBurnedEvents] = await Promise.all([
      xsl.queryFilter(filterLockCreated),
      xsl.queryFilter(filterLockBurned)
    ])

    const xsLockIDs_burned = []

    for (const event of lockBurnedEvents) {
      xsLockIDs_burned.push(event.args?.tokenId.toNumber())
    }

    const xsLockIDs = []

    for (const event of lockCreatedEvents) {
      if (!xsLockIDs_burned.includes(event.args?.tokenId.toNumber())) {
        xsLockIDs.push(event.args?.tokenId.toNumber())
      }
    }

    const locks = await Promise.all(
      xsLockIDs.map(async xsLockID => {
        return await withBackoffRetries(async () => xsl.locks(xsLockID))
      })
    )

    locks.forEach(lock => {
      stakedBalance = stakedBalance.add(lock.amount)
      if (lock.end.gt(timestamp)) lockedBalance = lockedBalance.add(lock.amount)
      else unlockedBalance = unlockedBalance.add(lock.amount)
    })

    return {
      stakedBalance: formatUnits(stakedBalance, 18),
      lockedBalance: formatUnits(lockedBalance, 18),
      unlockedBalance: formatUnits(unlockedBalance, 18)
    }
  }
}
