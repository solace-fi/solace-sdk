import { BigNumber as BN, Contract, getDefaultProvider, providers } from "ethers"
const { getNetwork } = providers
import { Fetcher, SOLACE_COVER_PRODUCT_ADDRESS } from "../src"
import SolaceCoverProduct from "../src/abis/SolaceCoverProduct.json"

describe("Fetcher", () => {
    const provider = getDefaultProvider(getNetwork(1)) // Note using default provider gets rate-limit notification
    const solaceCoverProduct = new Contract(SOLACE_COVER_PRODUCT_ADDRESS[1], SolaceCoverProduct, provider)
    let fetcher = new Fetcher(1);
    const POLICYHOLDER_ADDRESS = "0xfb5cAAe76af8D3CE730f3D62c6442744853d43Ef" // Use first policy minted
    const POLICY_ID = 1;
    const COVER_LIMIT = BN.from("1000000000000000000") // 1 USD
    const REFERRAL_CODE = "0x5406a8636b0cb38db066f2c87ea88d2d882d3407a5fdbba95cd70df2e43817a75643fa22feaf4b550f153d13c3f2eaa68626194291646b0fc1a06d6ca8c371001b"
    const FAKE_REFERRAL_CODE = "0xe4e7cba021ff6b83b14d54016198f31b04cba044d71d9a8b9bdf964aa2259cc3b207237f814aa56e516638b448edc43a6c3f4637dca5de54cb199e37b039a832e7"

    beforeEach(() => {
        // Avoid jest avoid timeout error
        jest.setTimeout(10000);
    })

    describe("constructor check for chainID", () => {
        it("will fail for invalid chainID", async () => {
            expect(() => {fetcher = new Fetcher(999999)}).toThrowError
        })
    })

    describe("#activeCoverLimit", () => {
        it("gets the same value as directly querying mainnet contract", async () => {
            expect(await fetcher.activeCoverLimit()).toEqual(await solaceCoverProduct.activeCoverLimit());
        })
    })

    describe("#availableCoverCapacity", () => {
        it("gets the same value as directly querying mainnet contract", async () => {
            expect(await fetcher.availableCoverCapacity()).toEqual(await solaceCoverProduct.availableCoverCapacity());
        })
    })

    describe("#maxCover", () => {
        it("gets the same value as directly querying mainnet contract", async () => {
            expect(await fetcher.maxCover()).toEqual(await solaceCoverProduct.maxCover());
        })
    })

    describe("#policyCount", () => {
        it("gets the same value as directly querying mainnet contract", async () => {
            expect(await fetcher.policyCount()).toEqual(await solaceCoverProduct.policyCount());
        })
    })

    describe("#accountBalanceOf", () => {
        it("gets the same value as directly querying mainnet contract", async () => {
            expect(await fetcher.accountBalanceOf(POLICYHOLDER_ADDRESS)).toEqual(await solaceCoverProduct.accountBalanceOf(POLICYHOLDER_ADDRESS));
        })
    })

    describe("#coverLimitOf", () => {
        it("gets the same value as directly querying mainnet contract", async () => {
            expect(await fetcher.coverLimitOf(POLICY_ID)).toEqual(await solaceCoverProduct.coverLimitOf(POLICY_ID));
        })
    })

    describe("#minRequiredAccountBalance", () => {
        it("gets the same value as directly querying mainnet contract", async () => {
            expect(await fetcher.minRequiredAccountBalance(COVER_LIMIT)).toEqual(await solaceCoverProduct.minRequiredAccountBalance(COVER_LIMIT));
        })
    })

    describe("#policyStatus", () => {
        it("gets the same value as directly querying mainnet contract", async () => {
            expect(await fetcher.policyStatus(POLICY_ID)).toEqual(await solaceCoverProduct.policyStatus(POLICY_ID));
        })
    })

    describe("#policyOf", () => {
        it("gets the same value as directly querying mainnet contract", async () => {
            expect(await fetcher.policyOf(POLICYHOLDER_ADDRESS)).toEqual(await solaceCoverProduct.policyOf(POLICYHOLDER_ADDRESS));
        })
    })

    describe("#rewardPointsOf", () => {
        it("gets the same value as directly querying mainnet contract", async () => {
            expect(await fetcher.rewardPointsOf(POLICYHOLDER_ADDRESS)).toEqual(await solaceCoverProduct.rewardPointsOf(POLICYHOLDER_ADDRESS));
        })
    })

    describe("#isReferralCodeUsed", () => {
        it("gets the same value as directly querying mainnet contract", async () => {
            expect(await fetcher.isReferralCodeUsed(POLICYHOLDER_ADDRESS)).toEqual(await solaceCoverProduct.isReferralCodeUsed(POLICYHOLDER_ADDRESS));
        })
    })

    describe("#getReferrerFromReferralCode", () => {
        it("gets the correct value", async () => {
            expect(await fetcher.getReferrerFromReferralCode(REFERRAL_CODE)).toEqual("0x1e35c3a9493e6bab9C6c2Ee2181B08A845697Ee2");
        })
    })

    describe("#isReferralCodeValid", () => {
        it("returns true for valid referral code", async () => {
            expect(await fetcher.isReferralCodeValid(REFERRAL_CODE)).toEqual(true);
            expect(await fetcher.isReferralCodeValid(FAKE_REFERRAL_CODE)).toEqual(false);
        })
    })
})