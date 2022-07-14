import { getDefaultProvider, providers, BigNumber } from "ethers"
const { getNetwork } = providers
import { GasArgs, GasConfiguration } from "../types"
import { formatUnits } from "ethers/lib/utils"

import { getProvider } from "../utils/ethers"
import { DEFAULT_ENDPOINT, foundNetwork, isNetworkSupported } from "../constants"
import invariant from "tiny-invariant"
import { FeeData } from "@ethersproject/providers"

export const getGasPrice = async (
  providerOrSigner: providers.JsonRpcProvider | providers.JsonRpcSigner
): Promise<number> => {
  const bnGasVal = await providerOrSigner.getGasPrice()
  const gasString = formatUnits(bnGasVal, "gwei")
  return Math.ceil(parseFloat(gasString))
}

export const getGasSettings = async (
  chainId: number,
  rpcUrl?: string,
  gasArgs?: GasArgs
): Promise<GasConfiguration> => {
  invariant(isNetworkSupported(chainId), `Chain ID ${chainId} is not supported`)

  const getGasValue = (val: number) => Math.floor(val * Math.pow(10, 9))

  const network = foundNetwork(chainId)
  if (!network) return {}
  if (gasArgs && !gasArgs.gasForTestnet && network.isTestnet) return {}

  const gasLimitObj: { gasLimit?: number } = gasArgs && gasArgs.gasLimit ? { gasLimit: gasArgs.gasLimit } : {}

  let provider: providers.Provider

  if (rpcUrl) {
    provider = getProvider(rpcUrl)
  } else {
    if (DEFAULT_ENDPOINT[chainId]) {
      provider = getProvider(DEFAULT_ENDPOINT[chainId])
    } else {
      provider = getDefaultProvider(getNetwork(chainId))
    }
  }

  const { gasPrice, maxFeePerGas, maxPriorityFeePerGas } = await getGasFeeData(provider)

  if (gasArgs?.txType == 2) {
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
}

export const getGasFeeData = async (provider: providers.Provider) => {
  const getGasValue = (val: number) => Math.floor(val * Math.pow(10, 9))

  return await provider.getFeeData().then((result: FeeData) => {
    const gasPriceStr = formatUnits(result.gasPrice ?? BigNumber.from(0), "gwei")
    const gasPrice = Math.ceil(parseFloat(gasPriceStr))

    const maxFeePerGasStr = formatUnits(result.maxFeePerGas ?? BigNumber.from(0), "gwei")
    const maxFeePerGas = Math.ceil(parseFloat(maxFeePerGasStr))

    const maxPriorityFeePerGasStr = formatUnits(result.maxPriorityFeePerGas ?? BigNumber.from(0), "gwei")
    const maxPriorityFeePerGas = Math.ceil(parseFloat(maxPriorityFeePerGasStr))

    return {
      gasPrice: getGasValue(gasPrice),
      maxFeePerGas: getGasValue(maxFeePerGas),
      maxPriorityFeePerGas: getGasValue(maxPriorityFeePerGas)
    }
  })
}
