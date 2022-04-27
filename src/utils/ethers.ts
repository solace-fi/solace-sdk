import { providers } from 'ethers'
import { WALLETS } from '..'

export const getProvider = (rpcUrl: string): providers.JsonRpcProvider => new providers.JsonRpcProvider(rpcUrl)

export const getSigner = async (account?: string, walletId?: string): Promise<providers.JsonRpcSigner> => {
  const foundWallet = walletId ? WALLETS.find((w) => w.id.toLowerCase() == walletId) ?? WALLETS[0] : WALLETS[0]
  const { provider } = await foundWallet.connector.activate();
  const ethProvider = new providers.Web3Provider(provider, "any");
  const signer = account ? ethProvider.getSigner(account) : ethProvider.getSigner()
  return signer
}