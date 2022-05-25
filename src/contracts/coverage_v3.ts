import { BigNumber as BN, providers, Wallet, Contract, getDefaultProvider, utils, BigNumberish } from 'ethers'
const { getNetwork } = providers
import invariant from 'tiny-invariant'
import SolaceCoverProductV3 from "../abis/SolaceCoverProductV3.json"
import { SOLACE_COVER_PRODUCT_V3_ADDRESS, ZERO_ADDRESS, DEFAULT_ENDPOINT } from '../constants'
import { GasConfiguration } from '../types';
import { getProvider } from '../utils/ethers'

export class CoverageV3 {
    chainID: number;
    walletOrProviderOrSigner: Wallet | providers.JsonRpcSigner | providers.Provider;
    solaceCoverProduct: Contract;

    // TO-DO add Fantom connection
    constructor(chainID: number, walletOrProviderOrSigner?: Wallet | providers.JsonRpcSigner | providers.Provider) {
        invariant(SOLACE_COVER_PRODUCT_V3_ADDRESS[chainID],"not a supported chainID")
        this.chainID = chainID;

        if (typeof(walletOrProviderOrSigner) == 'undefined') {
            if (chainID == (1 || 4 || 42)) {this.walletOrProviderOrSigner = getDefaultProvider(getNetwork(chainID))}
            else {this.walletOrProviderOrSigner = getProvider(DEFAULT_ENDPOINT[chainID])}
        } else {
            this.walletOrProviderOrSigner = walletOrProviderOrSigner
        }

        this.solaceCoverProduct = new Contract(SOLACE_COVER_PRODUCT_V3_ADDRESS[chainID], SolaceCoverProductV3, this.walletOrProviderOrSigner)
    }

    /*****************************************************************
    METHODS - SOLACECOVERPRODUCTV3 EXTERNAL MUTATOR FUNCTION WRAPPERS
    *****************************************************************/
    
    /**
     * @notice Activates policy for provided `_user`.
     * @param _user The account to purchase policy. 
     * @param _coverLimit The maximum value to cover in **USD**.
     * @return policyID The ID of the newly minted policy.
     */
     public async purchaseFor(
        _user: string,
        _coverLimit: BigNumberish,
        gasConfig?: GasConfiguration
    ): Promise<providers.TransactionResponse> {
        invariant(providers.JsonRpcSigner.isSigner(this.walletOrProviderOrSigner), "cannot execute mutator function without a signer")
        invariant(utils.isAddress(_user), "not an Ethereum address")
        invariant(_user !== ZERO_ADDRESS, "cannot enter zero address")
        const tx: providers.TransactionResponse = await this.solaceCoverProduct.purchaseFor(_user, _coverLimit, {...gasConfig})
        return tx
    }

    /**
     * @notice Activates policy for `msg.sender`.
     * @param _coverLimit The maximum value to cover in **USD**.
     * @return policyID The ID of the newly minted policy.
     */
     public async purchase(
        _coverLimit: BigNumberish,
        gasConfig?: GasConfiguration
    ): Promise<providers.TransactionResponse> {
        invariant(providers.JsonRpcSigner.isSigner(this.walletOrProviderOrSigner), "cannot execute mutator function without a signer")
        const tx: providers.TransactionResponse = await this.solaceCoverProduct.purchase(_coverLimit, {...gasConfig})
        return tx
    }

    /**
     * @notice Cancels the policy for `msg.sender`.
     */
     public async cancel(
        gasConfig?: GasConfiguration
    ): Promise<providers.TransactionResponse> {
        invariant(providers.JsonRpcSigner.isSigner(this.walletOrProviderOrSigner), "cannot execute mutator function without a signer")
        const tx: providers.TransactionResponse = await this.solaceCoverProduct.cancel({...gasConfig})
        return tx
    }

    /**************************************************************
    METHODS - SOLACECOVERPRODUCTV3 EXTERNAL VIEW FUNCTION WRAPPERS
    **************************************************************/
     
    /**
     * @returns The active cover limit in **USD** to 18 decimal places. In other words, the total cover that has been sold at the current time.
     */
     public async activeCoverLimit(): Promise<BN> {
        return (await this.solaceCoverProduct.activeCoverLimit())
    }

    /**
     * @returns The amount of available remaining capacity for new cover.
     */
     public async availableCoverCapacity(): Promise<BN> {
        return (await this.solaceCoverProduct.availableCoverCapacity())
    }

    /**
     * @returns The maximum amount of cover that can be sold in **USD** to 18 decimals places.
     */
     public async maxCover(): Promise<BN> {
        return (await this.solaceCoverProduct.maxCover())
    }

    /**
     * @param policyID The policy ID.
     * @returns True if policy is active. False if policy is inactive, or does not exist.
     */
     public async policyStatus(policyID: BigNumberish): Promise<boolean> {
        return (await this.solaceCoverProduct.policyStatus(policyID))
    }

    /**
     * @param coverLimit Cover limit.
     * @returns The minimum required account balance for a given cover limit. Equals the maximum chargeable fee for one epoch.
     */
     public async minRequiredAccountBalance(coverLimit: BN): Promise<BN> {
        return (await this.solaceCoverProduct.minRequiredAccountBalance(coverLimit))
    }

    /**
     * @notice Calculates the minimum amount of Solace Cover Dollars required by this contract for the account to hold.
     * @param policyholder The account to query.
     * @return amount The amount of SCD the account must hold.
     */
     public async minScpRequired(policyholder: string): Promise<BN> {
        invariant(utils.isAddress(policyholder), 'not an Ethereum address')
        invariant(policyholder !== ZERO_ADDRESS, "cannot enter zero address")
        return (await this.solaceCoverProduct.minScpRequired(policyholder))
    }

    /**
     * @notice Returns the Uniform Resource Identifier (URI) for `policyID`.
     * @param policyID The policy ID.
     */
     public async tokenURI(policyID: BigNumberish): Promise<string> {
        return (await this.solaceCoverProduct.tokenURI(policyID))
    }

    /**
     * @notice Calculates the policy cancellation fee.
     * @param policyID The policy id.
     * @return fee The cancellation fee.
     */
     public async calculateCancelFee(policyID: BigNumberish): Promise<BN> {
        return (await this.solaceCoverProduct.calculateCancelFee(policyID))
    }

    /**********************************************
    METHODS - SOLACECOVERPRODUCTV3 GETTER FUNCTION
    **********************************************/

    /**
     * @returns true if paused, false otherwise
     */
     public async paused(): Promise<boolean> {
        return (await this.solaceCoverProduct.paused())
    }

    /**
     * @returns The policy count (amount of policies that have been purchased, includes inactive policies).
     */
     public async policyCount(): Promise<BN> {
        return (await this.solaceCoverProduct.policyCount())
    }

    /**
     * @returns Maximum epoch duration over which premiums are charged (Default is one week).
     */
     public async chargeCycle(): Promise<BN> {
        return (await this.solaceCoverProduct.chargeCycle())
    }

    /**
     * @returns The latest premium charged timestamp.
     */
     public async latestChargedTime(): Promise<BN> {
        return (await this.solaceCoverProduct.latestChargedTime())
    }

    /**
     * @param policyID The policy ID.
     * @returns The cover limit for the given policy ID.
     */
     public async coverLimitOf(policyID: BigNumberish): Promise<BN> {
        return (await this.solaceCoverProduct.coverLimitOf(policyID))
    }

    /**
     * @param policyholder The policyholder address.
     * @returns policyID The policy ID.
     */
     public async policyOf(policyholder: string): Promise<BN> {
        invariant(utils.isAddress(policyholder), 'not an Ethereum address')
        invariant(policyholder !== ZERO_ADDRESS, "cannot enter zero address")
        return (await this.solaceCoverProduct.policyOf(policyholder))
    }

    /**
     * @param policyholder The policyholder address.
     * @returns debt Policy debt.
     */
     public async debtOf(policyholder: string): Promise<BN> {
        invariant(utils.isAddress(policyholder), 'not an Ethereum address')
        invariant(policyholder !== ZERO_ADDRESS, "cannot enter zero address")
        return (await this.solaceCoverProduct.debtOf(policyholder))
    }
}