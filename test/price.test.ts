import { Price } from "../src/apis/price"

describe('Price', () => {
    let price = new Price();

    beforeEach(() => {
        // Avoid jest avoid timeout error
        jest.setTimeout(30000);
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

    describe('#getTokenPrices', () => {
        it('will return a valid response', async () => {
            const token_prices = await price.getTokenPrices()
            console.log(token_prices)
        })
    })
})