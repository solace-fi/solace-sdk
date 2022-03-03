import { AbstractConnector } from "@web3-react/abstract-connector";
import { InjectedConnector } from "@web3-react/injected-connector";
// import { LedgerConnector } from "@web3-react/ledger-connector";
// import { TrezorConnector } from "@web3-react/trezor-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { BigNumber as BN } from "ethers";
import { Network, NetworkConfig, WalletConnector } from "./types";

// exports for internal consumption
export const ZERO = BN.from("0")
export const ONE = BN.from("1")
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export const SOLACE_ADDRESS: { [chainID : number]: string } = {
    [1] : "0x501acE9c35E60f03A2af4d484f49F9B1EFde9f40", // Eth Mainnet
    [4] : "0x501acE9c35E60f03A2af4d484f49F9B1EFde9f40", // Rinkeby
    [137] : "0x501acE9c35E60f03A2af4d484f49F9B1EFde9f40", // Polygon
    [1313161554] : "0x501acE9c35E60f03A2af4d484f49F9B1EFde9f40", // Aurora
}

export const DAI_ADDRESS: { [chainID : number]: string } = {
    [1] : "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    [4] : "0x8ad3aA5d5ff084307d28C8f514D7a193B2Bfe725",
    [137] : "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
    [1313161554] : "0xe3520349F477A5F6EB06107066048508498A291b",
}

export const SOLACE_COVER_PRODUCT_ADDRESS: { [chainID: number]: string } = {
    [1]: "0x501ACEbe29eabc346779BcB5Fd62Eaf6Bfb5320E",
    [4]: "0x501AcE125346445b04A7c414C55a3d18d51Bf547"
}

export const XSLOCKER_ADDRESS: { [chainID: number]: string } = {
    [1]: "0x501Ace47c5b0C2099C4464f681c3fa2ECD3146C1",
    [4]: "0x501Ace47c5b0C2099C4464f681c3fa2ECD3146C1",
    [137]: "0x501Ace47c5b0C2099C4464f681c3fa2ECD3146C1",
    [1313161554]: "0x501Ace47c5b0C2099C4464f681c3fa2ECD3146C1"
}

export const STAKING_REWARDS_ADDRESS: { [chainID: number]: string } = {
    [1]: "0x501ace3D42f9c8723B108D4fBE29989060a91411",
    [4]: "0x501ace3D42f9c8723B108D4fBE29989060a91411",
    [137]: "0x501ace3D42f9c8723B108D4fBE29989060a91411",
    [1313161554]: "0x501ace3D42f9c8723B108D4fBE29989060a91411"
}

export const NETWORKS: Network[] = [
    {
        chainId: 1,
        supportedTxTypes: [0, 2]
    },{
        chainId: 4,
        supportedTxTypes: [0, 2],
        isTestnet: true,
    },{
        chainId: 42,
        supportedTxTypes: [0, 2],
        isTestnet: true,
    },{
        chainId: 137,
        supportedTxTypes: [0, 2]
    },{
        chainId: 80001,
        supportedTxTypes: [0, 2],
        isTestnet: true,
    },{
        chainId: 1313161554,
        supportedTxTypes: [0],
    },{
        chainId: 1313161555,
        supportedTxTypes: [0],
        isTestnet: true,
    }
]

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
    // {
    //     id: 'ledger',
    //     supportedTxTypes: [0, 2],
    //     getConnector(network: NetworkConfig) {
    //         return new LedgerConnector({
    //             chainId: network.chainId,
    //             url: network.rpc.httpsUrl,
    //             pollingInterval: network.rpc.pollingInterval,
    //             baseDerivationPath: args.baseDerivationPath ?? undefined,
    //           })
    //     }
    // }, {
    //     id: 'trezor',
    //     supportedTxTypes: [0],
    //     getConnector(network: NetworkConfig) {
    //         return new TrezorConnector({
    //             chainId: network.chainId,
    //             url: network.rpc.httpsUrl,
    //             pollingInterval: network.rpc.pollingInterval,
    //             manifestEmail: '',
    //             manifestAppUrl: '',
    //             config: {
    //               networkId: network.chainId,
    //             },
    //           })
    //     }
    // }, 
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