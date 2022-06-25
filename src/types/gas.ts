export type GasConfiguration ={
  gasPrice?: number
  maxFeePerGas?: number
  maxPriorityFeePerGas?: number
  type?: number
  gasLimit?: number
}

export type GasArgs = {
  txType?: number
  gasLimit?: number
  gasForTestnet?: boolean
}