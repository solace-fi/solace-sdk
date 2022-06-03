import { 
    BOND_TELLER_ADDRESSES, 
    Price } from "../src";
import { Bond } from "../src/apis/bond"

import { BigNumber } from "ethers";

describe('Bond', () => {
    let bond1 = new Bond(1);
    let bond137 = new Bond(137);
    let bond4002 = new Bond(4002);
    let bond1313161554 = new Bond(1313161554);

    let price = new Price();
    const bonder = "0xe7aba95073a85abd4ce82487c7fdfa860024b6cc"

    beforeEach(() => {
        // Avoid jest avoid timeout error
        jest.setTimeout(20000);
    })

    describe('#getBondTellerData', () => {
        it('will return a valid response - mainnet', async () => {
            const apiPriceMapping = await price.getMirrorCoingeckoPrices()
            const res = await bond1.getBondTellerData(apiPriceMapping)
            const detail = res.find((r) => r.tellerData.teller.type == 'eth')
            if(!detail) return
            await detail.tellerData.teller.contract.estimateGas.depositEth(BigNumber.from(0), bonder, true)
            await detail.tellerData.teller.contract.estimateGas.depositWeth(BigNumber.from(0), BigNumber.from(0), bonder, true)
            console.log(res)
        })

        it('will return a valid response - matic', async () => {
            const apiPriceMapping = await price.getMirrorCoingeckoPrices()
            const res = await bond137.getBondTellerData(apiPriceMapping)
            const detail = res.find((r) => r.tellerData.teller.type == 'matic')
            if(!detail) return
            await detail.tellerData.teller.contract.estimateGas.depositMatic(BigNumber.from(0), bonder, true)
            await detail.tellerData.teller.contract.estimateGas.depositWmatic(BigNumber.from(0), BigNumber.from(0), bonder, true)
            console.log(res)
        })

        it('will return a valid response - aurora', async () => {
            const apiPriceMapping = await price.getMirrorCoingeckoPrices()
            const res = await bond1313161554.getBondTellerData(apiPriceMapping)
            const detail = res.find((r) => r.tellerData.teller.type == 'erc20')
            if(!detail) return
            await detail.tellerData.teller.contract.estimateGas.deposit(BigNumber.from(0), BigNumber.from(0), bonder, true)
            console.log(res)
        })

        // it('will return a valid response - fantom testnet', async () => {
        //     const apiPriceMapping = await price.getMirrorCoingeckoPrices()
        //     const res = await bond4002.getBondTellerData(apiPriceMapping)
        //     const detail = res.find((r) => r.tellerData.teller.type == 'ftm')
        //     if(!detail) return
        //     await detail.tellerData.teller.contract.estimateGas.depositFtm(BigNumber.from(0), bonder, true)
        //     await detail.tellerData.teller.contract.estimateGas.depositWftm(BigNumber.from(0), BigNumber.from(0), bonder, true)
        //     console.log(res)
        // })
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

        it('will return a valid response', async () => {
            const addr = BOND_TELLER_ADDRESSES['usdc'][4002].addr
            const res = await bond4002.getUserBondData(addr, bonder)
            console.log(res)
        })
    })
})

