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

    describe('#getGlobalStats', () => {
        it('will return a valid response', async () => {
            const res = await xsl.getGlobalStats(1)
            console.log(res)
        })
    })
})