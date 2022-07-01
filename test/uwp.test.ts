import { UnderwritingPoolBalances, UnderwritingPoolUSDBalances } from "../src/apis/uwp"

describe('UndewritingPool', () => {
    let uwp = new UnderwritingPoolBalances();

    beforeEach(() => {
        // Avoid jest avoid timeout error
        jest.setTimeout(20000);
    })

    describe('#getBalances_Mainnet', () => {
        it('will return a valid response', async () => {
            // await uwp.getBalances_Mainnet()
            const uwp_set = await uwp.getBalances_Mainnet()
            console.log('mainnet', uwp_set)
        })
    })

    describe('#getBalances_Polygon', () => {
        it('will return a valid response', async () => {
            // await uwp.getBalances_Polygon()
            const uwp_set = await uwp.getBalances_Polygon()
            console.log('polygon', uwp_set)
        })
    })

    describe('#getBalances_Aurora', () => {
        it('will return a valid response', async () => {
            // await uwp.getBalances_Aurora()
            const uwp_set = await uwp.getBalances_Aurora()
            console.log('aurora', uwp_set)
        })
    })

    describe('#getBalances_Fantom', () => {
        it('will return a valid response', async () => {
            // await uwp.getBalances_Fantom()
            const uwp_set = await uwp.getBalances_Fantom()
            console.log('fantom', uwp_set)
        })
    })
})

describe('UnderwritingPoolUSDBalances', () => {
    let uwp = new UnderwritingPoolUSDBalances();

    beforeEach(() => {
        // Avoid jest avoid timeout error
        jest.setTimeout(20000);
    })

    describe('#getUSDBalances_Mainnet', () => {
        it('will return a valid response', async () => {
            await uwp.getUSDBalances_Mainnet()
            // const uwp_set = await uwp.getUSDBalances_Mainnet()
            // console.log(uwp_set)
        })
    })

    describe('#getUSDBalances_Polygon', () => {
        it('will return a valid response', async () => {
            await uwp.getUSDBalances_Polygon()
            // const uwp_set = await uwp.getUSDBalances_Polygon()
            // console.log(uwp_set)
        })
    })

    describe('#getUSDBalances_Aurora', () => {
        it('will return a valid response', async () => {
            await uwp.getUSDBalances_Aurora()
            // const uwp_set = await uwp.getUSDBalances_Aurora()
            // console.log(uwp_set)
        })
    })

    describe('#getUSDBalances_Fantom', () => {
        it('will return a valid response', async () => {
            await uwp.getUSDBalances_Fantom()
            // const uwp_set = await uwp.getUSDBalances_Fantom()
            // console.log(uwp_set)
        })
    })

    describe('#getUSDBalances_All', () => {
        it('will return a valid response', async () => {
            // await uwp.getUSDBalances_All()
            const uwp_set = await uwp.getUSDBalances_All()
            console.log(uwp_set)
        })
    })
})