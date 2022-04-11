import axios from "axios"

export class UnderwritingPool {
    public async getUnderwritingPool_Mainnet() {

        let underwriting_pool_set: { token: string, amount: number }[] = []

        function reformatData(csv: any): any {
            var now = Date.now() / 1000
            var start = now - (60 * 60 * 24 * 90) // filter out data points > 3 months ago
            var rows = csv.split('\n')
            var output = []
            for(var i = 1; i < rows.length-1; ++i) {
              var row = rows[i].split(',')
              var timestamp = row[1] - 0
              if(timestamp < start) continue
              output.push({
                timestamp: row[1],
                dai: row[3]-0,
                usdc: row[4]-0,
                usdt: row[5]-0,
                frax: row[6]-0,
                eth: ((row[7]-0)+(row[8]-0))*(row[13]-0)+(row[10]-0)*(row[16]-0),
                wbtc: (row[9]-0)*(row[14]-0),
                slp: (row[11]-0)*(row[17]-0)
              })
            }
            return output
          }

        return await axios.get("https://stats.solace.fi/fs/?f=uwp/mainnet.csv").then((data: any) => {
            const set = reformatData(data.data)
            const latest = set[set.length - 1]
            underwriting_pool_set.push({ token: 'dai', amount: latest.dai })
            underwriting_pool_set.push({ token: 'usdc', amount: latest.usdc })
            underwriting_pool_set.push({ token: 'usdt', amount: latest.usdt })
            underwriting_pool_set.push({ token: 'frax', amount: latest.frax })
            underwriting_pool_set.push({ token: 'eth', amount: latest.eth })
            underwriting_pool_set.push({ token: 'wbtc', amount: latest.wbtc })
            underwriting_pool_set.push({ token: 'slp', amount: latest.slp })

            return underwriting_pool_set
        })
    }

    public async getUnderwritingPool_Polygon() {

        let underwriting_pool_set: { token: string, amount: number }[] = []

        function reformatData(csv: any): any {
            var now = Date.now() / 1000
            var start = now - (60 * 60 * 24 * 90) // filter out data points > 3 months ago
            var rows = csv.split('\n')
            var output = []
            for(var i = 1; i < rows.length-1; ++i) {
              var row = rows[i].split(',')
              var timestamp = row[1] - 0
              if(timestamp < start) continue
              output.push({
                timestamp: row[1],
                dai: row[3]-0,
                usdc: row[4]-0,
                usdt: row[5]-0,
                frax: row[6]-0,
                eth: (row[9]-0)*(row[13]-0),
                wbtc: (row[10]-0)*(row[14]-0),
                matic: ((row[7]-0)+(row[8]-0))*(row[15]-0),
                guni: (row[11]-0)*(row[17]-0)
              })
            }
            return output
          }

        return await axios.get("https://stats.solace.fi/fs/?f=uwp/polygon.csv").then((data: any) => {
            const set = reformatData(data.data)
            const latest = set[set.length - 1]
            underwriting_pool_set.push({ token: 'dai', amount: latest.dai })
            underwriting_pool_set.push({ token: 'usdc', amount: latest.usdc })
            underwriting_pool_set.push({ token: 'usdt', amount: latest.usdt })
            underwriting_pool_set.push({ token: 'frax', amount: latest.frax })
            underwriting_pool_set.push({ token: 'matic', amount: latest.matic })
            underwriting_pool_set.push({ token: 'guni', amount: latest.guni })
            underwriting_pool_set.push({ token: 'eth', amount: latest.eth })
            underwriting_pool_set.push({ token: 'wbtc', amount: latest.wbtc })

            return underwriting_pool_set
        })
    }

    public async getUnderwritingPool_Aurora() {

        let underwriting_pool_set: { token: string, amount: number }[] = []

        function reformatData(csv: any): any {
            var now = Date.now() / 1000
            var start = now - (60 * 60 * 24 * 90) // filter out data points > 3 months ago
            var rows = csv.split('\n')
            var output = []
            for(var i = 1; i < rows.length-1; ++i) {
              var row = rows[i].split(',')
              var timestamp = row[1] - 0
              if(timestamp < start) continue
              output.push({
                timestamp: row[1],
                dai: row[3]-0,
                usdc: row[4]-0,
                usdt: row[5]-0,
                frax: row[6]-0,
                eth: ((row[7]-0)+(row[8]-0))*(row[14]-0),
                wbtc: (row[9]-0)*(row[15]-0),
                wnear: (row[10]-0)*(row[16]-0),
                aurora: (row[11]-0)*(row[17]-0),
                tlp: (row[12]-0)*(row[19]-0)
              })
            }
            return output
          }

        return await axios.get("https://stats.solace.fi/fs/?f=uwp/polygon.csv").then((data: any) => {
            const set = reformatData(data.data)
            const latest = set[set.length - 1]
            underwriting_pool_set.push({ token: 'dai', amount: latest.dai })
            underwriting_pool_set.push({ token: 'usdc', amount: latest.usdc })
            underwriting_pool_set.push({ token: 'usdt', amount: latest.usdt })
            underwriting_pool_set.push({ token: 'frax', amount: latest.frax })
            underwriting_pool_set.push({ token: 'eth', amount: latest.eth })
            underwriting_pool_set.push({ token: 'wbtc', amount: latest.wbtc })
            underwriting_pool_set.push({ token: 'wnear', amount: latest.wnear })
            underwriting_pool_set.push({ token: 'aurora', amount: latest.aurora })
            underwriting_pool_set.push({ token: 'tlp', amount: latest.tlp })

            return underwriting_pool_set
        })
    }
}