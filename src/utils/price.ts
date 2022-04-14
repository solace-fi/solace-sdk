import { Contract, BigNumber, Wallet, providers } from "ethers"
const ethers = require('ethers')
const formatUnits = ethers.utils.formatUnits
import { withBackoffRetries } from "."

const ETH_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"

// returns the balance of a holder for a list of tokens
// result is an array
// each element will be a decimal formatted string eg [ "1.2" ]
export async function fetchBalances(walletOrProviderOrSigner: Wallet | providers.JsonRpcSigner | providers.Provider, tokenList: { contract: Contract, address: string, symbol: string, decimals: number }[], holder: string, blockTag: number): Promise<string[]> {
  function createBalancePromise(i: number): Promise<string> {

    return new Promise((resolve, reject) => {
      withBackoffRetries(() => ((tokenList[i].address == ETH_ADDRESS)
        ? walletOrProviderOrSigner.getBalance(holder, blockTag=blockTag)
        : tokenList[i].contract.balanceOf(holder, {blockTag:blockTag})
      )).then(bal => { resolve(formatUnits(bal, tokenList[i].decimals)) }).catch(() => { resolve("0.0") })
    })
  }
  var promises: string[] = []
  for(var i = 0; i < tokenList.length; ++i) {
    promises.push(await createBalancePromise(i))
  }
  return Promise.all(promises)
}

// fetch the total supply of a token
// if the token does not exist returns 0
export async function fetchSupplyOrZero(token: Contract, blockTag: number): Promise<BigNumber> {
  return new Promise((resolve, reject) => {
    withBackoffRetries(() => token.totalSupply({blockTag:blockTag})).then(resolve).catch(()=>{resolve(BigNumber.from(0))})
  })
}

// fetch the token balance of a holder
// if the token does not exist returns 0
export async function fetchBalanceOrZero(token: Contract, holder: string, blockTag: number): Promise<BigNumber> {
  return new Promise((resolve, reject) => {
    withBackoffRetries(() => token.balanceOf(holder, {blockTag:blockTag})).then(resolve).catch(()=>{resolve(BigNumber.from(0))})
  })
}

// fetch the price per share of solace capital provider token
// if the token does not exist returns 0
export async function fetchScpPpsOrZero(scp: Contract, blockTag: number): Promise<BigNumber> {
  return new Promise((resolve, reject) => {
    withBackoffRetries(() => scp.pricePerShare({blockTag:blockTag})).then(resolve).catch(()=>{resolve(BigNumber.from(0))})
  })
}

// fetch the reserves of a uniswap v2 pair (and forks)
// if the pool does not exist returns 0
export async function fetchReservesOrZero(pair: Contract, blockTag: number): Promise<{_reserve0:BigNumber,_reserve1:BigNumber}> {
  return new Promise((resolve, reject) => {
    withBackoffRetries(() => pair.getReserves({blockTag:blockTag})).then(resolve).catch(()=>{resolve({_reserve0:BigNumber.from(0),_reserve1:BigNumber.from(0)})})
  })
}

// fetch the price of a token in a uniswap v2 pool
export async function fetchUniswapV2PriceOrZero(pair: Contract, oneZero: boolean, decimals0: number, decimals1: number, blockTag: number): Promise<number> {
  return new Promise((resolve, reject) => {
    withBackoffRetries(() => pair.getReserves({blockTag:blockTag})).then(reserves => {
      resolve(calculateUniswapV2PriceOrZero(reserves._reserve0, reserves._reserve1, oneZero, decimals0, decimals1))
    }).catch(()=>{resolve(0.0)})
  })
}

// given uniswap v2 pool reserves, calculates the price of a token
function calculateUniswapV2PriceOrZero(reserve0: BigNumber, reserve1: BigNumber, oneZero: boolean, decimals0: number, decimals1: number) {
  if(reserve0.eq(0) || reserve1.eq(0)) return 0.0
  else {
    var amt0 = (formatUnits(reserve0, decimals0) - 0)
    var amt1 = (formatUnits(reserve1, decimals1) - 0)
    // oneZero == true -> price of token 1 in terms of token 0
    var price = oneZero ? amt0/amt1 : amt1/amt0
    return price
  }
}
exports.calculateUniswapV2PriceOrZero = calculateUniswapV2PriceOrZero

const ONE_ETHER = BigNumber.from("1000000000000000000")
const x192 = BigNumber.from("0x01000000000000000000000000000000000000000000000000")

// fetch the price of a token in a uniswap v3 pool
export async function fetchUniswapV3PriceOrZero(pool: Contract, oneZero: boolean, decimals0: number, decimals1: number, blockTag: number): Promise<number> {
  return new Promise((resolve, reject) => {
    withBackoffRetries(() => pool.slot0({blockTag:blockTag})).then(slot0 => {
      var price = formatUnits(
        slot0.sqrtPriceX96.mul(slot0.sqrtPriceX96)
        .mul(ONE_ETHER)
        .mul(decimalsToAmount(decimals0))
        .div(decimalsToAmount(decimals1))
        .div(x192),
      18) - 0
      // oneZero == true -> price of token 1 in terms of token 0
      if(price != 0.0 && !oneZero) price = 1/price
      resolve(price)
    }).catch(()=>{resolve(0.0)})
  })
}

function decimalsToAmount(decimals: number) {
  decimals = BigNumber.from(decimals).toNumber()
  var s = '1'
  for(var i = 0; i < decimals; ++i) s += '0'
  return BigNumber.from(s)
}