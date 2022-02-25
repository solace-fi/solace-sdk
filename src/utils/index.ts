import { providers } from 'ethers'
import { GasArgs, GasConfiguration, OptionalSignerArgs } from '../types'
import { NETWORKS, WALLETS } from '..'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { formatUnits } from 'ethers/lib/utils'

export const getProvider = (rpcUrl: string): providers.JsonRpcProvider => {
    return new providers.JsonRpcProvider(rpcUrl)
}

export const getSigner = async (signerArgs?: OptionalSignerArgs): Promise<providers.JsonRpcSigner> => {
    let _connector: AbstractConnector | undefined = undefined
    let foundWallet = WALLETS[0]
    if (signerArgs && signerArgs.connector && signerArgs.network) {
      foundWallet = WALLETS.find((w) => w.id.toLowerCase() == signerArgs.connector) ?? WALLETS[0]
    }
    _connector = (foundWallet.id != WALLETS[0].id) && signerArgs && signerArgs.network ? foundWallet.getConnector(signerArgs.network) : foundWallet.getConnector()
    let { provider } = await _connector.activate();
    const ethProvider = new providers.Web3Provider(provider, "any");
    const signer = signerArgs && signerArgs.account ? ethProvider.getSigner(signerArgs.account) : ethProvider.getSigner()
    return signer
}

export const getGasPrice = async (abstract: providers.JsonRpcProvider | providers.JsonRpcSigner): Promise<number> => {
  const bnGasVal = await abstract.getGasPrice()
  const gasString = formatUnits(bnGasVal, 'gwei')
  return Math.ceil(parseFloat(gasString))
}

export const getGasSettings = (chainId: number, gasPrice: number, gasArgs?: GasArgs): GasConfiguration => {
  let foundWallet = WALLETS[0]
  if (gasArgs && gasArgs.connector) foundWallet = WALLETS.find((w) => w.id.toLowerCase() == gasArgs.connector) ?? WALLETS[0]
  const foundNetwork = NETWORKS.find((n) => n.chainId == chainId)
  if (!foundWallet || !foundNetwork) return {}
  if (gasArgs && !gasArgs.gasForTestnet && foundNetwork.isTestnet) return {}

  const gasLimitObj: { gasLimit?: number } = gasArgs && gasArgs.gasLimit ? { gasLimit: gasArgs.gasLimit } : {}
  const nonHumanGasValue = Math.floor(gasPrice * Math.pow(10, 9))

  if(foundWallet.supportedTxTypes.includes(2) && foundNetwork.supportedTxTypes.includes(2)){
    return {
      maxFeePerGas: nonHumanGasValue,
      type: 2,
      ...gasLimitObj
    }
  }

  return {
    gasPrice: nonHumanGasValue,
    ...gasLimitObj
  }
}