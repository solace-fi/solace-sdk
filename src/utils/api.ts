import axios from 'axios';

export const fetchCoingeckoTokenPricesByAddr = async (contractAddrs: string[], quote: string, platform: string) => {
  let contractsStr = ''
  for (let i = 0; i < contractAddrs.length; i++) {
    contractsStr += contractAddrs[i]
    if (i < contractAddrs.length - 1) {
      contractsStr += ','
    }
  }
  const quoteId = quote.toLowerCase()
  const platformId = platform.toLowerCase()
  const { data } = await axios.get(`https://api.coingecko.com/api/v3/simple/token_price/${platformId}`, {
    params: {
      contract_addresses: contractsStr,
      vs_currencies: quoteId,
    },
  })
  return data
}

export const fetchCoingeckoTokenPriceById = async (ids: string[], quote: string) => {
  let idsStr = ''
  for (let i = 0; i < ids.length; i++) {
    idsStr += ids[i]
    if (i < ids.length - 1) {
      idsStr += ','
    }
  }
  const quoteId = quote.toLowerCase()
  const { data } = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
    params: {
      ids: idsStr,
      vs_currency: quoteId,
    },
  })
  return data
}

export function processProtocolName(str: string): string {
  // remove hyphen & capitalize first letter of each word
  return str
    .split('-')
    .map((word) => {
      switch (word.toLowerCase()) {
        case 'amm':
        case 'apy':
          return word.toUpperCase()
        case 'defi':
          return 'DeFi'
        case 'defisaver':
          return 'DeFi Saver'
        case 'deversifi':
          return 'DeversiFi'
        case 'derivadex':
          return 'DerivaDEX'
        case 'dao':
          return 'DAO'
        case 'liquiddriver':
          return 'LiquidDriver'
        case 'tokensets':
          return 'TokenSets'
        case 'wepiggy':
          return 'WePiggy'
        case 'waultswap':
          return 'WaultSwap'
        case 'stormswap':
          return 'StormSwap'
        case 'spiritswap':
          return 'SpiritSwap'
        case 'spookyswap':
          return 'SpookySwap'
        case 'snowswap':
          return 'SnowSwap'
        case 'shapeshift':
          return 'ShapeShift'
        case 'yieldyak':
          return 'Yield Yak'
        default:
          return capitalizeFirstLetter(word)
      }
    })
    .join(' ')
}

export const capitalizeFirstLetter = (str: string): string => {
  if (str.length == 0) return str
  return str.charAt(0).toUpperCase().concat(str.slice(1))
}