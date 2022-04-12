import { UnderwritingPoolBalances, UnderwritingPoolUSDBalances } from "../src/apis/uwp"

describe('UndewritingPool', () => {
    let uwp = new UnderwritingPoolBalances();

    beforeEach(() => {
        // Avoid jest avoid timeout error
        jest.setTimeout(30000);
    })

    describe('#getUnderwritingPool_Mainnet - Mainnet', () => {
        it('will return a valid response', async () => {
            const uwp_set = await uwp.getBalances_Mainnet()
            console.log(uwp_set)
        })
    })

    describe('#getUnderwritingPool_Polygon - Polygon', () => {
        it('will return a valid response', async () => {
            const uwp_set = await uwp.getBalances_Polygon()
            console.log(uwp_set)
        })
    })

    describe('#getUnderwritingPool_Aurora - Aurora', () => {
        it('will return a valid response', async () => {
            const uwp_set = await uwp.getBalances_Aurora()
            console.log(uwp_set)
        })
    })
})

describe('UnderwritingPoolUSDBalances', () => {
    let uwp = new UnderwritingPoolUSDBalances();

    beforeEach(() => {
        // Avoid jest avoid timeout error
        jest.setTimeout(30000);
    })

    describe('#getUSDBalances_Mainnet - Mainnet', () => {
        it('will return a valid response', async () => {
            const uwp_set = await uwp.getUSDBalances_Mainnet()
            console.log(uwp_set)
        })
    })

    describe('#getUSDBalances_Polygon - Polygon', () => {
        it('will return a valid response', async () => {
            const uwp_set = await uwp.getUSDBalances_Polygon()
            console.log(uwp_set)
        })
    })

    describe('#getUSDBalances_Aurora - Aurora', () => {
        it('will return a valid response', async () => {
            const uwp_set = await uwp.getUSDBalances_Aurora()
            console.log(uwp_set)
        })
    })

    describe('#getUSDBalances_All - All', () => {
        it('will return a valid response', async () => {
            const uwp_set = await uwp.getUSDBalances_All()
            console.log(uwp_set)
        })
    })
})