import { BOND_TELLER_ADDRESSES, Price } from "../src";
import { Bond } from "../src/apis/bond"

describe('Bond', () => {
    let bond1 = new Bond(1);
    let bond137 = new Bond(137);

    let price = new Price();
    const bonder = "0xe7aba95073a85abd4ce82487c7fdfa860024b6cc"

    beforeEach(() => {
        // Avoid jest avoid timeout error
        jest.setTimeout(20000);
    })

    describe('#getBondTellerData', () => {
        it('will return a valid response - mainnet', async () => {
            const apiPriceMapping = await price.getCoinGeckoTokenPrices()
            const res = await bond1.getBondTellerData(apiPriceMapping)
            console.log(res)
        })

        it('will return a valid response - matic', async () => {
            const bond = new Bond(137);
            const apiPriceMapping = await price.getCoinGeckoTokenPrices()
            const res = await bond.getBondTellerData(apiPriceMapping)
            console.log(res)
        })

        it('will return a valid response - aurora', async () => {
            const bond = new Bond(1313161554);
            const apiPriceMapping = await price.getCoinGeckoTokenPrices()
            const res = await bond.getBondTellerData(apiPriceMapping)
            console.log(res)
        })
    })

    describe('#getUserBondData', () => {
        it('will return a valid response', async () => {
            const addr = BOND_TELLER_ADDRESSES['dai'][1].addr
            const res = await bond1.getUserBondData(addr, bonder)
            console.log(res)
        })

        it('will return a valid response', async () => {
            const addr = BOND_TELLER_ADDRESSES['eth'][1].addr
            const res = await bond1.getUserBondData(addr, bonder)
            console.log(res)
        })

        it('will return a valid response', async () => {
            const addr = BOND_TELLER_ADDRESSES['matic'][137].addr
            const res = await bond137.getUserBondData(addr, bonder)
            console.log(res)
        })

        it('will return a valid response', async () => {
            const addr = BOND_TELLER_ADDRESSES['usdc'][137].addr
            const res = await bond137.getUserBondData(addr, bonder)
            console.log(res)
        })
    })
})

