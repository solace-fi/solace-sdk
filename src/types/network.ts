import { MasterToken } from "../constants"

export type Network = {
  chainId: number,
  supportedTxTypes: number[]
  isTestnet?: boolean
  nativeCurrency: {
    symbol: MasterToken
    decimals: number
  }
  features: {
    general: {
      bondingV2?: boolean
      coverageV1?: boolean
      coverageV2?: boolean
      coverageV3?: boolean
      stakingRewardsV2?: boolean
      stakingV2?: boolean
    },
    special: {
      unwrapBridgedSolace?: boolean
    }
  }
  underwritingPoolAddr?: string
}