import { Lock } from "../src/apis/lock"

describe('Lock', () => {
    let xsl = new Lock(4002);

    beforeEach(() => {
        // Avoid jest avoid timeout error
        jest.setTimeout(20000);
    })

    describe('#getXsLocker', () => {
        it('will return a valid response', async () => {
            await xsl.getXsLocker()
            // const res = await xsl.getXsLocker()
            // console.log(res)
        })
    })

    describe('#getVotePowerByAccount', () => {
        it('will return a valid response', async () => {
            await xsl.getVotePowerByAccount()
            // const res = await xsl.getVotePowerByAccount()
            // console.log(res)
        })
    })

    describe('#getGlobalLockStats', () => {
        it('will return a valid response', async () => {
            await xsl.getGlobalLockStats()
            // const res = await xsl.getGlobalLockStats()
            // console.log(res)
        })
    })

    describe('#getUserLocks', () => {
        it('will return a valid response', async () => {
            await xsl.getUserLocks('0x9a1768f92c57e7b0f609364185c92404049f4f3b')
            // const res = await xsl.getUserLocks('0x9a1768f92c57e7b0f609364185c92404049f4f3b')
            // console.log(res)
        })
    })

    describe('#getUserLockerBalances', () => {
        it('will return a valid response', async () => {
            await xsl.getUserLockerBalances('0x9a1768f92c57e7b0f609364185c92404049f4f3b')
            // const res = await xsl.getUserLockerBalances('0x9a1768f92c57e7b0f609364185c92404049f4f3b')
            // console.log(res)
        })
    })
})