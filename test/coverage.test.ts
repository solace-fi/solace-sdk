import { BigNumber as BN, Contract, getDefaultProvider, providers, Wallet } from "ethers"
const { getNetwork } = providers
import { SOLACE_COVER_PRODUCT_ADDRESS } from "../src"
import { Coverage } from "../src/contracts/coverage"
import SolaceCoverProduct from "../src/abis/SolaceCoverProduct.json"
import SolaceCoverProductV2 from "../src/abis/SolaceCoverProductV2.json"

describe("Coverage Fetcher", () => {
    const provider = getDefaultProvider(getNetwork(1)) // Note using default provider gets rate-limit notification
    const solaceCoverProduct = new Contract(SOLACE_COVER_PRODUCT_ADDRESS[1], SolaceCoverProduct, provider)
    let coverage = new Coverage(1);

    const provider_matic = new providers.JsonRpcProvider("https://polygon-rpc.com")
    const solaceCoverProductV2 = new Contract(SOLACE_COVER_PRODUCT_ADDRESS[137], SolaceCoverProductV2, provider_matic)
    let coverage_matic = new Coverage(137);

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
            expect(() => {coverage = new Coverage(999999)}).toThrowError
        })
    })

    describe("#activeCoverLimit", () => {
        it("gets the same value as directly querying mainnet contract", async () => {
            expect(await coverage.activeCoverLimit()).toEqual(await solaceCoverProduct.activeCoverLimit());
        })
    })

    describe("#availableCoverCapacity", () => {
        it("gets the same value as directly querying mainnet contract", async () => {
            expect(await coverage.availableCoverCapacity()).toEqual(await solaceCoverProduct.availableCoverCapacity());
        })
    })

    describe("#maxCover", () => {
        it("gets the same value as directly querying mainnet contract", async () => {
            expect(await coverage.maxCover()).toEqual(await solaceCoverProduct.maxCover());
        })
    })

    describe("#policyCount", () => {
        it("gets the same value as directly querying mainnet contract", async () => {
            expect(await coverage.policyCount()).toEqual(await solaceCoverProduct.policyCount());
        })
    })

    describe("#accountBalanceOf", () => {
        it("gets the same value as directly querying mainnet contract", async () => {
            expect(await coverage.accountBalanceOf(POLICYHOLDER_ADDRESS)).toEqual(await solaceCoverProduct.accountBalanceOf(POLICYHOLDER_ADDRESS));
        })
    })

    describe("#coverLimitOf", () => {
        it("gets the same value as directly querying mainnet contract", async () => {
            expect(await coverage.coverLimitOf(POLICY_ID)).toEqual(await solaceCoverProduct.coverLimitOf(POLICY_ID));
        })
    })

    describe("#minRequiredAccountBalance", () => {
        it("gets the same value as directly querying mainnet contract", async () => {
            expect(await coverage.minRequiredAccountBalance(COVER_LIMIT)).toEqual(await solaceCoverProduct.minRequiredAccountBalance(COVER_LIMIT));
        })
    })

    describe("#policyStatus", () => {
        it("gets the same value as directly querying mainnet contract", async () => {
            expect(await coverage.policyStatus(POLICY_ID)).toEqual(await solaceCoverProduct.policyStatus(POLICY_ID));
        })
    })

    describe("#policyOf", () => {
        it("gets the same value as directly querying mainnet contract", async () => {
            expect(await coverage.policyOf(POLICYHOLDER_ADDRESS)).toEqual(await solaceCoverProduct.policyOf(POLICYHOLDER_ADDRESS));
        })
    })

    describe("#rewardPointsOf", () => {
        it("gets the same value as directly querying mainnet contract", async () => {
            expect(await coverage.rewardPointsOf(POLICYHOLDER_ADDRESS)).toEqual(await solaceCoverProduct.rewardPointsOf(POLICYHOLDER_ADDRESS));
        })
    })

    describe("#cooldownStart", () => {
        it("gets the same value as directly querying mainnet contract", async () => {
            expect(await coverage.cooldownStart(POLICYHOLDER_ADDRESS)).toEqual(await solaceCoverProduct.cooldownStart(POLICYHOLDER_ADDRESS));
        })
    })

    describe("#isReferralCodeUsed", () => {
        it("gets the same value as directly querying mainnet contract", async () => {
            expect(await coverage.isReferralCodeUsed(POLICYHOLDER_ADDRESS)).toEqual(await solaceCoverProduct.isReferralCodeUsed(POLICYHOLDER_ADDRESS));
        })
    })

    describe("#getReferrerFromReferralCode", () => {
        it("gets the correct value", async () => {
            expect(await coverage.getReferrerFromReferralCode(REFERRAL_CODE)).toEqual("0x1e35c3a9493e6bab9C6c2Ee2181B08A845697Ee2");
        })
    })

    describe("#isReferralCodeValid", () => {
        it("returns true for valid referral code", async () => {
            expect(await coverage.isReferralCodeValid(REFERRAL_CODE)).toEqual(true);
            expect(await coverage.isReferralCodeValid(FAKE_REFERRAL_CODE)).toEqual(false);
        })
    })

    /****************************
    SOLACECOVERPRODUCTV2 METHODS
    ****************************/

    describe("#premiumsPaidOf", () => {
        it("gets the same value as directly querying mainnet contract", async () => {
            expect(await coverage_matic.premiumsPaidOf(POLICYHOLDER_ADDRESS)).toEqual(await solaceCoverProductV2.premiumsPaidOf(POLICYHOLDER_ADDRESS));
        })
    })

    describe("#getPolicyChainInfo", () => {
        it("gets the same value as directly querying mainnet contract", async () => {
            expect(await coverage_matic.getPolicyChainInfo(POLICY_ID)).toEqual(await solaceCoverProductV2.getPolicyChainInfo(POLICY_ID));
            console.log(await coverage_matic.getPolicyChainInfo(POLICY_ID))
        })
    })

    describe("#getChain", () => {
        it("gets the same value as directly querying matic contract", async () => {
            expect(await coverage_matic.getChain(1)).toEqual(await solaceCoverProductV2.getChain(1));
        })
    })

    describe("#getNumSupportedChains", () => {
        it("gets the same value as directly querying matic contract", async () => {
            expect(await coverage_matic.numSupportedChains()).toEqual(await solaceCoverProductV2.numSupportedChains());
        })
    })
})

describe("Policyholder", () => {
    const PRIVATE_KEY = "5ba7c22bfe3ff8c1bc026edd63e8d32e6f874ce0fedbcc28c1d0b60b44bd210c" // Random private key from https://privatekeys.pw/keys/ethereum/random
    const wallet = new Wallet(PRIVATE_KEY, getDefaultProvider(getNetwork(1)));
    let coverage = new Coverage(1, wallet);

    describe("#getReferralCode", () => {
        it("gets the correct referral code", async () => {
            expect(await coverage.getReferralCode(1)).toEqual("0x5406a8636b0cb38db066f2c87ea88d2d882d3407a5fdbba95cd70df2e43817a75643fa22feaf4b550f153d13c3f2eaa68626194291646b0fc1a06d6ca8c371001b")
        })
    })
})