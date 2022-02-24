export type GasConfiguration =
  | {
      maxFeePerGas?: undefined
      type?: undefined
      gasPrice?: undefined
      gasLimit?: undefined
    }
  | {
      maxFeePerGas: number
      type: number
      gasPrice?: undefined
      gasLimit?: number | undefined
    }
| {
    gasPrice: number
    maxFeePerGas?: undefined
    type?: undefined
    gasLimit?: number | undefined
  }
