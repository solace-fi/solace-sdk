import { Contract } from '@ethersproject/contracts'
import { BigNumber } from 'ethers'

export type BondTellerDetails = {
    tellerData: BondTellerData
    principalData: BondPrincipalData
  }
  
export type BondTellerData = {
  teller: Contract
  bondPrice: BigNumber
  usdBondPrice: number
  vestingTermInSeconds: number
  capacity: BigNumber
  maxPayout: BigNumber
  bondFeeBps?: BigNumber
  bondRoi: number
}

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