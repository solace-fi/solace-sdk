import { Risk } from "../src/apis/risk"

describe("Risk API call", () => {
    let risk_fetcher = new Risk();
    const POLICYHOLDER_ADDRESS = "0xfb5cAAe76af8D3CE730f3D62c6442744853d43Ef" // Use first policy minted
    let positions_singlechain:any;
    let positions_multichain:any;

    beforeEach(() => {
        // Avoid jest avoid timeout error
        jest.setTimeout(20000);
    })

    describe("#getSolaceRiskBalances - Single Chain", () => {
        it("will return a valid response", async () => {
            await risk_fetcher.getSolaceRiskBalances(POLICYHOLDER_ADDRESS, 1)
            // positions_singlechain = await risk_fetcher.getSolaceRiskBalances(POLICYHOLDER_ADDRESS, 1)
            // console.log(positions_singlechain)
        })
    })

    describe("#getSolaceRiskBalances - Multi Chain", () => {
        it("will fail for an unsupported chain", async () => {
            expect(async () => {await risk_fetcher.getSolaceRiskBalances(POLICYHOLDER_ADDRESS, [1, 150])}).toThrowError
        })
        it("will return a valid response", async () => {
            await risk_fetcher.getSolaceRiskBalances(POLICYHOLDER_ADDRESS, [1, 137])
            // positions_multichain = await risk_fetcher.getSolaceRiskBalances(POLICYHOLDER_ADDRESS, [1, 137])
            // console.log(positions_multichain)
        })
    })

    describe("#getSolaceRiskScores - Single Chain", () => {
        it("will return a valid response", async () => {
            await risk_fetcher.getSolaceRiskScores(POLICYHOLDER_ADDRESS, positions_singlechain)
            // const scores_singlechain = await risk_fetcher.getSolaceRiskScores(POLICYHOLDER_ADDRESS, positions_singlechain)
            // console.log(scores_singlechain)
        })
    })

    describe("#getSolaceRiskScores - Multi Chain", () => {
        it("will return a valid response", async () => {
            await risk_fetcher.getSolaceRiskScores(POLICYHOLDER_ADDRESS, positions_multichain)
            // const scores_multichain = await risk_fetcher.getSolaceRiskScores(POLICYHOLDER_ADDRESS, positions_multichain)
            // console.log(scores_multichain)
        })
    })

    describe("#getSolaceRiskPremium", () => {
        it("will fail for an unsupported chain", async () => {
            expect(async () => {await risk_fetcher.getSolaceRiskPremium(POLICYHOLDER_ADDRESS, 150)}).toThrowError
        })
        it("will return a valid response", async () => {
            await risk_fetcher.getSolaceRiskPremium(POLICYHOLDER_ADDRESS, 1)
            // positions_multichain = await risk_fetcher.getSolaceRiskPremium(POLICYHOLDER_ADDRESS, 1)
            // console.log(positions_multichain)
        })
    })

    describe("#getSolaceRiskSeries", () => {
        it("will return a valid response", async () => {
            await risk_fetcher.getSolaceRiskSeries()
            // const risk_series = await risk_fetcher.getSolaceRiskSeries()
            // console.log(risk_series)
        })
    })

    describe("#getSolaceRiskTracks", () => {
        it("will fail for an unsupported chain", async () => {
            expect(async () => {await risk_fetcher.getSolaceRiskTracks(POLICYHOLDER_ADDRESS, 150)}).toThrowError
        })
        it("will return a valid response", async () => {
            await risk_fetcher.getSolaceRiskTracks(POLICYHOLDER_ADDRESS, 1)
            // const risk_tracks = await risk_fetcher.getSolaceRiskTracks(POLICYHOLDER_ADDRESS, 1)
            // console.log(risk_tracks)
        })
    })

    describe("#getSolaceRiskBillings_All", () => {
        it("will fail for an unsupported chain", async () => {
            expect(async () => {await risk_fetcher.getSolaceRiskBillings_All(150)}).toThrowError
        })
        it("will return a valid response", async () => {
            await risk_fetcher.getSolaceRiskBillings_All(1)
            // const risk_billings = await risk_fetcher.getSolaceRiskBillings_All(1)
            // console.log(risk_billings)
        })
    })

    describe("#getSolaceRiskBillings", () => {
        it("will fail for an unsupported chain", async () => {
            expect(async () => {await risk_fetcher.getSolaceRiskBillings(POLICYHOLDER_ADDRESS, 150)}).toThrowError
        })
        it("will return a valid response", async () => {
            await risk_fetcher.getSolaceRiskBillings(POLICYHOLDER_ADDRESS, 1)
            // const risk_billings = await risk_fetcher.getSolaceRiskBillings(POLICYHOLDER_ADDRESS, 1)
            // console.log(risk_billings)
        })
    })

    describe("#getSolaceRiskBillingsPaid", () => {
        it("will fail for an unsupported chain", async () => {
            expect(async () => {await risk_fetcher.getSolaceRiskBillings(POLICYHOLDER_ADDRESS, 150, 'paid')}).toThrowError
        })
        it("will return a valid response", async () => {
            await risk_fetcher.getSolaceRiskBillings(POLICYHOLDER_ADDRESS, 1, 'paid')
            // const risk_billings = await risk_fetcher.getSolaceRiskBillings(POLICYHOLDER_ADDRESS, 1, 'paid')
            // console.log(risk_billings)
        })
    })

    describe("#getSolaceRiskBillingsUnpaid", () => {
        it("will fail for an unsupported chain", async () => {
            expect(async () => {await risk_fetcher.getSolaceRiskBillings(POLICYHOLDER_ADDRESS, 150, 'unpaid')}).toThrowError
        })
        it("will return a valid response", async () => {
            await risk_fetcher.getSolaceRiskBillings(POLICYHOLDER_ADDRESS, 1, 'unpaid')
            // const risk_billings = await risk_fetcher.getSolaceRiskBillings(POLICYHOLDER_ADDRESS, 1, 'unpaid')
            // console.log(risk_billings)
        })
    })
})