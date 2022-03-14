import { Fetcher } from "../src"

describe("Fetcher API call", () => {
    let fetcher = new Fetcher(1);
    const POLICYHOLDER_ADDRESS = "0xfb5cAAe76af8D3CE730f3D62c6442744853d43Ef" // Use first policy minted
    let positions_singlechain:any;
    let positions_multichain:any;

    beforeEach(() => {
        // Avoid jest avoid timeout error
        jest.setTimeout(30000);
    })

    describe("constructor check for chainID", () => {
        it("will fail for invalid chainID", async () => {
            expect(() => {fetcher = new Fetcher(999999)}).toThrowError
        })
    })

    describe("#getSolaceRiskBalances_SingleChain", () => {
        it("will return a valid response", async () => {
            positions_singlechain = await fetcher.getSolaceRiskBalances(POLICYHOLDER_ADDRESS)
            console.log(positions_singlechain)
        })
    })

    describe("#getSolaceRiskBalances_MultiChain", () => {
        it("will fail for an unsupported chain", async () => {
            expect(async () => {await fetcher.getSolaceRiskBalances_MultiChain(POLICYHOLDER_ADDRESS, [1, 150])}).toThrowError
        })
        it("will return a valid response", async () => {
            positions_multichain = await fetcher.getSolaceRiskBalances_MultiChain(POLICYHOLDER_ADDRESS, [1, 137])
            console.log(positions_multichain)
        })
    })

    describe("#getSolaceRiskScores - Single Chain", () => {
        it("will return a valid response", async () => {
            const scores_singlechain = await fetcher.getSolaceRiskScores(POLICYHOLDER_ADDRESS, positions_singlechain)
            console.log(scores_singlechain)
        })
    })

    describe("#getSolaceRiskScores - Multi Chain", () => {
        it("will return a valid response", async () => {
            const scores_multichain = await fetcher.getSolaceRiskScores(POLICYHOLDER_ADDRESS, positions_multichain)
            console.log(scores_multichain)
        })
    })

    describe("#getSolaceRiskSeries", () => {
        it("will return a valid response", async () => {
            const risk_series = await fetcher.getSolaceRiskSeries()
            console.log(risk_series)
        })
    })
})