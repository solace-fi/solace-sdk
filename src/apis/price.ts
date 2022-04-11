import axios from "axios"

export class Price {
    public async getSolacePrice() {
        const price_set: { chainId: number, price: number }[] = []

        function reformatData(csv: any, key: string): any {
            var rows = csv.split('\n')
            var output = []
            for(var i = 1; i < rows.length-1; ++i) {
              var row = rows[i].split(',')
              output.push({
                timestamp: row[1],
                [key]: row[3]-0
              })
            }
            return output
        }

        await axios.get('https://stats.solace.fi/analytics/').then((data: any) => {
            const markets = data.data.markets

            const set1 = reformatData(markets['1'], "mainnet")
            price_set.push({ chainId: 1, price: set1[set1.length - 1].mainnet})
            const set137 = reformatData(markets['137'], "polygon")
            price_set.push({ chainId: 137, price: set137[set137.length - 1].mainnet})
            const set1313161554 = reformatData(markets['1313161554'], "aurora")
            price_set.push({ chainId: 1313161554, price: set1313161554[set1313161554.length - 1].mainnet})
        })

        return price_set
    }
}