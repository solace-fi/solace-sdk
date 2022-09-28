import { BigNumber as BN, providers, Wallet, Contract, getDefaultProvider, utils, BigNumberish } from 'ethers'
const { getNetwork } = providers
import invariant from 'tiny-invariant'
import { BribeController_ABI, DepositHelper_ABI, FluxMegaOracle_ABI, GaugeController_ABI, SolaceMegaOracle_ABI, UnderwritingEquity_ABI, UnderwritingLocker_ABI, UnderwritingLockVoting_ABI, UnderwritingPool_ABI } from "../"
import { BRIBE_CONTROLLER_ADDRESS, FLUX_MEGA_ORACLE_ADDRESS, GAUGE_CONTROLLER_ADDRESS, SOLACE_MEGA_ORACLE_ADDRESS, UNDERWRITING_EQUITY_ADDRESS, UNDERWRITING_LOCK_VOTING_ADDRESS, UNDERWRITING_LOCKER_ADDRESS, UNDERWRITING_POOL_ADDRESS, DEPOSIT_HELPER_ADDRESS, ZERO_ADDRESS, DEFAULT_ENDPOINT } from '../constants'
import { getProvider } from '../utils/ethers'
import { GasConfiguration } from '../types';

export class Native {
    chainID: number;
    walletOrProviderOrSigner: Wallet | providers.JsonRpcSigner | providers.Provider;
    bribeController: Contract;
    depositHelper: Contract;
    fluxMegaOracle: Contract;
    gaugeController: Contract;
    solaceMegaOracle: Contract;
    underwritingEquity: Contract;
    underwritingLocker: Contract;
    underwritingLockVoting: Contract;
    underwritingPool: Contract;

    // TO-DO add Fantom connection
    constructor(
        chainID: number, 
        walletOrProviderOrSigner?: Wallet | providers.JsonRpcSigner | providers.Provider
    ) {
        invariant(BRIBE_CONTROLLER_ADDRESS[chainID] !== '', 'not a supported chainID')
        this.chainID = chainID;

        if (typeof(walletOrProviderOrSigner) !== 'undefined') {
            this.walletOrProviderOrSigner = walletOrProviderOrSigner;
        } else {
            if (Object.keys(DEFAULT_ENDPOINT).includes(String(chainID))) {
                this.walletOrProviderOrSigner = getProvider(DEFAULT_ENDPOINT[chainID]);
            } else {
                this.walletOrProviderOrSigner = getDefaultProvider(getNetwork(chainID));
            }
        }

        this.bribeController = new Contract(
            BRIBE_CONTROLLER_ADDRESS[chainID], 
            BribeController_ABI, 
            this.walletOrProviderOrSigner,
        );

        this.depositHelper = new Contract(
            DEPOSIT_HELPER_ADDRESS[chainID], 
            DepositHelper_ABI, 
            this.walletOrProviderOrSigner,
        );
        
        this.fluxMegaOracle = new Contract(
            FLUX_MEGA_ORACLE_ADDRESS[chainID], 
            FluxMegaOracle_ABI, 
            this.walletOrProviderOrSigner,
        );

        this.gaugeController = new Contract(
            GAUGE_CONTROLLER_ADDRESS[chainID], 
            GaugeController_ABI, 
            this.walletOrProviderOrSigner,
        );

        this.solaceMegaOracle = new Contract(
            SOLACE_MEGA_ORACLE_ADDRESS[chainID], 
            SolaceMegaOracle_ABI, 
            this.walletOrProviderOrSigner,
        );

        this.underwritingEquity = new Contract(
            UNDERWRITING_EQUITY_ADDRESS[chainID], 
            UnderwritingEquity_ABI, 
            this.walletOrProviderOrSigner,
        );

        this.underwritingLocker = new Contract(
            UNDERWRITING_LOCKER_ADDRESS[chainID], 
            UnderwritingLocker_ABI, 
            this.walletOrProviderOrSigner,
        );

        this.underwritingLockVoting = new Contract(
            UNDERWRITING_LOCK_VOTING_ADDRESS[chainID], 
            UnderwritingLockVoting_ABI, 
            this.walletOrProviderOrSigner,
        );

        this.underwritingPool = new Contract(
            UNDERWRITING_POOL_ADDRESS[chainID], 
            UnderwritingPool_ABI, 
            this.walletOrProviderOrSigner,
        );
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
    //  public async getRefundableSOLACEAmount(
    //      depositor: string, 
    //      price: BigNumberish, 
    //      priceDeadline: BigNumberish, 
    //      signature: utils.BytesLike
    //      ): Promise<BN> {
    //     invariant(utils.isAddress(depositor), 'not an Ethereum address')
    //     invariant(depositor !== ZERO_ADDRESS, "cannot enter zero address")
    //     return (await this.coverPaymentManager.getRefundableSOLACEAmount(depositor, price, priceDeadline, signature))
    // }

    /**************************************************************
    METHODS - COVERPAYMENTMANAGER MUTATOR FUNCTION WRAPPERS
    **************************************************************/

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
    //  public async depositSignedStable(
    //     token: string,
    //     depositor: string,
    //     amount: BigNumberish,
    //     deadline: BigNumberish,
    //     v: BigNumberish,
    //     r: utils.BytesLike,
    //     s: utils.BytesLike,
    //     gasConfig?: GasConfiguration
    // ): Promise<providers.TransactionResponse> {
    //     invariant(providers.JsonRpcSigner.isSigner(this.walletOrProviderOrSigner), "cannot execute mutator function without a signer")
    //     invariant(utils.isAddress(token), 'not an Ethereum address')
    //     invariant(utils.isAddress(depositor), 'not an Ethereum address')
    //     invariant(token !== ZERO_ADDRESS, "cannot enter zero address for token")
    //     invariant(depositor !== ZERO_ADDRESS, "cannot enter zero address for recipient")
    //     const tx: providers.TransactionResponse = await this.coverPaymentManager.depositSignedStable(token, depositor, amount, deadline, v, r, s, {...gasConfig})
    //     return tx
    // }
}

