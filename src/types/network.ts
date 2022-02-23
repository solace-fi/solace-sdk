export type NetworkConfig = {
    chainId: number
    rpc: {
      httpsUrl: string
      pollingInterval: number
    }
  }