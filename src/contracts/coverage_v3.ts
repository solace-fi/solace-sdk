import { BigNumber as BN, providers, Wallet, Contract, getDefaultProvider, utils, BigNumberish } from 'ethers'
const { getNetwork } = providers
import invariant from 'tiny-invariant'
import {SolaceCoverProductV3_ABI} from ".."
import { SOLACE_COVER_PRODUCT_V3_ADDRESS, ZERO_ADDRESS, DEFAULT_ENDPOINT, foundNetwork } from '../constants'
import { GasConfiguration } from '../types';
import { getProvider } from '../utils/ethers'

export class CoverageV3 {
    chainID: number;
    walletOrProviderOrSigner: Wallet | providers.JsonRpcSigner | providers.Provider;
    solaceCoverProduct: Contract;

    // TO-DO add Fantom connection
    constructor(chainID: number, walletOrProviderOrSigner?: Wallet | providers.JsonRpcSigner | providers.Provider) {
        invariant(foundNetwork(chainID)?.features.general.coverageV3 && SOLACE_COVER_PRODUCT_V3_ADDRESS[chainID],"not a supported chainID")
        this.chainID = chainID;

        if (typeof(walletOrProviderOrSigner) == 'undefined') {
            if(DEFAULT_ENDPOINT[chainID]){
                this.walletOrProviderOrSigner = getProvider(DEFAULT_ENDPOINT[chainID])
            }
            else{
                this.walletOrProviderOrSigner = getDefaultProvider(getNetwork(chainID))
            }
        } else {
            this.walletOrProviderOrSigner = walletOrProviderOrSigner
        }

        this.solaceCoverProduct = new Contract(SOLACE_COVER_PRODUCT_V3_ADDRESS[chainID], SolaceCoverProductV3_ABI, this.walletOrProviderOrSigner)
    }

    /*****************************************************************
    METHODS - SOLACECOVERPRODUCTV3 EXTERNAL MUTATOR FUNCTION WRAPPERS
    *****************************************************************/
    
    /**
     * @notice Purchases policy for provided `_user`.
     * @param _user The policy owner.
     * @param _coverLimit The maximum value to cover in **USD**.
     * @param _token The token to deposit.
     * @param _amount Amount of token to deposit.
     * @return policyID The ID of the newly minted policy.
    */
     public async purchaseWithStable(
        _user: string,
        _coverLimit: BigNumberish,
        _token: string,
        _amount: BigNumberish,
        gasConfig?: GasConfiguration
    ): Promise<providers.TransactionResponse> {
        invariant(providers.JsonRpcSigner.isSigner(this.walletOrProviderOrSigner), "cannot execute mutator function without a signer")
        invariant(utils.isAddress(_user), "not an Ethereum address")
        invariant(_user !== ZERO_ADDRESS, "cannot enter zero address")
        invariant(utils.isAddress(_token), "_token - not an Ethereum address")
        invariant(_token !== ZERO_ADDRESS, "_token - cannot enter zero address")
        const tx: providers.TransactionResponse = await this.solaceCoverProduct.purchaseWithStable(_user, _coverLimit, _token, _amount, {...gasConfig})
        return tx
    }

    /**
     * @notice Purchases policy for the user.
     * @param _user The policy owner.
     * @param _coverLimit The maximum value to cover in **USD**.
     * @param _token The token to deposit.
     * @param _amount Amount of token to deposit.
     * @param _price The `SOLACE` price in wei(usd).
     * @param _priceDeadline The `SOLACE` price in wei(usd).
     * @param _signature The `SOLACE` price signature.
     * @return policyID The ID of the newly minted policy.
     */
     public async purchaseWithNonStable(
        _user: string,
        _coverLimit: BigNumberish,
        _token: string,
        _amount: BigNumberish,
        _price: BigNumberish,
        _priceDeadline: BigNumberish,
        _signature: utils.BytesLike,
        gasConfig?: GasConfiguration
    ): Promise<providers.TransactionResponse> {
        invariant(providers.JsonRpcSigner.isSigner(this.walletOrProviderOrSigner), "cannot execute mutator function without a signer")
        invariant(utils.isAddress(_user), "_user - not an Ethereum address")
        invariant(_user !== ZERO_ADDRESS, "_user - cannot enter zero address")
        invariant(utils.isAddress(_token), "_token - not an Ethereum address")
        invariant(_token !== ZERO_ADDRESS, "_token - cannot enter zero address")
        const tx: providers.TransactionResponse = await this.solaceCoverProduct.purchaseWithNonStable(_user, _coverLimit, _token, _amount, _price, _priceDeadline, _signature, {...gasConfig})
        return tx
    }

    /**
     * @notice Activates policy for provided _user.
     * @param _users Array of intended policy owners.
     * @param _coverLimits Array of intended maximum values to cover in **USD**.
     * @return policyID The ID of the newly minted policy.
     */
     public async purchase(
         _users: string[],
        _coverLimits: BigNumberish[],
        gasConfig?: GasConfiguration
    ): Promise<providers.TransactionResponse> {
        invariant(providers.JsonRpcSigner.isSigner(this.walletOrProviderOrSigner), "cannot execute mutator function without a signer")
        _users.forEach((user) => invariant(utils.isAddress(user), "not an Ethereum address"))
        _users.forEach((user) => invariant(user !== ZERO_ADDRESS, "cannot enter zero address"))
        const tx: providers.TransactionResponse = await this.solaceCoverProduct.purchase(_users, _coverLimits, {...gasConfig})
        return tx
    }

    /**
     * @notice Cancels the policy for `policyholder`.
     * @param _premium The premium amount to verify.
     * @param _policyholder The policyholder address.
     * @param _deadline The deadline for the signature.
     * @param _signature The premium data signature.
     */
     public async cancel(
        _premium: BigNumberish,
        _policyholder: string,
        _deadline: BigNumberish,
        _signature: utils.BytesLike,
        gasConfig?: GasConfiguration
    ): Promise<providers.TransactionResponse> {
        invariant(utils.isAddress(_policyholder), "not an Ethereum address")
        invariant(_policyholder !== ZERO_ADDRESS, "cannot enter zero address")
        invariant(providers.JsonRpcSigner.isSigner(this.walletOrProviderOrSigner), "cannot execute mutator function without a signer")
        const tx: providers.TransactionResponse = await this.solaceCoverProduct.cancel(_premium, _policyholder, _deadline, _signature, {...gasConfig})
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
     * @returns The total supply of policies (amount of policies that have been purchased, includes inactive policies).
     */
     public async totalSupply(): Promise<BN> {
        return (await this.solaceCoverProduct.totalSupply())
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
}