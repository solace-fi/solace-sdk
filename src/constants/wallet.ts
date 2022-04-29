import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { Network, WalletConnector } from "../types";
import { NETWORKS } from ".";
import { DEFAULT_ENDPOINT } from "./network";

const DEFAULT_ENDPOINT_ETH: { [key: number] : string} = {
  [1]: "https://mainnet.infura.io/v3",
  [4]: "https://rinkeby.infura.io/v3",
  [42]: "https://kovan.infura.io/v3",
}

export const WALLETS: WalletConnector[] = [
    {
        id: 'metamask',
        supportedTxTypes: [0, 2],
        connector: new InjectedConnector({
          supportedChainIds: NETWORKS.map((network) => network.chainId),
        }),
    }, {
        id: 'walletconnect',
        supportedTxTypes: [0],
        connector: new WalletConnectConnector({
          supportedChainIds: NETWORKS.map((network) => network.chainId),
          rpc: NETWORKS.reduce(
            (rpcUrls: any, network: Network) => ({
              ...rpcUrls,
              [network.chainId]: DEFAULT_ENDPOINT[network.chainId] ?? DEFAULT_ENDPOINT_ETH[network.chainId],
            }),
            {}
          ),
          bridge: 'https://bridge.walletconnect.org',
          qrcode: true,
        }),
    }, {
        id: 'walletlink',
        supportedTxTypes: [0],
        connector: new WalletLinkConnector({
          supportedChainIds: NETWORKS.map((network) => network.chainId),
          url: "https://mainnet.infura.io/v3",
          appName: 'solace-coinbase',
        }),
    },
]