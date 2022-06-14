import { BigNumber as BN, providers, Wallet, Contract, getDefaultProvider, utils, BigNumberish } from 'ethers'
const { getNetwork } = providers
import invariant from 'tiny-invariant'

import {
    SolaceCoverProduct_ABI,
    SolaceCoverProductV2_ABI,
} from "../"

import { SOLACE_COVER_PRODUCT_ADDRESS, ZERO_ADDRESS, isNetworkSupported, DEFAULT_ENDPOINT, SOLACE_COVER_PRODUCT_V2_ADDRESS } from '../constants'
import { GasConfiguration } from '../types';
import { getProvider } from '../utils/ethers'

export class Coverage {
    chainID: number;
    walletOrProviderOrSigner: Wallet | providers.JsonRpcSigner | providers.Provider;
    solaceCoverProduct: Contract;

    constructor(chainID: number, walletOrProviderOrSigner?: Wallet | providers.JsonRpcSigner | providers.Provider) {
        invariant(SOLACE_COVER_PRODUCT_ADDRESS[chainID] || SOLACE_COVER_PRODUCT_V2_ADDRESS[chainID],"not a supported chainID")
        this.chainID = chainID;

        if (typeof(walletOrProviderOrSigner) == 'undefined') {
            
            if (DEFAULT_ENDPOINT[chainID]) {
                this.walletOrProviderOrSigner = getProvider(DEFAULT_ENDPOINT[chainID])
            } else {
                this.walletOrProviderOrSigner = getDefaultProvider(getNetwork(chainID))
            }
        } else {
            this.walletOrProviderOrSigner = walletOrProviderOrSigner
        }

        if (SOLACE_COVER_PRODUCT_V2_ADDRESS[chainID]) {
            this.solaceCoverProduct = new Contract(SOLACE_COVER_PRODUCT_V2_ADDRESS[chainID], SolaceCoverProductV2_ABI, this.walletOrProviderOrSigner)
        } else {
            this.solaceCoverProduct = new Contract(SOLACE_COVER_PRODUCT_ADDRESS[chainID], SolaceCoverProduct_ABI, this.walletOrProviderOrSigner)
        }
    }

    /*************************************************************
    METHODS - SOLACECOVERPRODUCT EXTERNAL MUTATOR FUNCTION WRAPPERS
    *************************************************************/
    
    /**
     * Activates policy for `policyholder`
     * @param policyholder The address of the intended policyholder.
     * @param coverLimit The maximum value to cover in **USD**.
     * @param amount The deposit amount in **USD** to fund the policyholder's account.
     * @param referralCode The referral code.
     * @param chains_ The chain ids.
     * @return policyID The ID of the newly minted policy.
     */
     public async activatePolicy(
        policyholder: string,
        coverLimit: BigNumberish,
        amount: BigNumberish,
        referralCode: utils.BytesLike,
        chains?: BigNumberish[],
        gasConfig?: GasConfiguration
    ): Promise<providers.TransactionResponse> {
        invariant(providers.JsonRpcSigner.isSigner(this.walletOrProviderOrSigner), "cannot execute mutator function without a signer")
        invariant(utils.isAddress(policyholder), "not an Ethereum address")
        invariant(policyholder != ZERO_ADDRESS, "cannot enter zero address policyholder")
        invariant(BN.from(coverLimit).gt(0), "cannot enter zero cover limit")
        
        if (typeof(chains) !== 'undefined') {
            for (let chain of chains) {
                invariant(isNetworkSupported(BN.from(chain).toNumber()),"not a supported chainID")
            }
        }

        let tx: providers.TransactionResponse

        if (SOLACE_COVER_PRODUCT_V2_ADDRESS[this.chainID]) {
            tx = await this.solaceCoverProduct.activatePolicy(policyholder, coverLimit, amount, referralCode, chains, {...gasConfig})
        } else {
            tx = await this.solaceCoverProduct.activatePolicy(policyholder, coverLimit, amount, referralCode, {...gasConfig})
        }

        return tx
    }

    /**
     * @notice Updates the cover limit of a user's policy.
     * @notice This will reset the cooldown.
     * @param newCoverLimit_ The new maximum value to cover in **USD**.
     * @param referralCode_ The referral code.
     */
    public async updateCoverLimit(
        newCoverLimit: BigNumberish,
        referralCode: utils.BytesLike,
        gasConfig?: GasConfiguration
    ): Promise<providers.TransactionResponse> {
        invariant(providers.JsonRpcSigner.isSigner(this.walletOrProviderOrSigner), "cannot execute mutator function without a signer")
        invariant(BN.from(newCoverLimit).gt(0), "cannot enter zero cover limit")
        const tx: providers.TransactionResponse = await this.solaceCoverProduct.updateCoverLimit(newCoverLimit, referralCode, {...gasConfig})
        return tx
    }

    /**
     * @notice Deposits funds into the `policyholder` account.
     * @param policyholder The policyholder.
     * @param amount The amount to deposit in **USD**.
     */
    public async deposit(
        policyholder: string,
        amount: BigNumberish,
        gasConfig?: GasConfiguration
    ): Promise<providers.TransactionResponse> {
        invariant(providers.JsonRpcSigner.isSigner(this.walletOrProviderOrSigner), "cannot execute mutator function without a signer")
        invariant(utils.isAddress(policyholder), "not an Ethereum address")
        invariant(policyholder != ZERO_ADDRESS, "cannot enter zero address policyholder")
        const tx: providers.TransactionResponse = await this.solaceCoverProduct.deposit(policyholder, amount, {...gasConfig})
        return tx
    }

    /**
     * Withdraw funds from user's account.
     * If cooldown has passed, the user will withdraw their entire account balance. 
     * If cooldown has not started, or has not passed, the user will not be able to withdraw their entire account. A minimum required account balance (one epoch's fee) will be left in the user's account.
     */
    public async withdraw(gasConfig?: GasConfiguration): Promise<providers.TransactionResponse> {
        invariant(providers.JsonRpcSigner.isSigner(this.walletOrProviderOrSigner), "cannot execute mutator function without a signer")
        const tx: providers.TransactionResponse = await this.solaceCoverProduct.withdraw({...gasConfig})
        return tx
    }

    /**
     * Deactivate a user's policy.
     * This will set a user's cover limit to 0, and begin the cooldown timer. Read comments for [`cooldownPeriod()`](#cooldownperiod) for more information on the cooldown mechanic.
     */
    public async deactivatePolicy(gasConfig?: GasConfiguration): Promise<providers.TransactionResponse> {
        invariant(providers.JsonRpcSigner.isSigner(this.walletOrProviderOrSigner), "cannot execute mutator function without a signer")
        const tx: providers.TransactionResponse = await this.solaceCoverProduct.deactivatePolicy({...gasConfig})
        return tx
    }

    /*************************************************************
    METHODS - SOLACECOVERPRODUCT EXTERNAL VIEW FUNCTION WRAPPERS
    *************************************************************/
     
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
     * @returns The policy count (amount of policies that have been purchased, includes inactive policies).
     */
    public async policyCount(): Promise<BN> {
        return (await this.solaceCoverProduct.policyCount())
    }

    /**
     * @param policyholder The policyholder address.
     * @returns The policyholder's account balance in **USD**.
     */
    public async accountBalanceOf(policyholder: string): Promise<BN> {
        invariant(utils.isAddress(policyholder), 'not an Ethereum address')
        return (await this.solaceCoverProduct.accountBalanceOf(policyholder))
    }

    /**
     * @param policyID The policy ID.
     * @returns The cover limit for the given policy ID.
     */
    public async coverLimitOf(policyID: BigNumberish): Promise<BN> {
        return (await this.solaceCoverProduct.coverLimitOf(policyID))
    }

    /**
     * @param coverLimit Cover limit.
     * @returns The minimum required account balance for a given cover limit. Equals the maximum chargeable fee for one epoch.
     */
    public async minRequiredAccountBalance(coverLimit: BN): Promise<BN> {
        return (await this.solaceCoverProduct.minRequiredAccountBalance(coverLimit))
    }

    /**
     * @param policyID The policy ID.
     * @returns True if policy is active. False if policy is inactive, or does not exist.
     */
    public async policyStatus(policyID: BigNumberish): Promise<boolean> {
        return (await this.solaceCoverProduct.policyStatus(policyID))
    }

    /**
     * @param policyID The policy ID.
     * @returns The policy chain information
     */
    public async getPolicyChainInfo(policyID: BigNumberish): Promise<boolean> {
        invariant(SOLACE_COVER_PRODUCT_V2_ADDRESS[this.chainID], 'cannot call this function for this chainId')
        return (await this.solaceCoverProduct.getPolicyChainInfo(policyID))
    }

        /**
     * @param policyID The policy ID.
     * @returns The chain at the given index
     */
    public async getChain(chainIndex: BigNumberish): Promise<boolean> {
        invariant(SOLACE_COVER_PRODUCT_V2_ADDRESS[this.chainID], 'cannot call this function for this chainId')
        return (await this.solaceCoverProduct.getChain(chainIndex))
    }

            /**
     * @param policyID The policy ID.
     * @returns The number of supported chains
     */
    public async numSupportedChains(): Promise<boolean> {
        invariant(SOLACE_COVER_PRODUCT_V2_ADDRESS[this.chainID], 'cannot call this function for this chainId')
        return (await this.solaceCoverProduct.numSupportedChains())
    }

    /**
     * TO-DO Decide if need to decode return value from BN hex.
     * @param policyholder The policyholder address.
     * @returns policyID The policy ID.
     */
    public async policyOf(policyholder: string): Promise<BN> {
        invariant(utils.isAddress(policyholder), 'not an Ethereum address')
        return (await this.solaceCoverProduct.policyOf(policyholder))
    }

    /**
     * @param policyholder The policyholder address.
     * @returns The reward points for the policyholder.
     */
    public async rewardPointsOf(policyholder: string): Promise<BN> {
        invariant(utils.isAddress(policyholder), 'not an Ethereum address')
        return (await this.solaceCoverProduct.rewardPointsOf(policyholder))
    }

    /**
     * @param policyholder The policyholder address.
     * @returns The total premium paid for the policyholder.
     */
    public async premiumsPaidOf(policyholder: string): Promise<BN> {
        invariant(utils.isAddress(policyholder), 'not an Ethereum address')
        return (await this.solaceCoverProduct.premiumsPaidOf(policyholder))
    }

    /**
     * @param policyholder The policyholder address.
     * @returns The cooldown period start expressed as Unix timestamp
     */
     public async cooldownStart(policyholder: string): Promise<BN> {
        invariant(utils.isAddress(policyholder), 'not an Ethereum address')
        return (await this.solaceCoverProduct.cooldownStart(policyholder))
    }

    /**
     * @param policyholder The policyholder address.
     * @returns True if the policyholder has previously used a valid referral code, false if not.
     */
    public async isReferralCodeUsed(policyholder: string): Promise<boolean> {
        invariant(utils.isAddress(policyholder), 'not an Ethereum address')
        return (await this.solaceCoverProduct.isReferralCodeUsed(policyholder))
    }

    /**
     * @param referralCode The referral code.
     * @returns The referrer address, returns 0 address if invalid referral code.
     */
    public async getReferrerFromReferralCode(referralCode: utils.BytesLike): Promise<string> {
        return (await this.solaceCoverProduct.getReferrerFromReferralCode(referralCode))
    }

    /**
     * @param referralCode The referral code.
     * @returns True if valid referral code, false otherwise.
     */
    public async isReferralCodeValid(referralCode: utils.BytesLike): Promise<boolean> {
        return (await this.solaceCoverProduct.isReferralCodeValid(referralCode))
    }

    /**
     * Generates a referral code for the given Signer (dependent on private key).
     * @returns 65-byte (or 130 hex-character) referral code.
     * Note that this is an Ethereum ECDSA signature.
     * 
     * Note Ledger generated signatures appear to have an issue where the last 2 characters (or 1 byte) of the signature is '00' or '01'.
     * Valid Ethereum ECDSA signatures have the last 2 characters as '0b' or '0c'. This is the v part of the signature.
     * To fix this issue, if the last two characters of the signature are '00', replace with '0b'.
     * If the last two characters of the signature are '01', replace with '0c'.
     */
    public async getReferralCode(): Promise<string> {
        invariant(providers.JsonRpcSigner.isSigner(this.walletOrProviderOrSigner), "cannot get referral code without a signer")
        
        let domain, value;

        const types = {
            SolaceReferral: [
                { name: "version", type: "uint256" }
              ]
        };   

        // Wanted to use switch (chainId) but Typescript made the type of `chainId: 1` instead of `chainId: number`
        switch (true) {
            case SOLACE_COVER_PRODUCT_ADDRESS[this.chainID] != undefined : {
                domain = {
                    name: "Solace.fi-SolaceCoverProduct",
                    version: "1",
                    chainId: this.chainID,
                    verifyingContract: SOLACE_COVER_PRODUCT_ADDRESS[this.chainID]
                };

                value = {
                    version: 1
                };   

                break;
            }

            case SOLACE_COVER_PRODUCT_V2_ADDRESS[this.chainID] != undefined: 
            default: {
                domain = {
                    name: "Solace.fi-SolaceCoverProductV2",
                    version: "2",
                    chainId: this.chainID,
                    verifyingContract: SOLACE_COVER_PRODUCT_V2_ADDRESS[this.chainID]
                };   

                value = {
                    version: 2
                };   

                break;
            }
        }
        
        const signature = await this.walletOrProviderOrSigner._signTypedData(domain, types, value)
    
        return signature
    }
}