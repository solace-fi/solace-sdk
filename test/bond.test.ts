import { Price } from "../src";
import { Bond } from "../src/apis/bond"

describe('Bond', () => {
    let bond = new Bond();
    let price = new Price()

    beforeEach(() => {
        // Avoid jest avoid timeout error
        jest.setTimeout(30000);
    })

    describe('#getBondTellerData', () => {
        it('will return a valid response', async () => {
            const apiPriceMapping = await price.getCoinGeckoTokenPrices()
            const res = await bond.getBondTellerData(1, apiPriceMapping)
            console.log(res)
        })
    })
})