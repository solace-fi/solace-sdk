import { Price } from "../src";
import { Bond } from "../src/apis/bond"
import { Contract } from "ethers";
import bondTellerErc20 from '../src/abis/BondTellerErc20.json'

describe('Bond', () => {
    let price = new Price()

    beforeEach(() => {
        // Avoid jest avoid timeout error
        jest.setTimeout(30000);
    })

    describe('#getBondTellerData', () => {
        it('will return a valid response - mainnet', async () => {
            const bond = new Bond(1);
            const apiPriceMapping = await price.getCoinGeckoTokenPrices()
            const res = await bond.getBondTellerData(apiPriceMapping)
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
        it('it will return a valid response - mainnet', async () => {
            const bond = new Bond(137);
            const bonder = "0xe7aba95073a85abd4ce82487c7fdfa860024b6cc"
            const usdc_bondteller_matic = new Contract("0x501ace7e977e06a3cb55f9c28d5654c9d74d5ca9", bondTellerErc20, bond.provider)
            const res = await bond.getUserBondData(usdc_bondteller_matic, bonder)
            console.log(res)
        })
    })

    // 0x56d4f890dc8ed926c44a95c02809823893d67ea8b6482ebaaec80d77c5f4b852
})

