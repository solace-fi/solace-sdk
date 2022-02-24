export type NetworkConfig = {
    chainId: number
    rpc: {
      httpsUrl: string
      pollingInterval: number
    }
  }

export type Network = {
  chainId: number,
  supportedTxTypes: number[]
}

export type ChainId = 1 | 4