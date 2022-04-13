import { Lock } from "../src/apis/lock"

describe('Lock', () => {
    let xsl = new Lock();

    beforeEach(() => {
        // Avoid jest avoid timeout error
        jest.setTimeout(30000);
    })

    describe('#getXsLocker', () => {
        it('will return a valid response', async () => {
            const res = await xsl.getXsLocker()
            console.log(res)
        })
    })

    describe('#getVotePowerByAccount', () => {
        it('will return a valid response', async () => {
            const res = await xsl.getVotePowerByAccount()
            console.log(res)
        })
    })

    describe('#getGlobalLockStats', () => {
        it('will return a valid response', async () => {
            const res = await xsl.getGlobalLockStats(1)
            console.log(res)
        })
    })

    describe('#getUserLocks', () => {
        it('will return a valid response', async () => {
            const res = await xsl.getUserLocks(1, '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE')
            console.log(res)
        })
    })
})