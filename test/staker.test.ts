import { BigNumber, Contract, getDefaultProvider, providers } from "ethers"
const { getNetwork } = providers
import { 
    DEFAULT_ENDPOINT, 
    Staker, 
    STAKING_REWARDS_V2_ADDRESS, 
    XSLOCKER_ADDRESS,
    xsLocker_ABI,
    StakingRewards_ABI,
} from "../src"

import { getProvider } from "../src/utils/ethers"

describe("Staker", () => {
    const chainId = 1      

    const provider = DEFAULT_ENDPOINT[chainId] ? getProvider(DEFAULT_ENDPOINT[chainId]) : getDefaultProvider(getNetwork(chainId)) // Note using default provider gets rate-limit notification
    const xsLocker_contract = new Contract(XSLOCKER_ADDRESS[chainId], xsLocker_ABI, provider)
    const stakingRewards_contract = new Contract(STAKING_REWARDS_V2_ADDRESS[chainId], StakingRewards_ABI, provider)
    let staker = new Staker(chainId, provider);

    const STAKER_ADDRESS = "0xA400f843f0E577716493a3B0b8bC654C6EE8a8A3" // Use first policy minted
    const LOCKER_ID = BigNumber.from(1);

    beforeEach(() => {
        // Avoid jest avoid timeout error
        jest.setTimeout(10000);
    })

    describe("constructor check for chainID", () => {
        it("will fail for invalid chainID", async () => {
            expect(() => {staker = new Staker(999999, provider)}).toThrowError
        })
    })

    describe("can construct object for fantom testnet", () => {
        it("will fail for invalid chainID", async () => {
            staker = new Staker(4002, provider)
            staker = new Staker(chainId, provider)
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
            const [timeLeft1, timeLeft2] = await Promise.all([
                staker.timeLeft(LOCKER_ID),
                xsLocker_contract.timeLeft(LOCKER_ID)
            ])

            expect(timeLeft1.toNumber()).toBeLessThan(timeLeft2.toNumber() * 1.01)
            expect(timeLeft1.toNumber()).toBeGreaterThan(timeLeft2.toNumber() * 0.99)
            
            // expect(await staker.timeLeft(LOCKER_ID)).toEqual(await xsLocker_contract.timeLeft(LOCKER_ID));
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
            const [pendingReward1, pendingRewards2] = await Promise.all([
                staker.pendingRewardsOfLock(LOCKER_ID),
                stakingRewards_contract.pendingRewardsOfLock(LOCKER_ID),
            ])

            expect(pendingReward1).toEqual(pendingRewards2)  
        })
    })

})