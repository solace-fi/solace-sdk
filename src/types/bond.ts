import { Contract } from '@ethersproject/contracts'
import { BigNumber } from 'ethers'

export type BondTellerDetails = {
  tellerData: BondTellerData
  principalData: BondPrincipalData
}

export type BondTellerTokenData = { [chainId: number]: { addr: string; type: 'erc20' | 'eth' | 'matic' } }
  
export type BondTellerData = {
  teller: BondTellerContractData
  bondPrice: BigNumber
  usdBondPrice: number
  vestingTermInSeconds: number
  capacity: BigNumber
  maxPayout: BigNumber
  bondFeeBps?: BigNumber
  bondRoi: number
}

export type BondTellerContractData = { contract: Contract; type: 'erc20' | 'eth' | 'matic' }

export type BondPrincipalData = {
  principal: Contract
  principalProps: {
    symbol: string
    decimals: number
    name: string
    address: string
  }
  token0?: string
  token1?: string
}

export type BondTokenData = {
  payoutAmount: BigNumber
  payoutAlreadyClaimed: BigNumber
  principalPaid: BigNumber
  vestingStart: number
  localVestingTerm: number
}

export type BondToken = BondTokenData & {
  id: BigNumber
}