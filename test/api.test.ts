import { Fetcher } from "../src"

describe("Fetcher API call", () => {
    const fetcher = new Fetcher(1);
    const POLICYHOLDER_ADDRESS = "0xfb5cAAe76af8D3CE730f3D62c6442744853d43Ef" // Use first policy minted
    let positions:any;

    beforeEach(() => {
        // Avoid jest avoid timeout error
        jest.setTimeout(30000);
    })

    describe("#getSolaceRiskBalances", () => {
        it("will return a valid response", async () => {
            positions = await fetcher.getSolaceRiskBalances(POLICYHOLDER_ADDRESS)
            console.log(positions)
        })
    })

    describe("#getSolaceRiskScores", () => {
        it("will return a valid response", async () => {
            const scores = await fetcher.getSolaceRiskScores(POLICYHOLDER_ADDRESS, positions)
            console.log(scores)
        })
    })
})