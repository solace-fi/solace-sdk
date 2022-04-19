import { BigNumber } from "ethers"

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

export interface FeeData {
  maxFeePerGas: null | BigNumber;
  maxPriorityFeePerGas: null | BigNumber;
  gasPrice: null | BigNumber;
}