import { Policy } from "../src/apis/policy"

describe('Policy', () => {
    let p = new Policy();

    beforeEach(() => {
        // Avoid jest avoid timeout error
        jest.setTimeout(30000);
    })

    describe('#getTotalActivePolicies', () => {
        it('will return a valid response', async () => {
            const res = await p.getTotalActivePolicies(1)
            console.log(res)
        })
    })

    describe('#getTotalActivePolicies_All', () => {
        it('will return a valid response', async () => {
            const res = await p.getTotalActivePolicies_All()
            console.log(res)
        })
    })

    describe('#getExistingPolicy', () => {
        it('will return a valid response', async () => {
            const res = await p.getExistingPolicy('0x8d12a197cb00d4747a1fe03395095ce2a5cc6819')
            console.log(res)
        })
    })
})