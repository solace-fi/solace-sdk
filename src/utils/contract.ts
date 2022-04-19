import { BigNumber, Contract } from "ethers"
import { rangeFrom0 } from "."

export const listTokens = async (contract: Contract): Promise<BigNumber[]> => {
    const supply: BigNumber = await contract.totalSupply()
    const indices = rangeFrom0(supply.toNumber())
    const tokenIds: BigNumber[] = await Promise.all(
      indices.map(async (index: number) => await contract.tokenByIndex(index))
    ).catch((e) => {
      console.log('error: listTokens', e)
      return []
    })
    return tokenIds
  }
  
  export const listTokensOfOwner = async (token: Contract, account: string): Promise<BigNumber[]> => {
    const numTokensOfOwner: BigNumber = await token.balanceOf(account)
    const indices = rangeFrom0(numTokensOfOwner.toNumber())
    const tokenIds: BigNumber[] = await Promise.all(
      indices.map(
        async (index: number) => await token.tokenOfOwnerByIndex(account, index)
      )
    ).catch((e) => {
      console.log('error: listTokensOfOwner', e)
      return []
    })
    return tokenIds
  }
  