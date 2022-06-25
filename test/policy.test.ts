import { Policy } from "../src/apis/policy"

describe('Policy', () => {
    let p = new Policy();

    beforeEach(() => {
        // Avoid jest avoid timeout error
        jest.setTimeout(20000);
    })

    describe('#getTotalActivePolicies', () => {
        it('will return a valid response', async () => {
            const res = await p.getTotalActivePolicies(1)
            console.log("#getTotalActivePolicies - ", res)
        })
    })

    describe('#getTotalActivePolicies_All', () => {
        it('will return a valid response', async () => {
            const res = await p.getTotalActivePolicies_All()
            console.log("#getTotalActivePolicies_All - ", res)
        })
    })

    describe('#getExistingPolicy_V2', () => {
        it('will return a valid response', async () => {
            const res = await p.getExistingPolicy_V2('0xfb5cAAe76af8D3CE730f3D62c6442744853d43Ef')
            console.log("#getExistingPolicy_V2 - ", res)
        })
    })
})