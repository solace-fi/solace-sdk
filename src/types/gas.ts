export type GasConfiguration =
  | {
      maxFeePerGas?: undefined
      type?: undefined
      gasPrice?: undefined
    }
  | {
      maxFeePerGas: number
      type: number
      gasPrice?: undefined
    }
  | {
      gasPrice: number
      maxFeePerGas?: undefined
      type?: undefined
    }
