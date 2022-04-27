import { Contract, providers, getDefaultProvider } from 'ethers'
const { getNetwork } = providers
import ERC20 from '../abis/ERC20.json'
import { DEFAULT_ENDPOINT, UWP_ADDRESS } from "../constants"
import { fetchBalances, withBackoffRetries } from "../utils"
import { getProvider } from '../utils/ethers'
import { Price } from './price'
export class UnderwritingPoolBalances {

  public async getBalances_Mainnet(rpcUrl?: string) {

    const provider = getDefaultProvider(rpcUrl ?? getNetwork(1))
    const blockTag = await provider.getBlockNumber()

    let res = []

    const tokenList = [
      {address: "0x6B175474E89094C44Da98b954EedeAC495271d0F", symbol: "dai", decimals: 18},
      {address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", symbol: "usdc", decimals: 6},
      {address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", symbol: "usdt", decimals: 6},
      {address: "0x853d955aCEf822Db058eb8505911ED77F175b99e", symbol: "frax", decimals: 18},
      {address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", symbol: "eth", decimals: 18},
      {address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", symbol: "weth", decimals: 18},
      {address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", symbol: "wbtc", decimals: 8},
      {address: "0x501AcEe83a6f269B77c167c6701843D454E2EFA0", symbol: "scp", decimals: 18},
      {address: "0x9C051F8A6648a51eF324D30C235da74D060153aC", symbol: "slp", decimals: 18},
      {address: "0x501acE9c35E60f03A2af4d484f49F9B1EFde9f40", symbol: "solace", decimals: 18}
    ]

    const activatedTokenList = tokenList.map((t) => {
      const contract = new Contract(t.address, ERC20, provider)
      return {
        ...t,
        contract
      }
    })

    const balances = await fetchBalances(provider, activatedTokenList, UWP_ADDRESS[1], blockTag)
    
    for(let i = 0; i < balances.length; i++) {
      res.push({ token: tokenList[i].symbol, amount: balances[i] })
    }

    return res
  }

  public async getBalances_Polygon(rpcUrl?: string) {
    const provider = getProvider(rpcUrl ?? DEFAULT_ENDPOINT[137])
    const blockTag = await provider.getBlockNumber()
    let res = []

    const tokenList = [
      {address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063", symbol: "dai", decimals: 18},
      {address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", symbol: "usdc", decimals: 6},
      {address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", symbol: "usdt", decimals: 6},
      {address: "0x45c32fA6DF82ead1e2EF74d17b76547EDdFaFF89", symbol: "frax", decimals: 18},
      {address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", symbol: "matic", decimals: 18},
      {address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270", symbol: "wmatic", decimals: 18},
      {address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619", symbol: "weth", decimals: 18},
      {address: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6", symbol: "wbtc", decimals: 8},
      {address: "0x38e7e05Dfd9fa3dE80dB0e7AC03AC57Fa832C78A", symbol: "guni", decimals: 18},
      {address: "0x501acE9c35E60f03A2af4d484f49F9B1EFde9f40", symbol: "solace", decimals: 18}
    ]

    const activatedTokenList = tokenList.map((t) => {
      const contract = new Contract(t.address, ERC20, provider)
      return {
        ...t,
        contract
      }
    })

    const balances = await fetchBalances(provider, activatedTokenList, UWP_ADDRESS[137], blockTag)
    
    for(let i = 0; i < balances.length; i++) {
      res.push({ token: tokenList[i].symbol, amount: balances[i] })
    }

    return res
  }

  public async getBalances_Aurora(rpcUrl?: string) {
    const provider = getProvider(rpcUrl ?? DEFAULT_ENDPOINT[1313161554])
    const blockTag = await provider.getBlockNumber()
    let res = []

    const tokenList = [
      {address: "0xe3520349F477A5F6EB06107066048508498A291b", symbol: "dai", decimals: 18},
      {address: "0xB12BFcA5A55806AaF64E99521918A4bf0fC40802", symbol: "usdc", decimals: 6},
      {address: "0x4988a896b1227218e4A686fdE5EabdcAbd91571f", symbol: "usdt", decimals: 6},
      {address: "0xDA2585430fEf327aD8ee44Af8F1f989a2A91A3d2", symbol: "frax", decimals: 18},
      {address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", symbol: "eth", decimals: 18},
      {address: "0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB", symbol: "weth", decimals: 18},
      {address: "0xf4eb217ba2454613b15dbdea6e5f22276410e89e", symbol: "wbtc", decimals: 8},
      {address: "0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d", symbol: "wnear", decimals: 24},
      {address: "0x8BEc47865aDe3B172A928df8f990Bc7f2A3b9f79", symbol: "aurora", decimals: 18},
      {address: "0xdDAdf88b007B95fEb42DDbd110034C9a8e9746F2", symbol: "tlp", decimals: 18},
      {address: "0x501acE9c35E60f03A2af4d484f49F9B1EFde9f40", symbol: "solace", decimals: 18}
    ]

    const activatedTokenList = tokenList.map((t) => {
      const contract = new Contract(t.address, ERC20, provider)
      return {
        ...t,
        contract
      }
    })

    const balances = await fetchBalances(provider, activatedTokenList, UWP_ADDRESS[1313161554], blockTag)
    
    for(let i = 0; i < balances.length; i++) {
      res.push({ token: tokenList[i].symbol, amount: balances[i] })
    }

    return res
  }
}

export class UnderwritingPoolUSDBalances {

  public async getUSDBalances_Mainnet(rpcUrl?: string) {
    const uwpbObj = new UnderwritingPoolBalances()
    const priceObj = new Price()
    
    const [ balances, prices, tokenPrices ] = await Promise.all([
      withBackoffRetries(async () => uwpbObj.getBalances_Mainnet(rpcUrl)),
      withBackoffRetries(async () => priceObj.getMainnetPrices(rpcUrl)),
      withBackoffRetries(async () => priceObj.getCoinGeckoTokenPrices())
    ])

    const USDBalances = balances.map((b: {
      token: string;
      amount: string;
  }) => {
      const token = b.token
      if(prices[token]) {
        return {
          token,
          usdBalance: parseFloat(b.amount) * prices[token]
        }
      } else {
        return {
          token,
          usdBalance: parseFloat(b.amount) * tokenPrices[token]
        }
      }
    })

    return USDBalances
  }

  public async getUSDBalances_Polygon(rpcUrl?: string) {
    const uwpbObj = new UnderwritingPoolBalances()
    const priceObj = new Price()
    // const balances = await withBackoffRetries(async () => uwpbObj.getBalances_Polygon())
    // const prices = await withBackoffRetries(async () => priceObj.getPolygonPrices())
    // const tokenPrices = await withBackoffRetries(async () => priceObj.getCoinGeckoTokenPrices())
    
    const [balances, prices, tokenPrices] = await Promise.all([
      withBackoffRetries(async () => uwpbObj.getBalances_Polygon(rpcUrl)),
      withBackoffRetries(async () => priceObj.getPolygonPrices(rpcUrl)),
      withBackoffRetries(async () => priceObj.getCoinGeckoTokenPrices())
    ])

    const USDBalances = balances.map((b: {
      token: string;
      amount: string;
  }) => {
      const token = b.token
      if(prices[token]) {
        return {
          token,
          usdBalance: parseFloat(b.amount) * prices[token]
        }
      } else {
        return {
          token,
          usdBalance: parseFloat(b.amount) * tokenPrices[token]
        }
      }
    })

    return USDBalances
  }

  public async getUSDBalances_Aurora(rpcUrl?: string) {
    const uwpbObj = new UnderwritingPoolBalances()
    const priceObj = new Price()
    // const balances = await withBackoffRetries(async () => uwpbObj.getBalances_Aurora())
    // const prices = await withBackoffRetries(async () => priceObj.getAuroraPrices())
    // const tokenPrices = await withBackoffRetries(async () => priceObj.getCoinGeckoTokenPrices())
    
    const [balances, prices, tokenPrices] = await Promise.all([
      withBackoffRetries(async () => uwpbObj.getBalances_Aurora(rpcUrl)),
      withBackoffRetries(async () => priceObj.getAuroraPrices(rpcUrl)),
      withBackoffRetries(async () => priceObj.getCoinGeckoTokenPrices())
    ])

    const USDBalances = balances.map((b: {
      token: string;
      amount: string;
  }) => {
      const token = b.token
      if(prices[token] != undefined) {
        console.log(token, prices[token], parseFloat(b.amount))
        return {
          token,
          usdBalance: parseFloat(b.amount) * prices[token]
        }
      } else {
        return {
          token,
          usdBalance: parseFloat(b.amount) * tokenPrices[token]
        }
      }
    })

    return USDBalances
  }

  public async getUSDBalances_All(rpcUrlMapping?: { [key: string]: string }) {
    const uwpbObj = new UnderwritingPoolBalances()
    const priceObj = new Price()

    const [tokenPrices, mainnetPrices, mainnetBalances, polygonPrices, polygonBalances, auroraPrices, auroraBalances] = await Promise.all([
      withBackoffRetries(async () => priceObj.getCoinGeckoTokenPrices()),
      withBackoffRetries(async () => priceObj.getMainnetPrices(rpcUrlMapping ? rpcUrlMapping[1] : undefined)),
      withBackoffRetries(async () => uwpbObj.getBalances_Mainnet(rpcUrlMapping ? rpcUrlMapping[1] : undefined)),
      withBackoffRetries(async () => priceObj.getPolygonPrices(rpcUrlMapping ? rpcUrlMapping[137] : undefined)),
      withBackoffRetries(async () => uwpbObj.getBalances_Polygon(rpcUrlMapping ? rpcUrlMapping[137] : undefined)),
      withBackoffRetries(async () => priceObj.getAuroraPrices(rpcUrlMapping ? rpcUrlMapping[1313161554] : undefined)),
      withBackoffRetries(async () => uwpbObj.getBalances_Aurora(rpcUrlMapping ? rpcUrlMapping[1313161554] : undefined))
    ])

    const USDBalances_Mainnet = mainnetBalances.map((b: {
      token: string;
      amount: string;
    }) => {
      const token = b.token
      if(mainnetPrices[token]) {
        return {
          token,
          usdBalance: parseFloat(b.amount) * mainnetPrices[token]
        }
      } else {
        return {
          token,
          usdBalance: parseFloat(b.amount) * tokenPrices[token]
        }
      }
    })

    const USDBalances_Polygon = polygonBalances.map((b: {
      token: string;
      amount: string;
    }) => {
      const token = b.token
      if(polygonPrices[token]) {
        return {
          token,
          usdBalance: parseFloat(b.amount) * polygonPrices[token]
        }
      } else {
        return {
          token,
          usdBalance: parseFloat(b.amount) * tokenPrices[token]
        }
      }
    })

    const USDBalances_Aurora = auroraBalances.map((b: {
      token: string;
      amount: string;
    }) => {
      const token = b.token
      if(auroraPrices[token]) {
        return {
          token,
          usdBalance: parseFloat(b.amount) * auroraPrices[token],
        }
      } else {
        return {
          token,
          usdBalance: parseFloat(b.amount) * tokenPrices[token],
        }
      }
    })

    const consolidatedUSDBalances = [...USDBalances_Mainnet, ...USDBalances_Polygon, ...USDBalances_Aurora]
    const totalUSDBalance = consolidatedUSDBalances.reduce((acc, curr) => acc + curr.usdBalance, 0)

    return {
      ['1']: USDBalances_Mainnet,
      ['137']: USDBalances_Polygon,
      ['1313161554']: USDBalances_Aurora,
      total: totalUSDBalance
    }
  }
}