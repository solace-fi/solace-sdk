import { providers } from 'ethers'
import { OptionalSignerArgs } from '../types'
import { WALLETS } from '..'
import { AbstractConnector } from '@web3-react/abstract-connector'

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