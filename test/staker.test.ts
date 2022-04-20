import { Contract, getDefaultProvider, providers } from "ethers"
const { getNetwork } = providers
import { Staker, STAKING_REWARDS_ADDRESS, XSLOCKER_ADDRESS } from "../src"
import { expectClose } from "../src/utils/test"

import xsLocker from "../src/abis/xsLocker.json"
import StakingRewards from "../src/abis/StakingRewards.json"

describe("Staker", () => {
    const provider = getDefaultProvider(getNetwork(1)) // Note using default provider gets rate-limit notification
    const xsLocker_contract = new Contract(XSLOCKER_ADDRESS[1], xsLocker, provider)
    const stakingRewards_contract = new Contract(STAKING_REWARDS_ADDRESS[1], StakingRewards, provider)
    let staker = new Staker(1, provider);

    const STAKER_ADDRESS = "0xA400f843f0E577716493a3B0b8bC654C6EE8a8A3" // Use first policy minted
    const LOCKER_ID = 1;

    beforeEach(() => {
        // Avoid jest avoid timeout error
        jest.setTimeout(10000);
    })

    describe("constructor check for chainID", () => {
        it("will fail for invalid chainID", async () => {
            expect(() => {staker = new Staker(999999, provider)}).toThrowError
        })
    })

    /**********************************
    xsLocker View Functions
    **********************************/

    describe("#locks", () => {
        it("gets the same value as directly querying mainnet contract", async () => {
            expect(await staker.locks(LOCKER_ID)).toEqual(await xsLocker_contract.locks(LOCKER_ID));
        })
    })

    describe("#isLocked", () => {
        it("gets the same value as directly querying mainnet contract", async () => {
            expect(await staker.isLocked(LOCKER_ID)).toEqual(await xsLocker_contract.isLocked(LOCKER_ID));
        })
    })

    describe("#timeLeft", () => {
        it("gets the same value as directly querying mainnet contract", async () => {
            expect(await staker.timeLeft(LOCKER_ID)).toEqual(await xsLocker_contract.timeLeft(LOCKER_ID));
        })
    })

    describe("#stakedBalance", () => {
        it("gets the same value as directly querying mainnet contract", async () => {
            expect(await staker.stakedBalance(STAKER_ADDRESS)).toEqual(await xsLocker_contract.stakedBalance(STAKER_ADDRESS));
        })
    })

    /**********************************
    StakingRewards View Functions
    **********************************/

    describe("#stakedLockInfo", () => {
        it("gets the same value as directly querying mainnet contract", async () => {
            expect(await staker.stakedLockInfo(LOCKER_ID)).toEqual(await stakingRewards_contract.stakedLockInfo(LOCKER_ID));
        })
    })

    describe("#pendingRewardsOfLock", () => {
        it("gets the same value as directly querying mainnet contract", async () => {
            expectClose(await staker.pendingRewardsOfLock(LOCKER_ID), await stakingRewards_contract.pendingRewardsOfLock(LOCKER_ID), 1e13)
        })
    })

})