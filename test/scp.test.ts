import { Contract, providers } from "ethers"
import { COVERAGE_SCP_ADDRESS } from "../src" // COVER_PAYMENT_MANAGER_ADDRESS
import { SCP } from "../src/contracts"
import SCP_ABI from "../src/abis/SCP.json"
// import CoverPaymentManager from "../src/abis/CoverPaymentManager.json"

describe("Coverage V3", () => {
    const provider = new providers.JsonRpcProvider("https://rpc.testnet.fantom.network/")
    const scp_ethers = new Contract(COVERAGE_SCP_ADDRESS[4002], SCP_ABI, provider)
    // const coverage_payment_manager = new Contract(COVER_PAYMENT_MANAGER_ADDRESS[4002], CoverPaymentManager, provider)
    let scp_sdk = new SCP(4002);

    const POLICYHOLDER_ADDRESS = "0xfb5cAAe76af8D3CE730f3D62c6442744853d43Ef" // Use first policy minted

    beforeEach(() => {
        // Avoid jest avoid timeout error
        jest.setTimeout(10000);
    })

    describe("constructor check for chainID", () => {
        it("will fail for invalid chainID", async () => {
            expect(() => {scp_sdk = new SCP(999999)}).toThrowError
        })
    })

    describe("#minScpRequired", () => {
        it("gets the same value as directly querying mainnet contract", async () => {
            expect(await scp_sdk.minScpRequired(POLICYHOLDER_ADDRESS)).toEqual(await scp_ethers.minScpRequired(POLICYHOLDER_ADDRESS));
        })
    })

    describe("#balanceOfNonRefundable", () => {
        it("gets the same value as directly querying mainnet contract", async () => {
            expect(await scp_sdk.balanceOfNonRefundable(POLICYHOLDER_ADDRESS)).toEqual(await scp_ethers.balanceOfNonRefundable(POLICYHOLDER_ADDRESS));
        })
    })

    describe("#balanceOf", () => {
        it("gets the same value as directly querying mainnet contract", async () => {
            expect(await scp_sdk.balanceOf(POLICYHOLDER_ADDRESS)).toEqual(await scp_ethers.balanceOf(POLICYHOLDER_ADDRESS));
        })
    })

    // TO-DO
    // describe("#getRefundableSOLACEAmount", () => {
    //     it("gets the same value as directly querying mainnet contract", async () => {
    //         expect(await scp_sdk.getRefundableSOLACEAmount(POLICYHOLDER_ADDRESS)).toEqual(await scp_ethers.balanceOf(POLICYHOLDER_ADDRESS));
    //     })
    // })
})