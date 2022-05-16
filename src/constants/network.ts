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
    [137] : "https://polygon-rpc.com", // Polygon
    [80001] : "https://matic-mumbai.chainstacklabs.com", // Polygon Testnet
    [1313161554] : "https://mainnet.aurora.dev/", // Aurora
    [1313161555] : "https://testnet.aurora.dev/", // Aurora Testnet
} 