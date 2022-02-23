import { providers } from 'ethers'
import { NetworkConfig } from '../types'
import { InjectedConnector } from '@web3-react/injected-connector'
import { LedgerConnector as Ledger_Connector } from '@web3-react/ledger-connector'
import { TrezorConnector as Trezor_Connector } from '@web3-react/trezor-connector'
import { WalletConnectConnector as WalletConnect_Connector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector as WalletLink_Connector } from '@web3-react/walletlink-connector'

export const getProvider = (rpcUrl: string): providers.JsonRpcProvider => {
    return new providers.JsonRpcProvider(rpcUrl)
}

export const getSigner = async (network: NetworkConfig, connector: string, account: string, args?: any): Promise<providers.JsonRpcSigner> => {
    let _connector = undefined
        switch(connector) {
            case 'ledger':
                _connector = new Ledger_Connector({
                    chainId: network.chainId,
                    url: network.rpc.httpsUrl,
                    pollingInterval: network.rpc.pollingInterval,
                    baseDerivationPath: args.baseDerivationPath ?? undefined,
                  })
                break
            case 'trezor':
                _connector = new Trezor_Connector({
                    chainId: network.chainId,
                    url: network.rpc.httpsUrl,
                    pollingInterval: network.rpc.pollingInterval,
                    manifestEmail: '',
                    manifestAppUrl: '',
                    config: {
                      networkId: network.chainId,
                    },
                  })
                  break
            case 'walletconnect': 
                  _connector = new WalletConnect_Connector({
                    rpc: { [network.chainId]: network.rpc.httpsUrl },
                    bridge: 'https://bridge.walletconnect.org',
                    qrcode: true,
                  })
                  break
            case 'walletlink':
                  _connector = new WalletLink_Connector({
                    url: network.rpc.httpsUrl,
                    appName: 'solace-coinbase',
                    appLogoUrl: '',
                  })
                  break
            case 'metamask':
            default:
                _connector = new InjectedConnector({
                    supportedChainIds: [1, 4, 42, 137, 80001, 1313161554, 1313161555],
                  })
        }
    let { provider } = await _connector.activate();
    const ethProvider = new providers.Web3Provider(provider, "any");
    const signer = ethProvider.getSigner(account).connectUnchecked()
    return signer
}