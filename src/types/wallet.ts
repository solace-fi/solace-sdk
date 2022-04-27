import { AbstractConnector } from "@web3-react/abstract-connector";

export type WalletConnector = {
    id: string
    supportedTxTypes: number[],
    connector: AbstractConnector
}