import { providers } from 'ethers'

export const getProvider = (rpcUrl: string): providers.JsonRpcProvider => new providers.JsonRpcProvider(rpcUrl)