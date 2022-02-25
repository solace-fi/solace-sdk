import { AbstractConnector } from "@web3-react/abstract-connector";
import { NetworkConfig } from ".";

export type Wallet = {
    id: string
    supportedTxTypes: number[],
    getConnector(network?: NetworkConfig): AbstractConnector
}

export type OptionalSignerArgs = {
    network?: NetworkConfig
    account?: string
    connector?: string
    connectorArgs?: any
}