import { BigNumber as BN, Contract, providers, Wallet, utils } from 'ethers'
import SolaceCoverProduct from "./abis/SolaceCoverProduct.json"
import invariant from 'tiny-invariant'
import { SOLACE_COVER_PRODUCT_ADDRESS, ZERO_ADDRESS } from './constants'

/*
 * Contains methods for accessing policyholder mutator functions in SolaceCoverProduct.sol.
 * Also contains off-chain getReferralCode method.
 * All methods in the Policyholder class require a valid Ethereum private key (through a Signer object) to work.
 */
export class Policyholder {
    /**************
    PROPERTIES
    **************/
    chainID: number;
    signer: Wallet | providers.JsonRpcSigner;
    solaceCoverProduct: Contract;

    /**************
    CONSTRUCTOR
    **************/

    // It is up to the user to decide how to create the signer, whether that is a Wallet or JsonRpcSigner entity
    /**
     * @param chainID The chainID for the Policyholder object, 1 for Ethereum Mainnet.
     * @param signer Signer object - https://docs.ethers.io/v5/api/signer/
     * Either a Wallet (custom script with provided private key) or JsonRpcSigner (for Metamask integration) entity can be provided.
     */
    constructor(chainID: number, signer: Wallet | providers.JsonRpcSigner) {
        this.chainID = chainID;
        this.signer = signer;
        this.solaceCoverProduct = new Contract(SOLACE_COVER_PRODUCT_ADDRESS[chainID], SolaceCoverProduct, signer)
    }

    /**************
    METHODS
    **************/
    
    /**
     * Activates policy for `policyholder`
     * @param policyholder The address of the intended policyholder.
     * @param coverLimit The maximum value to cover in **USD**.
     * @param amount The deposit amount in **USD** to fund the policyholder's account.
     * @param referralCode The referral code.
     * @return policyID The ID of the newly minted policy.
     */
    public async activatePolicy(
        policyholder: string,
        coverLimit: BN,
        amount: BN,
        referralCode: utils.BytesLike
    ): Promise<BN> {
        invariant(utils.isAddress(policyholder), "not an Ethereum address")
        invariant(policyholder == ZERO_ADDRESS, "cannot enter zero address policyholder")
        invariant(coverLimit.gt(0), "cannot enter zero cover limit")

        // require(!policyStatus(policyID), "policy already activated");
        // require(_canPurchaseNewCover(0, coverLimit_), "insufficient capacity for new cover");
        // require(IERC20(_getAsset()).balanceOf(msg.sender) >= amount_, "insufficient caller balance for deposit");
        // require(amount_ + accountBalanceOf(policyholder_) > _minRequiredAccountBalance(coverLimit_), "insufficient deposit for minimum required account balance");

        return (await this.solaceCoverProduct.activatePolicy(policyholder, coverLimit, amount, referralCode))
    }

    /**
     * @notice Updates the cover limit of a user's policy.
     * @notice This will reset the cooldown.
     * @param newCoverLimit_ The new maximum value to cover in **USD**.
     * @param referralCode_ The referral code.
     */
    public async updateCoverLimit(
        newCoverLimit: BN,
        referralCode: utils.BytesLike
    ) {
        invariant(newCoverLimit.gt(0), "cannot enter zero cover limit")
        await this.solaceCoverProduct.updateCoverLimit(newCoverLimit, referralCode)
    }

    /**
     * @notice Deposits funds into the `policyholder` account.
     * @param policyholder The policyholder.
     * @param amount The amount to deposit in **USD**.
     */
    public async deposit(
        policyholder: string,
        amount: BN
    ) {
        invariant(utils.isAddress(policyholder), "not an Ethereum address")
        invariant(policyholder == ZERO_ADDRESS, "cannot enter zero address policyholder")
        await this.solaceCoverProduct.deposit(policyholder, amount)
    }

    /**
     * Withdraw funds from user's account.
     * If cooldown has passed, the user will withdraw their entire account balance. 
     * If cooldown has not started, or has not passed, the user will not be able to withdraw their entire account. A minimum required account balance (one epoch's fee) will be left in the user's account.
     */
    public async withdraw() {
        await this.solaceCoverProduct.withdraw()
    }

    /**
     * Deactivate a user's policy.
     * This will set a user's cover limit to 0, and begin the cooldown timer. Read comments for [`cooldownPeriod()`](#cooldownperiod) for more information on the cooldown mechanic.
     */
    public async deactivatePolicy() {
        await this.solaceCoverProduct.deactivatePolicy()
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
        const domain = {
            name: "Solace.fi-SolaceCoverProduct",
            version: "1",
            chainId: await this.signer.getChainId(),
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

        const signature = await this.signer._signTypedData(domain, types, value)
        return signature
    }
}