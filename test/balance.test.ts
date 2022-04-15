import { SolaceBalance, xSolaceBalance } from "../src/apis/balance"

describe('SolaceBalance', () => {
    let solace_balance = new SolaceBalance();

    beforeEach(() => {
        // Avoid jest avoid timeout error
        jest.setTimeout(30000);
    })

    describe('#getSolaceBalanceOf', () => {
        it('will return a valid response for ethmain', async () => {
            const res = await solace_balance.getSolaceBalanceOf(1, '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' )
            console.log(res)
        })

        it('will return a valid response for aurora', async () => {
            const res = await solace_balance.getSolaceBalanceOf(1313161554, '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' )
            console.log(res)
        })

        it('will return a valid response for polygon', async () => {
            const res = await solace_balance.getSolaceBalanceOf(137, '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' )
            console.log(res)
        })
    })

    describe('#getSolaceBalanceSum', () => {
        it('will return a valid response', async () => {
            const res = await solace_balance.getSolaceBalanceSum('0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE')
            console.log(res)
        })
    })

    describe('#getAllSolaceBalances', () => {
        it('will return a valid response', async () => {
            const res = await solace_balance.getAllSolaceBalances('0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE')
            console.log(res)
        })
    })
})


describe('xSolaceBalance', () => {
    let x_solace_balance = new xSolaceBalance();

    beforeEach(() => {
        // Avoid jest avoid timeout error
        jest.setTimeout(30000);
    })

    describe('#getXSolaceBalanceOf', () => {
        it('will return a valid response for ethmain', async () => {
            const res = await x_solace_balance.getXSolaceBalanceOf(1, '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' )
            console.log(res)
        })

        it('will return a valid response for aurora', async () => {
            const res = await x_solace_balance.getXSolaceBalanceOf(1313161554, '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' )
            console.log(res)
        })

        it('will return a valid response for polygon', async () => {
            const res = await x_solace_balance.getXSolaceBalanceOf(137, '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' )
            console.log(res)
        })
    })

    describe('#getXSolaceBalanceSum', () => {
        it('will return a valid response', async () => {
            const res = await x_solace_balance.getXSolaceBalanceSum('0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE')
            console.log(res)
        })
    })

    describe('#getAllXSolaceBalances', () => {
        it('will return a valid response', async () => {
            const res = await x_solace_balance.getAllXSolaceBalances('0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE')
            console.log(res)
        })
    })
})