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
})