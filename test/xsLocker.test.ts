import { xsLockerApi } from "../src/apis/xsLocker"

describe('xsLockerApi', () => {
    let xsl = new xsLockerApi();

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
})