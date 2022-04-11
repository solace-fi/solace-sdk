import { UnderwritingPool } from "../src/apis/uwp"

describe('UndewritingPool', () => {
    let uwp = new UnderwritingPool();

    beforeEach(() => {
        // Avoid jest avoid timeout error
        jest.setTimeout(30000);
    })

    describe('#getSolacePrice - Mainnet', () => {
        it('will return a valid response', async () => {
            const uwp_set = await uwp.getUnderwritingPool_Mainnet()
            console.log(uwp_set)
        })
    })

    describe('#getSolacePrice - Polygon', () => {
        it('will return a valid response', async () => {
            const uwp_set = await uwp.getUnderwritingPool_Polygon()
            console.log(uwp_set)
        })
    })

    describe('#getSolacePrice - Aurora', () => {
        it('will return a valid response', async () => {
            const uwp_set = await uwp.getUnderwritingPool_Aurora()
            console.log(uwp_set)
        })
    })
})