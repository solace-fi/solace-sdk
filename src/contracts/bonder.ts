import { BigNumber as BN, Contract, providers, Wallet, utils, getDefaultProvider, BigNumberish } from 'ethers'
const { getNetwork } = providers

import {
    BondTellerErc20_ABI,
    BondTellerEth_ABI,
    BondTellerMatic_ABI,
    BondTellerFtm_ABI,
} from "../"

import invariant from 'tiny-invariant'
import { BOND_TELLER_ADDRESSES, ZERO_ADDRESS, DEFAULT_ENDPOINT, foundNetwork } from '../constants'
import { BondTellerType, GasConfiguration } from '../types';
import { getProvider } from '../utils/ethers'

/*
 * Contains methods for accessing Solace bonding functionality (BondTellerErc20.sol, BondTellerEth.sol & BondTellerMatic.sol).
 * All blockchain mutating functions require a valid Ethereum private key (through a Signer object) to work.
 * All blockchain reading functions require only a Provider (to connect to and read the blockchain) to work.
 */
export class Bonder {
    /**************
    PROPERTIES
    **************/
    chainID: number;
    walletOrProviderOrSigner: Wallet | providers.JsonRpcSigner | providers.Provider;
    bondTellerContract: Contract;
    bondTellerType: BondTellerType

    /**************
    CONSTRUCTOR
    **************/

    /**
     * @param chainID The chainID for the Staker object, 1 for Ethereum Mainnet.
     * @param walletOrProviderOrSigner walletOrProviderOrSigner object - a Wallet (https://docs.ethers.io/v5/api/signer/#Wallet) or a Provider (https://docs.ethers.io/v5/api/providers/) or Signer (https://docs.ethers.io/v5/api/signer/)
     * @param bondTellerContractAddress string
     */
     constructor(chainID: number, bondTellerContractAddress: string, walletOrProviderOrSigner?: Wallet | providers.JsonRpcSigner | providers.Provider) {
        invariant(foundNetwork(chainID)?.features.general.bondingV2,"not a supported chainID")
        let storedType: BondTellerType = 'erc20'
        let found = false
        Object.keys(BOND_TELLER_ADDRESSES).forEach((key) => {
            if(BOND_TELLER_ADDRESSES[key][chainID] != undefined) {
                if(BOND_TELLER_ADDRESSES[key][chainID].addr.toLowerCase() == bondTellerContractAddress.toLowerCase()) {
                    storedType = BOND_TELLER_ADDRESSES[key][chainID].type
                    found = true
                }
            }
        })
        invariant(found, 'must provide valid bond teller contract address for this chain')


        if (typeof(walletOrProviderOrSigner) == 'undefined') {
            // ethers.js getDefaultProvider method doesn't work for MATIC or Mumbai
            // Use public RPC endpoints instead
            if (DEFAULT_ENDPOINT[chainID]) {
                this.walletOrProviderOrSigner = getProvider(DEFAULT_ENDPOINT[chainID])
            } else {
                this.walletOrProviderOrSigner = getDefaultProvider(getNetwork(chainID))
            }
        } else {
            this.walletOrProviderOrSigner = walletOrProviderOrSigner
        }

        if (String(storedType) === 'eth') {
            this.bondTellerContract = new Contract(bondTellerContractAddress, BondTellerEth_ABI, walletOrProviderOrSigner)
        } else if (String(storedType) === 'matic') {
            this.bondTellerContract = new Contract(bondTellerContractAddress, BondTellerMatic_ABI, walletOrProviderOrSigner)
        } else if (String(storedType) === 'ftm') {
            this.bondTellerContract = new Contract(bondTellerContractAddress, BondTellerFtm_ABI, walletOrProviderOrSigner)
        } else {
            this.bondTellerContract = new Contract(bondTellerContractAddress, BondTellerErc20_ABI, walletOrProviderOrSigner)
        }

        this.chainID = chainID;
        this.bondTellerType = storedType
    }

    /**************
    MUTATING HELPER FUNCTIONS
    **************/

    public async depositNative(
        deposit: BigNumberish,
        minAmountOut: BigNumberish,
        depositor: string,
        stake: boolean,
        gasConfig?: GasConfiguration
    ): Promise<providers.TransactionResponse> {
        switch(this.bondTellerType) {
            case 'matic':
                return await this.depositMatic(deposit, minAmountOut, depositor, stake, gasConfig)
            case 'ftm':
                return await this.depositFtm(deposit, minAmountOut, depositor, stake, gasConfig)
            case 'eth':
                default:
                return await this.depositEth(deposit, minAmountOut, depositor, stake, gasConfig)
        }
    }

    public async depositWrappedNative(
        deposit: BigNumberish,
        minAmountOut: BigNumberish,
        depositor: string,
        stake: boolean,
        gasConfig?: GasConfiguration
    ): Promise<providers.TransactionResponse> {
        switch(this.bondTellerType) {
            case 'matic':
                return await this.depositWmatic(deposit, minAmountOut, depositor, stake, gasConfig)
            case 'ftm':
                return await this.depositWftm(deposit, minAmountOut, depositor, stake, gasConfig)
            case 'eth':
                default:
                return await this.depositWeth(deposit, minAmountOut, depositor, stake, gasConfig)
        }
    }

    /********************************
    Common BondTeller View Functions
    ********************************/

    /**
     * @notice Calculate the current price of a bond. Assumes 1 SOLACE payout.
     * @return price_ The price of the bond measured in principal.
     */
     public async bondPrice(): Promise<BN> {
        return (await this.bondTellerContract.bondPrice())
    }

    /**
     * @notice Calculate the amount of SOLACE out for an amount of principal.
     * @param amountIn Amount of principal to deposit.
     * @param stake True to stake, false to not stake.
     * @return amountOut Amount of SOLACE out.
     */
     public async calculateAmountOut(amountIn: BigNumberish, stake: boolean): Promise<BN> {
        return (await this.bondTellerContract.calculateAmountOut(amountIn, stake))
    }

    /**
     * @notice Calculate the amount of SOLACE out for an amount of principal.
     * @param amountOut Amount of SOLACE out.
     * @param stake True to stake, false to not stake.
     * @return amountIn Amount of principal to deposit.
     */
     public async calculateAmountIn(amountOut: BigNumberish, stake: boolean): Promise<BN> {
        return (await this.bondTellerContract.calculateAmountIn(amountOut, stake))
    }

    /***********************************
    Common BondTeller Mutator Functions
    ***********************************/

    /**
     * @notice Claim payout for a bond that the user holds. 
     * @dev User calling `claimPayout()` must be either the owner or approved for the entered bondID.
     * @param bondID The ID of the bond to redeem.
     */
     public async claimPayout(
        bondID: BigNumberish,
        gasConfig?: GasConfiguration
    ): Promise<providers.TransactionResponse> {
        invariant(providers.JsonRpcSigner.isSigner(this.walletOrProviderOrSigner), "cannot execute mutator function without a signer")

        const tx: providers.TransactionResponse = await this.bondTellerContract.claimPayout(bondID, {...gasConfig})
        return tx
    }

    /*********************************
    BondTellerErc20 Mutator Functions
    *********************************/

    /**
     * @notice Create a bond by depositing amount of principal. Principal will be transferred from msg.sender using allowance.
     * @param deposit Amount of principal to deposit.
     * @param minAmountOut The minimum SOLACE out.
     * @param depositor The bond recipient, default msg.sender.
     * @param stake True to stake, false to not stake.
     */
     public async deposit(
        deposit: BigNumberish,
        minAmountOut: BigNumberish,
        depositor: string,
        stake: boolean,
        gasConfig?: GasConfiguration
    ): Promise<providers.TransactionResponse> {
        invariant(providers.JsonRpcSigner.isSigner(this.walletOrProviderOrSigner), "cannot execute mutator function without a signer")
        invariant(utils.isAddress(depositor), "not an Ethereum address")
        invariant(depositor != ZERO_ADDRESS, "cannot enter zero address policyholder")
        invariant(this.bondTellerType === 'erc20', "function only exists on BondTellerErc20")

        const tx: providers.TransactionResponse = await this.bondTellerContract.deposit(deposit, minAmountOut, depositor, stake, {...gasConfig})
        return tx
    }

    /**
     * @notice Create a bond by depositing amount of principal. Principal will be transferred from depositor using permit. 
     * @dev Note that not all ERC20s have a permit function, in which case this function will revert.
     * @param deposit Amount of principal to deposit.
     * @param minAmountOut The minimum SOLACE out.
     * @param depositor The bond recipient, default msg.sender.
     * @param stake True to stake, false to not stake.
     * @param deadline Time the transaction must go through before.
     * @param v secp256k1 signature
     * @param r secp256k1 signature
     * @param s secp256k1 signature
     */
     public async depositSigned(
        deposit: BigNumberish,
        minAmountOut: BigNumberish,
        depositor: string,
        stake: boolean,
        deadline: BigNumberish,
        v: utils.BytesLike,
        r: utils.BytesLike,
        s: utils.BytesLike,
        gasConfig?: GasConfiguration
    ): Promise<providers.TransactionResponse> {
        invariant(providers.JsonRpcSigner.isSigner(this.walletOrProviderOrSigner), "cannot execute mutator function without a signer")
        invariant(utils.isAddress(depositor), "not an Ethereum address")
        invariant(depositor != ZERO_ADDRESS, "cannot enter zero address policyholder")
        invariant(this.bondTellerType === 'erc20', "function only exists on BondTellerErc20")

        const tx: providers.TransactionResponse = await this.bondTellerContract.depositSigned(deposit, minAmountOut, depositor, stake, deadline, v, r, s, {...gasConfig})
        return tx
    }

    /*********************************
    BondTellerEth Mutator Functions
    *********************************/

    /**
     * @notice Create a bond by depositing ETH.
     * @param deposit Amount of ETH to deposit.
     * @param minAmountOut The minimum SOLACE out.
     * @param depositor The bond recipient, default msg.sender.
     * @param stake True to stake, false to not stake.
     */
     public async depositEth(
        deposit: BigNumberish,
        minAmountOut: BigNumberish,
        depositor: string,
        stake: boolean,
        gasConfig?: GasConfiguration
    ): Promise<providers.TransactionResponse> {
        invariant(providers.JsonRpcSigner.isSigner(this.walletOrProviderOrSigner), "cannot execute mutator function without a signer")
        invariant(utils.isAddress(depositor), "not an Ethereum address")
        invariant(depositor != ZERO_ADDRESS, "cannot enter zero address policyholder")
        invariant(this.bondTellerType === "eth", "function only exists on BondTellerEth")

        const tx: providers.TransactionResponse = await this.bondTellerContract.depositEth(minAmountOut, depositor, stake, {value: deposit, ...gasConfig})
        return tx
    }

    /**
     * @notice Create a bond by depositing amount of WETH. WETH will be transferred from msg.sender using allowance.
     * @param deposit Amount of WETH to deposit.
     * @param minAmountOut The minimum SOLACE out.
     * @param depositor The bond recipient, default msg.sender.
     * @param stake True to stake, false to not stake.
     */
     public async depositWeth(
        deposit: BigNumberish,
        minAmountOut: BigNumberish,
        depositor: string,
        stake: boolean,
        gasConfig?: GasConfiguration
    ): Promise<providers.TransactionResponse> {
        invariant(providers.JsonRpcSigner.isSigner(this.walletOrProviderOrSigner), "cannot execute mutator function without a signer")
        invariant(utils.isAddress(depositor), "not an Ethereum address")
        invariant(depositor != ZERO_ADDRESS, "cannot enter zero address policyholder")
        invariant(this.bondTellerType === "eth", "function only exists on BondTellerEth")


        const tx: providers.TransactionResponse = await this.bondTellerContract.depositWeth(deposit, minAmountOut, depositor, stake, {...gasConfig})
        return tx
    }

    /**
     * @notice Create a bond by depositing amount of WETH. WETH will be transferred from depositor using permit. 
     * @dev Note that not all WETHs have a permit function, in which case this function will revert.
     * @param deposit Amount of WETH to deposit.
     * @param minAmountOut The minimum SOLACE out.
     * @param depositor The bond recipient, default msg.sender.
     * @param stake True to stake, false to not stake.
     * @param deadline Time the transaction must go through before.
     * @param v secp256k1 signature
     * @param r secp256k1 signature
     * @param s secp256k1 signature
     */
     public async depositWethSigned(
        deposit: BigNumberish,
        minAmountOut: BigNumberish,
        depositor: string,
        stake: boolean,
        deadline: BigNumberish,
        v: utils.BytesLike,
        r: utils.BytesLike,
        s: utils.BytesLike,
        gasConfig?: GasConfiguration
    ): Promise<providers.TransactionResponse> {
        invariant(providers.JsonRpcSigner.isSigner(this.walletOrProviderOrSigner), "cannot execute mutator function without a signer")
        invariant(utils.isAddress(depositor), "not an Ethereum address")
        invariant(depositor != ZERO_ADDRESS, "cannot enter zero address policyholder")
        invariant(this.bondTellerType === "eth", "function only exists on BondTellerEth")

        const tx: providers.TransactionResponse = await this.bondTellerContract.depositWethSigned(deposit, minAmountOut, depositor, stake, deadline, v, r, s, {...gasConfig})
        return tx
    }

    /*********************************
    BondTellerMatic Mutator Functions
    *********************************/

    /**
     * @notice Create a bond by depositing MATIC.
     * @param deposit Amount of MATIC to deposit.
     * @param minAmountOut The minimum SOLACE out.
     * @param depositor The bond recipient, default msg.sender.
     * @param stake True to stake, false to not stake.
     */
     public async depositMatic(
        deposit: BigNumberish,
        minAmountOut: BigNumberish,
        depositor: string,
        stake: boolean,
        gasConfig?: GasConfiguration
    ): Promise<providers.TransactionResponse> {
        invariant(providers.JsonRpcSigner.isSigner(this.walletOrProviderOrSigner), "cannot execute mutator function without a signer")
        invariant(utils.isAddress(depositor), "not an Ethereum address")
        invariant(depositor != ZERO_ADDRESS, "cannot enter zero address policyholder")
        invariant(this.bondTellerType === "matic", "function only exists on BondTellerMatic")

        const tx: providers.TransactionResponse = await this.bondTellerContract.depositMatic(minAmountOut, depositor, stake, {value: deposit, ...gasConfig})
        return tx
    }

    /**
     * @notice Create a bond by depositing amount wMATIC. wMATIC will be transferred from msg.sender using allowance.
     * @param deposit Amount of WETH to deposit.
     * @param minAmountOut The minimum SOLACE out.
     * @param depositor The bond recipient, default msg.sender.
     * @param stake True to stake, false to not stake.
     */
     public async depositWmatic(
        deposit: BigNumberish,
        minAmountOut: BigNumberish,
        depositor: string,
        stake: boolean,
        gasConfig?: GasConfiguration
    ): Promise<providers.TransactionResponse> {
        invariant(providers.JsonRpcSigner.isSigner(this.walletOrProviderOrSigner), "cannot execute mutator function without a signer")
        invariant(utils.isAddress(depositor), "not an Ethereum address")
        invariant(depositor != ZERO_ADDRESS, "cannot enter zero address policyholder")
        invariant(this.bondTellerType === "matic", "function only exists on BondTellerMatic")


        const tx: providers.TransactionResponse = await this.bondTellerContract.depositWmatic(deposit, minAmountOut, depositor, stake, {...gasConfig})
        return tx
    }

    /**
     * @notice Create a bond by depositing amount wMATIC. wMATIC will be transferred from depositor using permit. 
     * @dev Note that not all wMATICs have a permit function, in which case this function will revert.
     * @param deposit Amount of WETH to deposit.
     * @param minAmountOut The minimum SOLACE out.
     * @param depositor The bond recipient, default msg.sender.
     * @param stake True to stake, false to not stake.
     * @param deadline Time the transaction must go through before.
     * @param v secp256k1 signature
     * @param r secp256k1 signature
     * @param s secp256k1 signature
     */
     public async depositWmaticSigned(
        deposit: BigNumberish,
        minAmountOut: BigNumberish,
        depositor: string,
        stake: boolean,
        deadline: BigNumberish,
        v: utils.BytesLike,
        r: utils.BytesLike,
        s: utils.BytesLike,
        gasConfig?: GasConfiguration
    ): Promise<providers.TransactionResponse> {
        invariant(providers.JsonRpcSigner.isSigner(this.walletOrProviderOrSigner), "cannot execute mutator function without a signer")
        invariant(utils.isAddress(depositor), "not an Ethereum address")
        invariant(depositor != ZERO_ADDRESS, "cannot enter zero address policyholder")
        invariant(this.bondTellerType === "matic", "function only exists on BondTellerMatic")

        const tx: providers.TransactionResponse = await this.bondTellerContract.depositWmaticSigned(deposit, minAmountOut, depositor, stake, deadline, v, r, s, {...gasConfig})
        return tx
    }

    /*********************************
    BondTellerFtm Mutator Functions
    *********************************/

    /**
     * @notice Create a bond by depositing FTM.
     * @param deposit Amount of FTM to deposit.
     * @param minAmountOut The minimum SOLACE out.
     * @param depositor The bond recipient, default msg.sender.
     * @param stake True to stake, false to not stake.
     */
     public async depositFtm(
        deposit: BigNumberish,
        minAmountOut: BigNumberish,
        depositor: string,
        stake: boolean,
        gasConfig?: GasConfiguration
    ): Promise<providers.TransactionResponse> {
        invariant(providers.JsonRpcSigner.isSigner(this.walletOrProviderOrSigner), "cannot execute mutator function without a signer")
        invariant(utils.isAddress(depositor), "not an Ethereum address")
        invariant(depositor != ZERO_ADDRESS, "cannot enter zero address policyholder")
        invariant(this.bondTellerType === "ftm", "function only exists on BondTellerFtm")

        const tx: providers.TransactionResponse = await this.bondTellerContract.depositFtm(minAmountOut, depositor, stake, {value: deposit, ...gasConfig})
        return tx
    }

    /**
     * @notice Create a bond by depositing amount wFTM. wFTM will be transferred from msg.sender using allowance.
     * @param deposit Amount of WETH to deposit.
     * @param minAmountOut The minimum SOLACE out.
     * @param depositor The bond recipient, default msg.sender.
     * @param stake True to stake, false to not stake.
     */
     public async depositWftm(
        deposit: BigNumberish,
        minAmountOut: BigNumberish,
        depositor: string,
        stake: boolean,
        gasConfig?: GasConfiguration
    ): Promise<providers.TransactionResponse> {
        invariant(providers.JsonRpcSigner.isSigner(this.walletOrProviderOrSigner), "cannot execute mutator function without a signer")
        invariant(utils.isAddress(depositor), "not an Ethereum address")
        invariant(depositor != ZERO_ADDRESS, "cannot enter zero address policyholder")
        invariant(this.bondTellerType === "ftm", "function only exists on BondTellerFtm")


        const tx: providers.TransactionResponse = await this.bondTellerContract.depositWftm(deposit, minAmountOut, depositor, stake, {...gasConfig})
        return tx
    }
}