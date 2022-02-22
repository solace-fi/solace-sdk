import { Wallet, getDefaultProvider, providers } from "ethers"
const { getNetwork } = providers
import { Policyholder } from "../src"

describe("Policyholder", () => {
    const PRIVATE_KEY = "5ba7c22bfe3ff8c1bc026edd63e8d32e6f874ce0fedbcc28c1d0b60b44bd210c" // Random private key from https://privatekeys.pw/keys/ethereum/random
    const wallet = new Wallet(PRIVATE_KEY, getDefaultProvider(getNetwork(1)));
    const policyholder = new Policyholder(1, wallet);

    describe("#getReferralCode", () => {
        it("gets the correct referral code", async () => {
            expect(await policyholder.getReferralCode()).toEqual("0x5406a8636b0cb38db066f2c87ea88d2d882d3407a5fdbba95cd70df2e43817a75643fa22feaf4b550f153d13c3f2eaa68626194291646b0fc1a06d6ca8c371001b")
        })
    })

    // Can't really test the mutator functions in a unit test in this environment, blockchain altering function calls
})