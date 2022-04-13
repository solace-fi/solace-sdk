import { BigNumber as BN, providers, Wallet, Contract, getDefaultProvider, utils } from 'ethers'
const { getNetwork } = providers
import invariant from 'tiny-invariant'
import SolaceCoverProduct from "../abis/SolaceCoverProduct.json"
import SolaceCoverProductV2 from "../abis/SolaceCoverProductV2.json"
import { SOLACE_COVER_PRODUCT_ADDRESS, ZERO_ADDRESS, isNetworkSupported } from '../constants'
import { GasConfiguration } from '../types';
import { getProvider } from '../utils/ethers'

export class Coverage {
    chainID: number;
    walletOrProviderOrSigner: Wallet | providers.JsonRpcSigner | providers.Provider;
    solaceCoverProduct: Contract;

    constructor(chainID: number, walletOrProviderOrSigner?: Wallet | providers.JsonRpcSigner | providers.Provider) {
        invariant(isNetworkSupported(chainID),"not a supported chainID")
        this.chainID = chainID;

        if (typeof(walletOrProviderOrSigner) == 'undefined') {
            // ethers.js getDefaultProvider method doesn't work for MATIC or Mumbai
            // Use public RPC endpoints instead
            if (chainID == 137) {
                this.walletOrProviderOrSigner = getProvider("https://polygon-rpc.com")
            } else if (chainID == 80001) {
                this.walletOrProviderOrSigner = getProvider("https://matic-mumbai.chainstacklabs.com")
            } else if (chainID == 1313161554) {
                this.walletOrProviderOrSigner = getProvider("https://mainnet.aurora.dev")
            } else {
                this.walletOrProviderOrSigner = getDefaultProvider(getNetwork(chainID))
            }
        } else {
            this.walletOrProviderOrSigner = walletOrProviderOrSigner
        }

        if (chainID == 137 || 80001) {
            // SolaceCoverProductV2 deployed on Polygon mainnet (137) and Mumbai (80001)
            this.solaceCoverProduct = new Contract(SOLACE_COVER_PRODUCT_ADDRESS[chainID], SolaceCoverProductV2, this.walletOrProviderOrSigner)
        } else {
            this.solaceCoverProduct = new Contract(SOLACE_COVER_PRODUCT_ADDRESS[chainID], SolaceCoverProduct, this.walletOrProviderOrSigner)
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
        coverLimit: BN,
        amount: BN,
        referralCode: utils.BytesLike,
        chains?: number[],
        gasConfig?: GasConfiguration
    ): Promise<providers.TransactionResponse> {
        invariant(providers.JsonRpcSigner.isSigner(this.walletOrProviderOrSigner), "cannot execute mutator function without a signer")
        invariant(utils.isAddress(policyholder), "not an Ethereum address")
        invariant(policyholder != ZERO_ADDRESS, "cannot enter zero address policyholder")
        invariant(coverLimit.gt(0), "cannot enter zero cover limit")
        
        if (typeof(chains) !== 'undefined') {
            for (let chain of chains) {
                invariant(isNetworkSupported(chain),"not a supported chainID")
            }
        }

        let tx: providers.TransactionResponse

        if (this.chainID == 137 || 80001) {
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
        newCoverLimit: BN,
        referralCode: utils.BytesLike,
        gasConfig?: GasConfiguration
    ): Promise<providers.TransactionResponse> {
        invariant(providers.JsonRpcSigner.isSigner(this.walletOrProviderOrSigner), "cannot execute mutator function without a signer")
        invariant(newCoverLimit.gt(0), "cannot enter zero cover limit")
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
        amount: BN,
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
     * TO-DO Decide if need to decode return value from BN hex.
     * @returns The active cover limit in **USD** to 18 decimal places. In other words, the total cover that has been sold at the current time.
     */
     public async activeCoverLimit(): Promise<BN> {
        return (await this.solaceCoverProduct.activeCoverLimit())
    }

    /**
     * TO-DO Decide if need to decode return value from BN hex.
     * @returns The amount of available remaining capacity for new cover.
     */
    public async availableCoverCapacity(): Promise<BN> {
        return (await this.solaceCoverProduct.availableCoverCapacity())
    }

    /**
     * TO-DO Decide if need to decode return value from BN hex.
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
     * TO-DO Decide if need to decode return value from BN hex.
     * @param policyholder The policyholder address.
     * @returns The policyholder's account balance in **USD**.
     */
    public async accountBalanceOf(policyholder: string): Promise<BN> {
        invariant(utils.isAddress(policyholder), 'not an Ethereum address')
        return (await this.solaceCoverProduct.accountBalanceOf(policyholder))
    }

    /**
     * TO-DO Decide if need to decode return value from BN hex.
     * @param policyID The policy ID.
     * @returns The cover limit for the given policy ID.
     */
    public async coverLimitOf(policyID: number): Promise<BN> {
        return (await this.solaceCoverProduct.coverLimitOf(policyID))
    }

    /**
     * TO-DO Decide if need to decode return value from BN hex.
     * @param coverLimit Cover limit.
     * @returns The minimum required account balance for a given cover limit. Equals the maximum chargeable fee for one epoch.
     */
    public async minRequiredAccountBalance(coverLimit: BN): Promise<BN> {
        return (await this.solaceCoverProduct.minRequiredAccountBalance(coverLimit))
    }

    /**
     * TO-DO Decide if need to decode return value from BN hex.
     * @param policyID The policy ID.
     * @returns True if policy is active. False if policy is inactive, or does not exist.
     */
    public async policyStatus(policyID: number): Promise<boolean> {
        return (await this.solaceCoverProduct.policyStatus(policyID))
    }

    /**
     * TO-DO Decide if need to decode return value from BN hex.
     * @param policyID The policy ID.
     * @returns Array of chainIDs that the policy has been purchased for
     */
    public async getPolicyChainInfo(policyID: number): Promise<boolean> {
        return (await this.solaceCoverProduct.getPolicyChainInfo(policyID))
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
     * TO-DO Decide if need to decode return value from BN hex.
     * @param policyholder The policyholder address.
     * @returns The reward points for the policyholder.
     */
    public async rewardPointsOf(policyholder: string): Promise<BN> {
        invariant(utils.isAddress(policyholder), 'not an Ethereum address')
        return (await this.solaceCoverProduct.rewardPointsOf(policyholder))
    }

    /**
     * TO-DO Decide if need to decode return value from BN hex.
     * @param policyholder The policyholder address.
     * @returns The total premium paid for the policyholder.
     */
    public async premiumsPaidOf(policyholder: string): Promise<BN> {
        invariant(utils.isAddress(policyholder), 'not an Ethereum address')
        return (await this.solaceCoverProduct.premiumsPaidOf(policyholder))
    }

    /**
     * TO-DO Decide if need to decode return value from BN hex.
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
            const domain = {
                name: "Solace.fi-SolaceCoverProduct",
                version: "1",
                chainId: await this.walletOrProviderOrSigner.getChainId(),
                verifyingContract: SOLACE_COVER_PRODUCT_ADDRESS[this.chainID]
            };
    
            const types = {
                SolaceReferral: [
                    { name: "version", type: "uint256" }
                  ]
            };
    
            const value = {
                version: 1
            };
    
            const signature = await this.walletOrProviderOrSigner._signTypedData(domain, types, value)
            return signature
        }
}