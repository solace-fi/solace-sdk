import { BigNumber as BN, providers, Wallet, Contract, getDefaultProvider, utils, BigNumberish } from 'ethers'
const { getNetwork } = providers
import invariant from 'tiny-invariant'
import SCP_ABI from "../abis/SCP.json"
import CoverPaymentManager from "../abis/CoverPaymentManager.json"
import { COVERAGE_SCP_ADDRESS, COVER_PAYMENT_MANAGER_ADDRESS, ZERO_ADDRESS, DEFAULT_ENDPOINT } from '../constants'
import { getProvider } from '../utils/ethers'
import { GasConfiguration } from '../types';

export class SCP {
    chainID: number;
    walletOrProviderOrSigner: Wallet | providers.JsonRpcSigner | providers.Provider;
    scp: Contract;
    coverPaymentManager: Contract;

    // TO-DO add Fantom connection
    constructor(chainID: number, walletOrProviderOrSigner?: Wallet | providers.JsonRpcSigner | providers.Provider) {
        invariant(COVERAGE_SCP_ADDRESS[chainID],"not a supported chainID")
        this.chainID = chainID;

        if (typeof(walletOrProviderOrSigner) == 'undefined') {
            if(DEFAULT_ENDPOINT[chainID]) {
                this.walletOrProviderOrSigner = getProvider(DEFAULT_ENDPOINT[chainID])
            }
            else {
                this.walletOrProviderOrSigner = getDefaultProvider(getNetwork(chainID))
            }
        } else {
            this.walletOrProviderOrSigner = walletOrProviderOrSigner
        }

        this.scp = new Contract(COVERAGE_SCP_ADDRESS[chainID], SCP_ABI, this.walletOrProviderOrSigner)
        this.coverPaymentManager = new Contract(COVER_PAYMENT_MANAGER_ADDRESS[chainID], CoverPaymentManager, this.walletOrProviderOrSigner)
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

    /**************************************************************
    METHODS - COVERPAYMENTMANAGER EXTERNAL VIEW FUNCTION WRAPPERS
    **************************************************************/

    /**
     * @notice Calculates the refundable `SOLACE` amount.
     * @param depositor The owner of funds.
     * @param price The `SOLACE` price in wei(usd).
     * @param priceDeadline The `SOLACE` price in wei(usd).
     * @param signature The `SOLACE` price signature.
     * @return solaceAmount
     *
    */
     public async getRefundableSOLACEAmount(
         depositor: string, 
         price: BigNumberish, 
         priceDeadline: BigNumberish, 
         signature: utils.BytesLike
         ): Promise<BN> {
        invariant(utils.isAddress(depositor), 'not an Ethereum address')
        invariant(depositor !== ZERO_ADDRESS, "cannot enter zero address")
        return (await this.coverPaymentManager.getRefundableSOLACEAmount(depositor, price, priceDeadline, signature))
    }

    /**************************************************************
    METHODS - COVERPAYMENTMANAGER MUTATOR FUNCTION WRAPPERS
    **************************************************************/

    /**
     * @notice Deposits tokens from given address and credits them to recipient.
     * @param token The token to deposit.
     * @param from The depositor of the token.
     * @param recipient The recipient of Solace Cover Points.
     * @param amount Amount of token to deposit.
     */
     public async depositStableFrom(
        token: string,
        from: string,
        recipient: string,
        amount: BigNumberish,
        gasConfig?: GasConfiguration
    ): Promise<providers.TransactionResponse> {
        invariant(providers.JsonRpcSigner.isSigner(this.walletOrProviderOrSigner), "cannot execute mutator function without a signer")
        invariant(utils.isAddress(token), 'not an Ethereum address')
        invariant(utils.isAddress(recipient), 'not an Ethereum address')
        invariant(token !== ZERO_ADDRESS, "cannot enter zero address for token")
        invariant(recipient !== ZERO_ADDRESS, "cannot enter zero address for recipient")
        const tx: providers.TransactionResponse = await this.coverPaymentManager.depositStableFrom(token, from, recipient, amount, {...gasConfig})
        return tx
    }

    /**
     * @notice Deposits tokens from msg.sender and credits them to recipient.
     * @param token The token to deposit.
     * @param recipient The recipient of Solace Cover Points.
     * @param amount Amount of token to deposit.
     */
     public async depositStable(
        token: string,
        recipient: string,
        amount: BigNumberish,
        gasConfig?: GasConfiguration
    ): Promise<providers.TransactionResponse> {
        invariant(providers.JsonRpcSigner.isSigner(this.walletOrProviderOrSigner), "cannot execute mutator function without a signer")
        invariant(utils.isAddress(token), 'not an Ethereum address')
        invariant(utils.isAddress(recipient), 'not an Ethereum address')
        invariant(token !== ZERO_ADDRESS, "cannot enter zero address for token")
        invariant(recipient !== ZERO_ADDRESS, "cannot enter zero address for recipient")
        const tx: providers.TransactionResponse = await this.coverPaymentManager.depositStable(token, recipient, amount, {...gasConfig})
        return tx
    }

    /**
     * @notice Deposits tokens from depositor using permit.
     * @param token The token to deposit.
     * @param depositor The depositor and recipient of Solace Cover Points.
     * @param amount Amount of token to deposit.
     * @param deadline Time the transaction must go through before.
     * @param v secp256k1 signature
     * @param r secp256k1 signature
     * @param s secp256k1 signature
     */
     public async depositSignedStable(
        token: string,
        depositor: string,
        amount: BigNumberish,
        deadline: BigNumberish,
        v: BigNumberish,
        r: utils.BytesLike,
        s: utils.BytesLike,
        gasConfig?: GasConfiguration
    ): Promise<providers.TransactionResponse> {
        invariant(providers.JsonRpcSigner.isSigner(this.walletOrProviderOrSigner), "cannot execute mutator function without a signer")
        invariant(utils.isAddress(token), 'not an Ethereum address')
        invariant(utils.isAddress(depositor), 'not an Ethereum address')
        invariant(token !== ZERO_ADDRESS, "cannot enter zero address for token")
        invariant(depositor !== ZERO_ADDRESS, "cannot enter zero address for recipient")
        const tx: providers.TransactionResponse = await this.coverPaymentManager.depositSignedStable(token, depositor, amount, deadline, v, r, s, {...gasConfig})
        return tx
    }

    /**
     * @notice Deposits tokens from 'from' and credits them to recipient.
     * @param token The token to deposit.
     * @param from The depositor of the token.
     * @param recipient The recipient of Solace Cover Points.
     * @param amount Amount of token to deposit.
     * @param price The `SOLACE` price in wei(usd).
     * @param priceDeadline The `SOLACE` price in wei(usd).
     * @param signature The `SOLACE` price signature.
     */
    public async depositNonStableFrom(
        token: string,
        from: string,
        recipient: string,
        amount: BigNumberish,
        price: BigNumberish,
        priceDeadline: BigNumberish,
        signature: utils.BytesLike,
        gasConfig?: GasConfiguration
    ): Promise<providers.TransactionResponse> {
        invariant(providers.JsonRpcSigner.isSigner(this.walletOrProviderOrSigner), "cannot execute mutator function without a signer")
        invariant(utils.isAddress(token), 'not an Ethereum address')
        invariant(utils.isAddress(recipient), 'not an Ethereum address')
        invariant(token !== ZERO_ADDRESS, "cannot enter zero address for token")
        invariant(recipient !== ZERO_ADDRESS, "cannot enter zero address for recipient")
        const tx: providers.TransactionResponse = await this.coverPaymentManager.depositNonStableFrom(token, from, recipient, amount, price, priceDeadline, signature, {...gasConfig})
        return tx
    }

    /**
     * @notice Deposits tokens from msg.sender and credits them to recipient.
     * @param token The token to deposit.
     * @param recipient The recipient of Solace Cover Points.
     * @param amount Amount of token to deposit.
     * @param price The `SOLACE` price in wei(usd).
     * @param priceDeadline The `SOLACE` price in wei(usd).
     * @param signature The `SOLACE` price signature.
     */
    public async depositNonStable(
        token: string,
        recipient: string,
        amount: BigNumberish,
        price: BigNumberish,
        priceDeadline: BigNumberish,
        signature: utils.BytesLike,
        gasConfig?: GasConfiguration
    ): Promise<providers.TransactionResponse> {
        invariant(providers.JsonRpcSigner.isSigner(this.walletOrProviderOrSigner), "cannot execute mutator function without a signer")
        invariant(utils.isAddress(token), 'not an Ethereum address')
        invariant(utils.isAddress(recipient), 'not an Ethereum address')
        invariant(token !== ZERO_ADDRESS, "cannot enter zero address for token")
        invariant(recipient !== ZERO_ADDRESS, "cannot enter zero address for recipient")
        const tx: providers.TransactionResponse = await this.coverPaymentManager.depositNonStable(token, recipient, amount, price, priceDeadline, signature, {...gasConfig})
        return tx
    }

    /**
     * @notice Withdraws some of the user's deposit and sends it to `recipient`.
     * User must have deposited `SOLACE` in at least that amount in the past.
     * User must have sufficient Solace Cover Points to withdraw.
     * Token must be refundable.
     * Premium pool must have the tokens to return.
     * @param amount The amount of to withdraw.
     * @param recipient The receiver of funds.
     * @param price The `SOLACE` price in wei(usd).
     * @param priceDeadline The `SOLACE` price in wei(usd).
     * @param signature The `SOLACE` price signature.
     */
     public async withdraw(
        amount: BigNumberish,
        recipient: string,
        price: BigNumberish,
        priceDeadline: BigNumberish,
        signature: utils.BytesLike,
        gasConfig?: GasConfiguration
    ): Promise<providers.TransactionResponse> {
        invariant(providers.JsonRpcSigner.isSigner(this.walletOrProviderOrSigner), "cannot execute mutator function without a signer")
        invariant(utils.isAddress(recipient), 'not an Ethereum address')
        invariant(recipient !== ZERO_ADDRESS, "cannot enter zero address for recipient")
        const tx: providers.TransactionResponse = await this.coverPaymentManager.withdraw(amount, recipient, price, priceDeadline, signature, {...gasConfig})
        return tx
    }
}