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