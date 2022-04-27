import { SolaceBalance, xSolaceBalance } from "../src/apis/balance"

describe('SolaceBalance', () => {
    let solace_balance = new SolaceBalance('0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE');

    beforeEach(() => {
        // Avoid jest avoid timeout error
        jest.setTimeout(20000);
    })

    describe('#getSolaceBalanceOf', () => {
        it('will return a valid response for ethmain', async () => {
            const res = await solace_balance.getSolaceBalanceOf(1)
            console.log(res)
        })

        it('will return a valid response for aurora', async () => {
            const res = await solace_balance.getSolaceBalanceOf(1313161554)
            console.log(res)
        })

        it('will return a valid response for polygon', async () => {
            const res = await solace_balance.getSolaceBalanceOf(137)
            console.log(res)
        })
    })

    describe('#getSolaceBalanceSum', () => {
        it('will return a valid response', async () => {
            const res = await solace_balance.getSolaceBalanceSum()
            console.log(res)
        })
    })

    describe('#getAllSolaceBalances', () => {
        it('will return a valid response', async () => {
            const res = await solace_balance.getAllSolaceBalances()
            console.log(res)
        })
    })
})


describe('xSolaceBalance', () => {
    let x_solace_balance = new xSolaceBalance('0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE');

    beforeEach(() => {
        // Avoid jest avoid timeout error
        jest.setTimeout(20000);
    })

    describe('#getXSolaceBalanceOf', () => {
        it('will return a valid response for ethmain', async () => {
            const res = await x_solace_balance.getXSolaceBalanceOf(1)
            console.log(res)
        })

        it('will return a valid response for aurora', async () => {
            const res = await x_solace_balance.getXSolaceBalanceOf(1313161554)
            console.log(res)
        })

        it('will return a valid response for polygon', async () => {
            const res = await x_solace_balance.getXSolaceBalanceOf(137)
            console.log(res)
        })
    })

    describe('#getXSolaceBalanceSum', () => {
        it('will return a valid response', async () => {
            const res = await x_solace_balance.getXSolaceBalanceSum()
            console.log(res)
        })
    })

    describe('#getAllXSolaceBalances', () => {
        it('will return a valid response', async () => {
            const res = await x_solace_balance.getAllXSolaceBalances()
            console.log(res)
        })
    })
})