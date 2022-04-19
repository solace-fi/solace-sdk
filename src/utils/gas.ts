import { getDefaultProvider, providers, BigNumber } from "ethers";
const { getNetwork } = providers
import { FeeData, GasArgs, GasConfiguration } from '../types'
import { NETWORKS, WALLETS } from '..'
import { formatUnits } from 'ethers/lib/utils'

import { getProvider } from "../utils/ethers";


export const getGasPrice = async (abstract: providers.JsonRpcProvider | providers.JsonRpcSigner): Promise<number> => {
  const bnGasVal = await abstract.getGasPrice()
  const gasString = formatUnits(bnGasVal, 'gwei')
  return Math.ceil(parseFloat(gasString))
}

export const getGasSettings = async (chainId: number, gasArgs?: GasArgs): Promise<GasConfiguration> => {

  const getGasValue = (val: number) => Math.floor(val * Math.pow(10, 9))

  let foundWallet = WALLETS[0]
  const foundNetwork = NETWORKS.find((n) => n.chainId == chainId)
  if (gasArgs && gasArgs.connector) foundWallet = WALLETS.find((w) => w.id.toLowerCase() == gasArgs.connector) ?? WALLETS[0]
  if (!foundWallet || !foundNetwork) return {}
  if (gasArgs && !gasArgs.gasForTestnet && foundNetwork.isTestnet) return {}

  const gasLimitObj: { gasLimit?: number } = gasArgs && gasArgs.gasLimit ? { gasLimit: gasArgs.gasLimit } : {}

  let provider: providers.Provider

  if (chainId == 137) {
    provider = getProvider("https://polygon-rpc.com")
  } else if (chainId == 80001) {
      provider = getProvider("https://matic-mumbai.chainstacklabs.com")
  }
  else if (chainId == 1313161554) {
      provider = getProvider("https://mainnet.aurora.dev")
  } 
  else if (chainId == 1313161555) {
      provider = getProvider("https://testnet.aurora.dev")
  }
  else {
      provider = getDefaultProvider(getNetwork(chainId))
  }

  return await provider.getFeeData().then((result: FeeData) => {
    const gasPriceStr = formatUnits(result.gasPrice ?? BigNumber.from(0), 'gwei')
    const gasPrice = Math.ceil(parseFloat(gasPriceStr))

    const maxFeePerGasStr = formatUnits(result.maxFeePerGas ?? BigNumber.from(0), 'gwei')
    const maxFeePerGas = Math.ceil(parseFloat(maxFeePerGasStr))

    const maxPriorityFeePerGasStr = formatUnits(result.maxPriorityFeePerGas ?? BigNumber.from(0), 'gwei')
    const maxPriorityFeePerGas = Math.ceil(parseFloat(maxPriorityFeePerGasStr))
    
    if(foundWallet.supportedTxTypes.includes(2) && foundNetwork.supportedTxTypes.includes(2)){
      return {
        maxFeePerGas: getGasValue(maxFeePerGas),
        maxPriorityFeePerGas: getGasValue(maxPriorityFeePerGas),
        type: 2,
        ...gasLimitObj
      }
    }

    return {
      gasPrice: getGasValue(gasPrice),
      ...gasLimitObj
    }
  })
}