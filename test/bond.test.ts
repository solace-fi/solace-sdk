import { BOND_TELLER_ADDRESSES, Price } from "../src";
import { Bond } from "../src/apis/bond"

describe('Bond', () => {
    let bond1 = new Bond(1);
    let bond137 = new Bond(137);

    let price = new Price();

    beforeEach(() => {
        // Avoid jest avoid timeout error
        jest.setTimeout(30000);
    })

    describe('#getBondTellerData', () => {
        it('will return a valid response', async () => {
            const apiPriceMapping = await price.getCoinGeckoTokenPrices()
            const res = await bond1.getBondTellerData(apiPriceMapping)
            console.log(res)
        })
    })

    describe('#getUserBondData', () => {
        it('will return a valid response', async () => {
            const addr = BOND_TELLER_ADDRESSES['dai'][1].addr
            const res = await bond1.getUserBondData(addr, '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE')
            console.log(res)
        })

        it('will return a valid response', async () => {
            const addr = BOND_TELLER_ADDRESSES['eth'][1].addr
            const res = await bond1.getUserBondData(addr, '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE')
            console.log(res)
        })

        it('will return a valid response', async () => {
            const addr = BOND_TELLER_ADDRESSES['matic'][137].addr
            const res = await bond137.getUserBondData(addr, '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE')
            console.log(res)
        })

        it('will return a valid response', async () => {
            const addr = BOND_TELLER_ADDRESSES['weth'][137].addr
            const res = await bond137.getUserBondData(addr, '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE')
            console.log(res)
        })
    })
})