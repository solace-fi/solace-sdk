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

  // For a given account and ERC721 contract, lists all the ERC721s NFTs owned by the account
  // Achieves this in one network call 'batch', i.e. you're only waiting for a single await call to resolve
  export const listERC721OfOwners = async (ERC721: Contract, account: string): Promise<BigNumber[]> => {
    const mintFilter = ERC721.filters.Transfer(null, account)
    const burnFilter = ERC721.filters.Transfer(account, null)

    const [mintEvents, burnEvents] = await Promise.all([
        ERC721.queryFilter(mintFilter),
        ERC721.queryFilter(burnFilter)
    ])

    const ownedTokenIds: BigNumber[] = [];
    const burnedTokenIds: BigNumber[]= [];

    for (const event of burnEvents) {
        burnedTokenIds.push(event?.args?.tokenId)
    }

    for (const event of mintEvents) {
        if (!burnedTokenIds.includes(event?.args?.tokenId)) {
          ownedTokenIds.push(event?.args?.tokenId)
        }
    }

    return ownedTokenIds
  }
  

