import { Price } from "../src/apis/price"

describe('Price', () => {
    let price = new Price();

    beforeEach(() => {
        // Avoid jest avoid timeout error
        jest.setTimeout(20000);
    })

    describe('#getSolacePrice', () => {
        it('will return a valid response', async () => {
            const price_set = await price.getSolacePrice()
            console.log(price_set)
        })
    })

    describe('#getMainnetPrices', () => {
        it('will return a valid response', async () => {
            const token_prices = await price.getMainnetPrices()
            console.log(token_prices)
        })
    })

    describe('#getPolygonPrices', () => {
        it('will return a valid response', async () => {
            const token_prices = await price.getPolygonPrices()
            console.log(token_prices)
        })
    })

    describe('#getAuroraPrices', () => {
        it('will return a valid response', async () => {
            const token_prices = await price.getAuroraPrices()
            console.log(token_prices)
        })
    })

    describe('#getFantomPrices', () => {
        it('will return a valid response', async () => {
            const token_prices = await price.getFantomPrices()
            console.log(token_prices)
        })
    })

    describe('#getCoinGeckoTokenPrices', () => {
        it('will return a valid response', async () => {
            const token_prices = await price.getCoinGeckoTokenPrices()
            console.log(token_prices)
        })
    })

    describe('#getPriceInfo', () => {
        it('will return a valid response', async () => {
            const res = await price.getPriceInfo()
            console.log(res)
        })
    })
})