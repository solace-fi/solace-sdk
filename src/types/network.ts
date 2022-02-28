export type NetworkConfig = {
    chainId: number
    rpc: {
      httpsUrl: string
      pollingInterval?: number
    }
  }

export type Network = {
  chainId: number,
  supportedTxTypes: number[]
  isTestnet?: boolean
}