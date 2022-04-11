import { AbstractConnector } from "@web3-react/abstract-connector";
import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { NetworkConfig, WalletConnector } from "../types";
import { NETWORKS } from ".";

export const WALLETS: WalletConnector[] = [
    {
        id: 'metamask',
        supportedTxTypes: [0, 2],
        getConnector(): AbstractConnector {
            return new InjectedConnector({
                supportedChainIds: NETWORKS.map((network) => network.chainId),
            })
        }
    },
    {
        id: 'walletconnect',
        supportedTxTypes: [0],
        getConnector(network: NetworkConfig): AbstractConnector {
            return new WalletConnectConnector({
                rpc: { [network.chainId]: network.rpc.httpsUrl },
                bridge: 'https://bridge.walletconnect.org',
                qrcode: true,
              })
        }
    }, {
        id: 'walletlink',
        supportedTxTypes: [0],
        getConnector(network: NetworkConfig): AbstractConnector {
            return new WalletLinkConnector({
                url: network.rpc.httpsUrl,
                appName: 'coinbase',
                appLogoUrl: '',
              })
        }
    },
]