import { providers } from 'ethers'
import { GasConfiguration, NetworkConfig, Connector, ChainId } from '../types'
import { NETWORKS, WALLETS } from '..'

export const getProvider = (rpcUrl: string): providers.JsonRpcProvider => {
    return new providers.JsonRpcProvider(rpcUrl)
}

export const getSigner = async (network: NetworkConfig, connector: Connector, account: string, args?: any): Promise<providers.JsonRpcSigner> => {
    let _connector = undefined
    const foundWallet = WALLETS.find((w) => w.id.toLowerCase() == connector) ?? WALLETS[0]
    _connector = foundWallet.getConnector(network, args)
    let { provider } = await _connector.activate();
    const ethProvider = new providers.Web3Provider(provider, "any");
    const signer = ethProvider.getSigner(account).connectUnchecked()
    return signer
}

export const getGasSettings = (chainId: ChainId, connector: Connector, gasValue: number, gasLimit?: number): GasConfiguration => {
  const foundWallet = WALLETS.find((w) => w.id.toLowerCase() == connector)
  const foundNetwork = NETWORKS.find((n) => n.chainId == chainId)
  if (!foundWallet || !foundNetwork) return {}

  const gasLimitObj = gasLimit ? { gasLimit } : {}

  const nonHumanGasValue = Math.floor(gasValue * Math.pow(10, 9))

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