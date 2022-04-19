import { Contract, providers, getDefaultProvider } from 'ethers'
const { getNetwork } = providers
import axios from "axios"
import { fetchSupplyOrZero, fetchReservesOrZero, fetchUniswapV2PriceOrZero, fetchScpPpsOrZero, fetchUniswapV3PriceOrZero, fetchBalanceOrZero, withBackoffRetries } from '../utils'
const ethers = require('ethers')
const formatUnits = ethers.utils.formatUnits
import vaultAbi from '../abis/vault.json'
import uniV2PairAbi from '../abis/uniswapV2Pair.json'
import uniV3PoolAbi from '../abis/uniswapV3Pool.json'
import ERC20 from '../abis/ERC20.json'
import { TokenToPriceMapping } from '../types'
import { fetchCoingeckoTokenPriceById, fetchCoingeckoTokenPricesByAddr } from '../utils/api'
import { TOKEN_ADDRESSES, UWP_ADDRESS } from '../constants'
import { getProvider } from '../utils/ethers'

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
            price_set.push({ chainId: 137, price: set137[set137.length - 1].polygon})
            const set1313161554 = reformatData(markets['1313161554'], "aurora")
            price_set.push({ chainId: 1313161554, price: set1313161554[set1313161554.length - 1].aurora})
        })

        return price_set
  }

  public async getMainnetPrices(): Promise<{ [key: string]: number }> {
      const provider = getDefaultProvider(getNetwork(1))
      const blockTag = await provider.getBlockNumber()

      const scp = new Contract("0x501AcEe83a6f269B77c167c6701843D454E2EFA0", vaultAbi, provider)
      const pools = {
        "USDC-WETH": new Contract("0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc", uniV2PairAbi, provider), // uni v2 usdc-eth
        "WBTC-DAI": new Contract("0x231B7589426Ffe1b75405526fC32aC09D44364c4", uniV2PairAbi, provider), // uni v2 wbtc-dai
        "SOLACE-USDC": new Contract("0x9C051F8A6648a51eF324D30C235da74D060153aC", uniV2PairAbi, provider), // sushi solace-usdc
      }

      return new Promise(async (resolve, reject) => {
        var [wethPrice, wbtcPrice, solacePrice, solaceRes, slpSupply, scpPPS] = await Promise.all([
          fetchUniswapV2PriceOrZero(pools["USDC-WETH"], true, 6, 18, blockTag),
          fetchUniswapV2PriceOrZero(pools["WBTC-DAI"], false, 8, 18, blockTag),
          fetchUniswapV2PriceOrZero(pools["SOLACE-USDC"], false, 18, 6, blockTag),
          fetchReservesOrZero(pools["SOLACE-USDC"], blockTag),
          fetchSupplyOrZero(pools["SOLACE-USDC"], blockTag),
          fetchScpPpsOrZero(scp, blockTag)
        ])
        var slpPriceWoSolace = (slpSupply.eq(0) || solaceRes._reserve0.eq(0) || solaceRes._reserve1.eq(0)) ? 0.0 : ((formatUnits(solaceRes._reserve1, 6) - 0) / (formatUnits(slpSupply, 18) - 0))
        var scpPrice = scpPPS.eq(0) ? 0.0 : ((formatUnits(scpPPS, 18) - 0) * wethPrice)
        resolve({'eth': wethPrice, 'wbtc': wbtcPrice, 'solace': solacePrice, 'scp': scpPrice, 'slp': slpPriceWoSolace})
      })
  }

  public async getPolygonPrices(): Promise<{ [key: string]: number }> {

      async function fetchGuniPrice(provider: providers.JsonRpcProvider, blockTag: number): Promise<number> {
        const fraxSolacePool = "0x85Efec4ee18a06CE1685abF93e434751C3cb9bA9"

        const guniContract = new Contract('0x38e7e05Dfd9fa3dE80dB0e7AC03AC57Fa832C78A', ERC20, provider)
        const fraxContract = new Contract('0x45c32fA6DF82ead1e2EF74d17b76547EDdFaFF89', ERC20, provider)

        return new Promise(async (resolve, reject) => {
          var [guniSupply, guniFraxBalance] = await Promise.all([
            fetchSupplyOrZero(guniContract, blockTag),
            fetchBalanceOrZero(fraxContract, fraxSolacePool, blockTag)
          ])
          var guniPriceWoSolace = (guniSupply.eq(0) || guniFraxBalance.eq(0)) ? 0.0 : ((formatUnits(guniFraxBalance, 18) - 0) / (formatUnits(guniSupply, 18) - 0))
          resolve(guniPriceWoSolace)
        })
      }

      const provider = getProvider("https://polygon-rpc.com")
      const blockTag = await provider.getBlockNumber()

      const pools = {
        "USDC-WETH": new Contract("0x853Ee4b2A13f8a742d64C8F088bE7bA2131f670d", uniV2PairAbi, provider), // quickswap usdc-eth
        "WBTC-USDC": new Contract("0xF6a637525402643B0654a54bEAd2Cb9A83C8B498", uniV2PairAbi, provider), // quickswap wbtc-usdc
        "WMATIC-USDC": new Contract("0xcd353F79d9FADe311fC3119B841e1f456b54e858", uniV2PairAbi, provider), // sushiswap wmatic-usdc
        "FRAX-SOLACE": new Contract("0x85Efec4ee18a06CE1685abF93e434751C3cb9bA9", uniV3PoolAbi, provider), // uniswap v3 frax-solace
      }

      return new Promise(async (resolve, reject) => {
        var [wethPrice, wbtcPrice, wmaticPrice, solacePrice, guniPriceWoSolace] = await Promise.all([
          fetchUniswapV2PriceOrZero(pools["USDC-WETH"], true, 6, 18, blockTag),
          fetchUniswapV2PriceOrZero(pools["WBTC-USDC"], false, 8, 6, blockTag),
          fetchUniswapV2PriceOrZero(pools["WMATIC-USDC"], false, 18, 6, blockTag),
          fetchUniswapV3PriceOrZero(pools["FRAX-SOLACE"], false, 18, 18, blockTag),
          fetchGuniPrice(provider, blockTag)
        ])
        resolve({'eth': wethPrice, 'wbtc': wbtcPrice, 'matic': wmaticPrice, 'solace': solacePrice, 'guni': guniPriceWoSolace})
      })
  }

  public async getAuroraPrices(): Promise<{ [key: string]: number }> {
      const provider = getProvider("https://mainnet.aurora.dev")
      const blockTag = await provider.getBlockNumber()

      const pools = {
        "USDC-WNEAR": new ethers.Contract("0x20F8AeFB5697B77E0BB835A8518BE70775cdA1b0", uniV2PairAbi, provider), // trisolaris usdc-wnear
        "WNEAR-WETH": new ethers.Contract("0x63da4DB6Ef4e7C62168aB03982399F9588fCd198", uniV2PairAbi, provider), // trisolaris wnear-weth
        "WNEAR-WBTC": new ethers.Contract("0xbc8A244e8fb683ec1Fd6f88F3cc6E565082174Eb", uniV2PairAbi, provider), // trisolaris  wnear-wbtc
        "AURORA-WETH": new ethers.Contract("0x5eeC60F348cB1D661E4A5122CF4638c7DB7A886e", uniV2PairAbi, provider), // trisolaris aurora-weth
        "SOLACE-WNEAR": new ethers.Contract("0xdDAdf88b007B95fEb42DDbd110034C9a8e9746F2", uniV2PairAbi, provider), // trisolaris solace-wnear
      }

      const wnearContract = new Contract('0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d', ERC20, provider)
      const tlpContract = new Contract('0xdDAdf88b007B95fEb42DDbd110034C9a8e9746F2', ERC20, provider)

      return new Promise(async (resolve, reject) => {
        var [wnearPrice, wethWnearPrice, wbtcWnearPrice, auroraWethPrice, solaceWnearPrice, tlpRes, tlpWnearBal, tlpSupply] = await Promise.all([
          fetchUniswapV2PriceOrZero(pools["USDC-WNEAR"], true, 6, 24, blockTag),
          fetchUniswapV2PriceOrZero(pools["WNEAR-WETH"], true, 24, 18, blockTag),
          fetchUniswapV2PriceOrZero(pools["WNEAR-WBTC"], true, 24, 8, blockTag),
          fetchUniswapV2PriceOrZero(pools["AURORA-WETH"], false, 18, 18, blockTag),
          fetchUniswapV2PriceOrZero(pools["SOLACE-WNEAR"], false, 18, 24, blockTag),
          fetchReservesOrZero(pools["SOLACE-WNEAR"], blockTag),
          fetchBalanceOrZero(wnearContract, pools["SOLACE-WNEAR"].address, blockTag),
          fetchSupplyOrZero(tlpContract, blockTag)
        ])
        var wethPrice = wethWnearPrice * wnearPrice
        var wbtcPrice = wbtcWnearPrice * wnearPrice
        var auroraPrice = auroraWethPrice * wethPrice
        var solacePrice = solaceWnearPrice * wnearPrice
        var tlpWnearPrice = (tlpRes._reserve0.eq(0) || tlpRes._reserve1.eq(0) || tlpSupply.eq(0)) ? 0.0 : ((formatUnits(tlpWnearBal, 24) - 0) / (formatUnits(tlpSupply, 18) - 0))
        var tlpPrice = tlpWnearPrice * wnearPrice
        resolve({'eth': wethPrice, 'wbtc': wbtcPrice, 'wnear': wnearPrice, 'aurora': auroraPrice ,'solace': solacePrice, 'tlp': tlpPrice})
      })
  }

  public async getCoinGeckoTokenPrices () {
      const getPricesByAddress = async (tokenObjs: { symbol: string, addr: string}[]): Promise<TokenToPriceMapping> => {
        const uniqueAddrs = tokenObjs.filter((v, i, a) => a.indexOf(v) === i)
        const prices = await withBackoffRetries(async () => fetchCoingeckoTokenPricesByAddr(uniqueAddrs.map((a) => a.addr), 'usd', 'ethereum'))
        const array: { symbol: string; price: number }[] = []
        uniqueAddrs.forEach((uniqueAddr) => {
          if (!prices[uniqueAddr.addr.toLowerCase()]) {
            array.push({ symbol: uniqueAddr.symbol, price: -1 })
          } else {
            array.push({ symbol: uniqueAddr.symbol, price: prices[uniqueAddr.addr.toLowerCase()].usd })
          }
        })
        const hashmap: TokenToPriceMapping = array.reduce(
          (prices: any, data: { symbol: string; price: number }) => ({
            ...prices,
            [data.symbol.toLowerCase()]: data.price,
          }),
          {}
        )
        return hashmap
      }
    
      const getPricesById = async (ids: string[]) => {
        const uniqueIds = ids.filter((v, i, a) => a.indexOf(v) === i)
        const prices = await withBackoffRetries(async () => fetchCoingeckoTokenPriceById(uniqueIds, 'usd'))
        const array: { id: string; price: number }[] = []
        uniqueIds.forEach((uniqueId) => {
          if (!prices.find((p: any) => (p.id = uniqueId.toLowerCase()))) {
            array.push({ id: uniqueId.toLowerCase(), price: -1 })
          } else {
            array.push({
              id: uniqueId.toLowerCase(),
              price: prices.find((p: any) => (p.id = uniqueId.toLowerCase())).current_price,
            })
          }
        })
        const hashmap: TokenToPriceMapping = array.reduce(
          (prices: any, data: { id: string; price: number }) => ({
            ...prices,
            [data.id.toLowerCase()]: data.price,
          }),
          {}
        )
        return hashmap
      }
      const tokenAddrs: { symbol: string; addr: string; }[] = []
      const tokenids: string[] = []

      for(const chainID in UWP_ADDRESS) {
        for (const token in TOKEN_ADDRESSES) {   
        if (TOKEN_ADDRESSES[token][chainID]) {
          if(TOKEN_ADDRESSES[token][1]) {
            tokenAddrs.push({ symbol: token, addr: TOKEN_ADDRESSES[token][1]})
          } else {
            let tokenId = null
            switch(token) {
              case 'dai':
                tokenId = 'dai'
                break
              case 'usdt':
                tokenId = 'tether'
                break
              case 'frax':
                tokenId = 'frax'
                break
              case 'wnear':
                tokenId = 'near'
                break
              case 'aurora':
                tokenId = 'aurora'
                break
              case 'wmatic':
                tokenId = 'matic-network'
                break
              case 'eth':
              default:
                  tokenId = 'ethereum'
            }
            tokenids.push(tokenId)
          }
        }
      }      
    }
    const priceMapByAddress = tokenAddrs.length > 0 ? await getPricesByAddress(tokenAddrs) : {}
    const priceMapById = tokenids.length > 0 ? await getPricesById(tokenids) : {}
    const consolidatedPriceMapping = { ...priceMapByAddress, ...priceMapById }
    return consolidatedPriceMapping
  }
}