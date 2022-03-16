import { BigNumber as BN, Contract, providers, Wallet, utils } from 'ethers'
import BondTellerErc20 from "./abis/BondTellerErc20.json"
import BondTellerEth from "./abis/BondTellerEth.json"
import BondTellerMatic from "./abis/BondTellerMatic.json"
import invariant from 'tiny-invariant'
import { BOND_TELLER_ADDRESSES, ZERO_ADDRESS, isNetworkSupported } from './constants'
import { GasConfiguration } from './types';

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
    providerOrSigner: Wallet | providers.JsonRpcSigner | providers.Provider;
    bondTeller: Contract;
    token: string;

    /**************
    CONSTRUCTOR
    **************/

    /**
     * @param chainID The chainID for the Staker object, 1 for Ethereum Mainnet.
     * @param providerOrSigner providerOrSigner object - either a Provider (https://docs.ethers.io/v5/api/providers/) or Signer (https://docs.ethers.io/v5/api/signer/)
     * @param token string (can be lowercase, uppercase or mixed) describing token for bond purchases. See documentation for supported tokens.
     */
     constructor(chainID: number, providerOrSigner: Wallet | providers.JsonRpcSigner | providers.Provider, token: string) {
        invariant(isNetworkSupported(chainID),"not a supported chainID")
        invariant( BOND_TELLER_ADDRESSES.hasOwnProperty(token.toLowerCase()), "not a supported token for bonds" )
        invariant ( BOND_TELLER_ADDRESSES[token][chainID] !== undefined, "not a supported token for bonds on this chainid" )
        
        this.chainID = chainID;
        this.providerOrSigner = providerOrSigner;
        this.token = token;

        if (token.toLowerCase() === "eth") {
            this.bondTeller = new Contract(BOND_TELLER_ADDRESSES[token][chainID], BondTellerEth, providerOrSigner)
        } else if (token.toLowerCase() === "matic") {
            this.bondTeller = new Contract(BOND_TELLER_ADDRESSES[token][chainID], BondTellerMatic, providerOrSigner)
        } else {
            this.bondTeller = new Contract(BOND_TELLER_ADDRESSES[token][chainID], BondTellerErc20, providerOrSigner)
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
        return (await this.bondTeller.bondPrice())
    }

    /**
     * @notice Calculate the amount of SOLACE out for an amount of principal.
     * @param amountIn Amount of principal to deposit.
     * @param stake True to stake, false to not stake.
     * @return amountOut Amount of SOLACE out.
     */
     public async calculateAmountOut(amountIn: BN, stake: boolean): Promise<BN> {
        return (await this.bondTeller.calculateAmountOut(amountIn, stake))
    }

    /**
     * @notice Calculate the amount of SOLACE out for an amount of principal.
     * @param amountOut Amount of SOLACE out.
     * @param stake True to stake, false to not stake.
     * @return amountIn Amount of principal to deposit.
     */
     public async calculateAmountIn(amountOut: BN, stake: boolean): Promise<BN> {
        return (await this.bondTeller.calculateAmountIn(amountOut, stake))
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
        bondID: number,
        gasConfig?: GasConfiguration
    ): Promise<providers.TransactionResponse> {
        invariant(providers.JsonRpcSigner.isSigner(this.providerOrSigner), "cannot execute mutator function without a signer")

        const tx: providers.TransactionResponse = await this.bondTeller.claimPayout(bondID, {...gasConfig})
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
        deposit: BN,
        minAmountOut: BN,
        depositor: string,
        stake: boolean,
        gasConfig?: GasConfiguration
    ): Promise<providers.TransactionResponse> {
        invariant(providers.JsonRpcSigner.isSigner(this.providerOrSigner), "cannot execute mutator function without a signer")
        invariant(utils.isAddress(depositor), "not an Ethereum address")
        invariant(depositor != ZERO_ADDRESS, "cannot enter zero address policyholder")
        invariant(this.token !== "eth", "function does not exist on BondTellerEth")
        invariant(this.token !== "matic", "function does not exist on BondTellerMatic")

        const tx: providers.TransactionResponse = await this.bondTeller.deposit(deposit, minAmountOut, depositor, stake, {...gasConfig})
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
        deposit: BN,
        minAmountOut: BN,
        depositor: string,
        stake: boolean,
        deadline: BN,
        v: utils.BytesLike,
        r: utils.BytesLike,
        s: utils.BytesLike,
        gasConfig?: GasConfiguration
    ): Promise<providers.TransactionResponse> {
        invariant(providers.JsonRpcSigner.isSigner(this.providerOrSigner), "cannot execute mutator function without a signer")
        invariant(utils.isAddress(depositor), "not an Ethereum address")
        invariant(depositor != ZERO_ADDRESS, "cannot enter zero address policyholder")
        invariant(this.token !== "eth", "function does not exist on BondTellerEth")
        invariant(this.token !== "matic", "function does not exist on BondTellerMatic")

        const tx: providers.TransactionResponse = await this.bondTeller.depositSigned(deposit, minAmountOut, depositor, stake, deadline, v, r, s, {...gasConfig})
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
        deposit: BN,
        minAmountOut: BN,
        depositor: string,
        stake: boolean,
        gasConfig?: GasConfiguration
    ): Promise<providers.TransactionResponse> {
        invariant(providers.JsonRpcSigner.isSigner(this.providerOrSigner), "cannot execute mutator function without a signer")
        invariant(utils.isAddress(depositor), "not an Ethereum address")
        invariant(depositor != ZERO_ADDRESS, "cannot enter zero address policyholder")
        invariant(this.token === "eth", "function only exists on BondTellerEth")

        const tx: providers.TransactionResponse = await this.bondTeller.depositEth(minAmountOut, depositor, stake, {value: deposit, ...gasConfig})
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
        deposit: BN,
        minAmountOut: BN,
        depositor: string,
        stake: boolean,
        gasConfig?: GasConfiguration
    ): Promise<providers.TransactionResponse> {
        invariant(providers.JsonRpcSigner.isSigner(this.providerOrSigner), "cannot execute mutator function without a signer")
        invariant(utils.isAddress(depositor), "not an Ethereum address")
        invariant(depositor != ZERO_ADDRESS, "cannot enter zero address policyholder")
        invariant(this.token === "eth", "function only exists on BondTellerEth")


        const tx: providers.TransactionResponse = await this.bondTeller.depositWeth(deposit, minAmountOut, depositor, stake, {...gasConfig})
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
        deposit: BN,
        minAmountOut: BN,
        depositor: string,
        stake: boolean,
        deadline: BN,
        v: utils.BytesLike,
        r: utils.BytesLike,
        s: utils.BytesLike,
        gasConfig?: GasConfiguration
    ): Promise<providers.TransactionResponse> {
        invariant(providers.JsonRpcSigner.isSigner(this.providerOrSigner), "cannot execute mutator function without a signer")
        invariant(utils.isAddress(depositor), "not an Ethereum address")
        invariant(depositor != ZERO_ADDRESS, "cannot enter zero address policyholder")
        invariant(this.token === "eth", "function only exists on BondTellerEth")

        const tx: providers.TransactionResponse = await this.bondTeller.depositWethSigned(deposit, minAmountOut, depositor, stake, deadline, v, r, s, {...gasConfig})
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
        deposit: BN,
        minAmountOut: BN,
        depositor: string,
        stake: boolean,
        gasConfig?: GasConfiguration
    ): Promise<providers.TransactionResponse> {
        invariant(providers.JsonRpcSigner.isSigner(this.providerOrSigner), "cannot execute mutator function without a signer")
        invariant(utils.isAddress(depositor), "not an Ethereum address")
        invariant(depositor != ZERO_ADDRESS, "cannot enter zero address policyholder")
        invariant(this.token === "matic", "function only exists on BondTellerMatic")

        const tx: providers.TransactionResponse = await this.bondTeller.depositMatic(minAmountOut, depositor, stake, {value: deposit, ...gasConfig})
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
        deposit: BN,
        minAmountOut: BN,
        depositor: string,
        stake: boolean,
        gasConfig?: GasConfiguration
    ): Promise<providers.TransactionResponse> {
        invariant(providers.JsonRpcSigner.isSigner(this.providerOrSigner), "cannot execute mutator function without a signer")
        invariant(utils.isAddress(depositor), "not an Ethereum address")
        invariant(depositor != ZERO_ADDRESS, "cannot enter zero address policyholder")
        invariant(this.token === "matic", "function only exists on BondTellerMatic")


        const tx: providers.TransactionResponse = await this.bondTeller.depositWmatic(deposit, minAmountOut, depositor, stake, {...gasConfig})
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
        deposit: BN,
        minAmountOut: BN,
        depositor: string,
        stake: boolean,
        deadline: BN,
        v: utils.BytesLike,
        r: utils.BytesLike,
        s: utils.BytesLike,
        gasConfig?: GasConfiguration
    ): Promise<providers.TransactionResponse> {
        invariant(providers.JsonRpcSigner.isSigner(this.providerOrSigner), "cannot execute mutator function without a signer")
        invariant(utils.isAddress(depositor), "not an Ethereum address")
        invariant(depositor != ZERO_ADDRESS, "cannot enter zero address policyholder")
        invariant(this.token === "matic", "function only exists on BondTellerMatic")

        const tx: providers.TransactionResponse = await this.bondTeller.depositWmaticSigned(deposit, minAmountOut, depositor, stake, deadline, v, r, s, {...gasConfig})
        return tx
    }
}