import { NetworkConfig } from ".";

export type Wallet = {
    id: string
    supportedTxTypes: number[],
    getConnector(network: NetworkConfig, args?: any): any
}