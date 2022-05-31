import { Network } from "../types";

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
        chainId: 250,
        supportedTxTypes: [0]
    },{
        chainId: 4002,
        supportedTxTypes: [0],
        isTestnet: true,
    },{
        chainId: 43113,
        supportedTxTypes: [0, 2]
    },{
        chainId: 43114,
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

export const isNetworkSupported = (chainID: number): boolean => {
    const supportedChainIds = NETWORKS.map((network) => network.chainId);
    if ( supportedChainIds.includes(chainID) ) return true
    else return false
}

export const DEFAULT_ENDPOINT: { [chainID : number]: string } = {
    [137]: "https://polygon-rpc.com",
    [250]: "https://rpcapi.fantom.network/",
    [4002]: "https://rpc.testnet.fantom.network/",
    [43113]: "https://api.avax-test.network/ext/bc/C/rpc",
    [43114]: "https://api.avax.network/ext/bc/C/rpc",
    [80001]: "https://matic-mumbai.chainstacklabs.com",
    [1313161554]: "https://mainnet.aurora.dev",
    [1313161555]: "https://testnet.aurora.dev/"
} 