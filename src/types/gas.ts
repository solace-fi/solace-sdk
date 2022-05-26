export type GasConfiguration ={
  gasPrice?: number
  maxFeePerGas?: number
  maxPriorityFeePerGas?: number
  type?: number
  gasLimit?: number
}

export type GasArgs = {
  connector?: string
  gasLimit?: number
  gasForTestnet?: boolean
}