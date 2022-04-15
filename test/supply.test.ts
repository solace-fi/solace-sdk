import { CirculatingSupply, TotalSupply } from "../src/apis/supply"

describe('TotalSupply', () => {
    let totalSupply = new TotalSupply();

    beforeEach(() => {
        // Avoid jest avoid timeout error
        jest.setTimeout(30000);
    })

    describe('#getTotalSupply', () => {
        it('will return a valid response for solace', async () => {
            const res = await totalSupply.getTotalSupply(1, 'SOLACE')
            console.log('getTotalSupply(1, SOLACE)', res)
        })

        it('will return a valid response for xsolace', async () => {
            const res = await totalSupply.getTotalSupply(1, 'XSOLACE')
            console.log('getTotalSupply(1, XSOLACE)', res)
        })
    })

    describe('#getTotalSupplySum', () => {
        it('will return a valid response for solace', async () => {
            const res = await totalSupply.getTotalSupplySum('SOLACE')
            console.log('getTotalSupplySum(SOLACE)', res)
        })

        it('will return a valid response for xsolace', async () => {
            const res = await totalSupply.getTotalSupplySum('XSOLACE')
            console.log('getTotalSupplySum(XSOLACE)', res)
        })
    })

    describe('#getTotalSupplyAll', () => {
        it('will return a valid response for solace', async () => {
            const res = await totalSupply.getTotalSupplyAll('SOLACE')
            console.log('getTotalSupplyAll(SOLACE)', res)
        })

        it('will return a valid response for xsolace', async () => {
            const res = await totalSupply.getTotalSupplyAll('XSOLACE')
            console.log('getTotalSupplyAll(XSOLACE)', res)
        })
    })
})

describe('CirculatingSupply', () => {
    let circulatingSupply = new CirculatingSupply();

    beforeEach(() => {
        // Avoid jest avoid timeout error
        jest.setTimeout(30000);
    })

    describe('#getCirculatingSupply - Mainnet', () => {
        it('will return a valid response for solace', async () => {
            const res = await circulatingSupply.getCirculatingSupply(1, 'SOLACE')
            console.log('getCirculatingSupply(1, SOLACE)', res)
        })

        it('will return a valid response for xsolace', async () => {
            const res = await circulatingSupply.getCirculatingSupply(1, 'XSOLACE')
            console.log('getCirculatingSupply(1, XSOLACE)', res)
        })
    })

    describe('#getCirculatingSupply - Polygon', () => {
        it('will return a valid response for solace', async () => {
            const res = await circulatingSupply.getCirculatingSupply(137, 'SOLACE')
            console.log('getCirculatingSupply(137, SOLACE)', res)
        })

        it('will return a valid response for xsolace', async () => {
            const res = await circulatingSupply.getCirculatingSupply(137, 'XSOLACE')
            console.log('getCirculatingSupply(137, XSOLACE)', res)
        })
    })

    describe('#getCirculatingSupply - Aurora', () => {
        it('will return a valid response for solace', async () => {
            const res = await circulatingSupply.getCirculatingSupply(1313161554, 'SOLACE')
            console.log('getCirculatingSupply(1313161554, SOLACE)', res)
        })

        it('will return a valid response for xsolace', async () => {
            const res = await circulatingSupply.getCirculatingSupply(1313161554, 'XSOLACE')
            console.log('getCirculatingSupply(1313161554, XSOLACE)', res)
        })
    })

    describe('#getCirculatingSupplySum', () => {
        it('will return a valid response for solace', async () => {
            const res = await circulatingSupply.getCirculatingSupplySum('SOLACE')
            console.log('getCirculatingSupplySum(SOLACE)', res)
        })

        it('will return a valid response for xsolace', async () => {
            const res = await circulatingSupply.getCirculatingSupplySum('XSOLACE')
            console.log('getCirculatingSupplySum(XSOLACE)', res)
        })
    })

    describe('#getCirculatingSupplyAll', () => {
        it('will return a valid response for solace', async () => {
            const res = await circulatingSupply.getCirculatingSupplyAll('SOLACE')
            console.log('getCirculatingSupplyAll(SOLACE)', res)
        })

        it('will return a valid response for xsolace', async () => {
            const res = await circulatingSupply.getCirculatingSupplyAll('XSOLACE')
            console.log('getCirculatingSupplyAll(XSOLACE)', res)
        })
    })
})