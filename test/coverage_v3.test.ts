import { BigNumber as BN, Contract, providers } from "ethers"
import { SOLACE_COVER_PRODUCT_V3_ADDRESS } from "../src"
import { CoverageV3 } from "../src/contracts/coverage_v3"
import SolaceCoverProductV3 from "../src/abis/SolaceCoverProductV3.json"

describe("Coverage V3", () => {
    const provider = new providers.JsonRpcProvider("https://rpc.testnet.fantom.network/")
    const solaceCoverProduct = new Contract(SOLACE_COVER_PRODUCT_V3_ADDRESS[4002], SolaceCoverProductV3, provider)
    let coverage = new CoverageV3(4002);

    const POLICYHOLDER_ADDRESS = "0xfb5cAAe76af8D3CE730f3D62c6442744853d43Ef" // Use first policy minted
    const POLICY_ID = 1;
    const COVER_LIMIT = BN.from("1000000000000000000") // 1 USD

    beforeEach(() => {
        // Avoid jest avoid timeout error
        jest.setTimeout(10000);
    })

    describe("constructor check for chainID", () => {
        it("will fail for invalid chainID", async () => {
            expect(() => {coverage = new CoverageV3(999999)}).toThrowError
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

    describe("#calculateCancelFee", () => {
        it("gets the same value as directly querying mainnet contract", async () => {
            expect(await coverage.calculateCancelFee(POLICY_ID)).toEqual(await solaceCoverProduct.calculateCancelFee(POLICY_ID));
        })
    })

    // tokenURI call will revert with Solidity error string - "invalid policy"
    // describe("#tokenURI", () => {
    //     it("gets the same value as directly querying mainnet contract", async () => {
    //         expect(await coverage.tokenURI(POLICY_ID)).toEqual(await solaceCoverProduct.tokenURI(POLICY_ID));
    //     })
    // })

    describe("#minScpRequired", () => {
        it("gets the same value as directly querying mainnet contract", async () => {
            expect(await coverage.minScpRequired(POLICYHOLDER_ADDRESS)).toEqual(await solaceCoverProduct.minScpRequired(POLICYHOLDER_ADDRESS));
        })
    })

    describe("#coverLimitOf", () => {
        it("gets the same value as directly querying mainnet contract", async () => {
            expect(await coverage.coverLimitOf(POLICY_ID)).toEqual(await solaceCoverProduct.coverLimitOf(POLICY_ID));
        })
    })

    describe("#policyOf", () => {
        it("gets the same value as directly querying mainnet contract", async () => {
            expect(await coverage.policyOf(POLICYHOLDER_ADDRESS)).toEqual(await solaceCoverProduct.policyOf(POLICYHOLDER_ADDRESS));
        })
    })

    describe("#debtOf", () => {
        it("gets the same value as directly querying mainnet contract", async () => {
            expect(await coverage.debtOf(POLICYHOLDER_ADDRESS)).toEqual(await solaceCoverProduct.debtOf(POLICYHOLDER_ADDRESS));
        })
    })

    describe("#policyCount", () => {
        it("gets the same value as directly querying mainnet contract", async () => {
            expect(await coverage.policyCount()).toEqual(await solaceCoverProduct.policyCount());
        })
    })

    describe("#chargeCycle", () => {
        it("gets the same value as directly querying mainnet contract", async () => {
            expect(await coverage.chargeCycle()).toEqual(await solaceCoverProduct.chargeCycle());
        })
    })

    describe("#paused", () => {
        it("gets the same value as directly querying mainnet contract", async () => {
            expect(await coverage.paused()).toEqual(await solaceCoverProduct.paused());
        })
    })

    describe("#latestChargedTime", () => {
        it("gets the same value as directly querying mainnet contract", async () => {
            expect(await coverage.latestChargedTime()).toEqual(await solaceCoverProduct.latestChargedTime());
        })
    })
})