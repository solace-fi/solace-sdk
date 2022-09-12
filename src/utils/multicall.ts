import { providers } from "ethers"
import { Contract, ContractCall } from "ethers-multicall"
import { all } from "ethers-multicall/dist/call"
import { getEthBalance } from "ethers-multicall/dist/calls"
import { multicallAddresses } from "../constants"

export class MulticallProvider {
  _provider: providers.Provider
  _multicallAddress: string

  constructor(provider: providers.Provider, chainId: number) {
    this._provider = provider
    this._multicallAddress = multicallAddresses[chainId]
  }

  public getEthBalance(address: string) {
    if (!this._provider) {
      throw new Error("Provider should be initialized before use.")
    }
    return getEthBalance(address, this._multicallAddress)
  }

  public async all<T extends any[] = any[]>(calls: ContractCall[]) {
    if (!this._provider) {
      throw new Error("Provider should be initialized before use.")
    }
    return all<T>(calls, this._multicallAddress, this._provider)
  }
}

export const MulticallContract = Contract
