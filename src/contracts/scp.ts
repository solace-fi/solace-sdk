import { BigNumber as BN, providers, Wallet, Contract, getDefaultProvider, utils } from 'ethers'
const { getNetwork } = providers
import invariant from 'tiny-invariant'
import SCP_ABI from "../abis/SCP.json"
import { COVERAGE_SCP_ADDRESS, ZERO_ADDRESS, DEFAULT_ENDPOINT } from '../constants'
import { getProvider } from '../utils/ethers'

export class SCP {
    chainID: number;
    walletOrProviderOrSigner: Wallet | providers.JsonRpcSigner | providers.Provider;
    scp: Contract;

    // TO-DO add Fantom connection
    constructor(chainID: number, walletOrProviderOrSigner?: Wallet | providers.JsonRpcSigner | providers.Provider) {
        invariant(COVERAGE_SCP_ADDRESS[chainID],"not a supported chainID")
        this.chainID = chainID;

        if (typeof(walletOrProviderOrSigner) == 'undefined') {
            if (chainID == (1 || 4 || 42)) {this.walletOrProviderOrSigner = getDefaultProvider(getNetwork(chainID))}
            else {this.walletOrProviderOrSigner = getProvider(DEFAULT_ENDPOINT[chainID])}
        } else {
            this.walletOrProviderOrSigner = walletOrProviderOrSigner
        }

        this.scp = new Contract(COVERAGE_SCP_ADDRESS[chainID], SCP_ABI, this.walletOrProviderOrSigner)
    }


    /**************************************************************
    METHODS - SCP EXTERNAL VIEW FUNCTION WRAPPERS
    **************************************************************/
     
    /**
     * @returns The amount of tokens owned by `account`.
     */
     public async balanceOf(account: string): Promise<BN> {
        invariant(utils.isAddress(account), 'not an Ethereum address')
        invariant(account !== ZERO_ADDRESS, "cannot enter zero address")
        return (await this.scp.balanceOf(account))
    }

    /**
     * @returns The amount of tokens owned by account that cannot be withdrawn.
     */
     public async balanceOfNonRefundable(account: string): Promise<BN> {
        invariant(utils.isAddress(account), 'not an Ethereum address')
        invariant(account !== ZERO_ADDRESS, "cannot enter zero address")
        return (await this.scp.balanceOfNonRefundable(account))
    }

    /**
     * @returns Calculates the minimum amount of Solace Cover Points required by this contract for the account to hold.
     */
     public async minScpRequired(account: string): Promise<BN> {
        invariant(utils.isAddress(account), 'not an Ethereum address')
        invariant(account !== ZERO_ADDRESS, "cannot enter zero address")
        return (await this.scp.minScpRequired(account))
    }
}