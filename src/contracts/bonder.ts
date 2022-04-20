import { BigNumber as BN, Contract, providers, Wallet, utils, getDefaultProvider, BigNumberish } from 'ethers'
const { getNetwork } = providers
import BondTellerErc20 from "../abis/BondTellerErc20.json"
import BondTellerEth from "../abis/BondTellerEth.json"
import BondTellerMatic from "../abis/BondTellerMatic.json"
import invariant from 'tiny-invariant'
import { BOND_TELLER_ADDRESSES, ZERO_ADDRESS, isNetworkSupported } from '../constants'
import { GasConfiguration } from '../types';
import { getProvider } from '../utils/ethers'
import { BondTellerContractData } from '../types/bond'

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
    bondTellerContractData: BondTellerContractData;

    /**************
    CONSTRUCTOR
    **************/

    /**
     * @param chainID The chainID for the Staker object, 1 for Ethereum Mainnet.
     * @param walletOrProviderOrSigner walletOrProviderOrSigner object - a Wallet (https://docs.ethers.io/v5/api/signer/#Wallet) or a Provider (https://docs.ethers.io/v5/api/providers/) or Signer (https://docs.ethers.io/v5/api/signer/)
     * @param token string (can be lowercase, uppercase or mixed) describing token for bond purchases. See documentation for supported tokens.
     */
     constructor(chainID: number, bondTellerContractData: BondTellerContractData, walletOrProviderOrSigner?: Wallet | providers.JsonRpcSigner | providers.Provider, token?: string) {
        invariant(isNetworkSupported(chainID),"not a supported chainID")

        this.chainID = chainID;

        invariant(() => {
            if (!bondTellerContractData) return false
            if(bondTellerContractData.type != 'erc20' || 'matic' || 'eth') return false
            let found = false
            Object.keys(BOND_TELLER_ADDRESSES).forEach((key) => {
                if(BOND_TELLER_ADDRESSES[key][this.chainID] != undefined) {
                    if(BOND_TELLER_ADDRESSES[key][this.chainID].addr == bondTellerContractData.contract.address) {
                        found = true
                    }
                }
            })
            return found
        }, 'must provide valid bond teller contract data')
        if(token){
            invariant(BOND_TELLER_ADDRESSES.hasOwnProperty(token.toLowerCase()), "not a supported token for bonds" )
            invariant(BOND_TELLER_ADDRESSES[token][chainID] !== undefined, "not a supported token for bonds on this chainid" )
        }
        

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

        if(token) {
            if (token.toLowerCase() === "eth") {
                this.bondTellerContractData = {contract: new Contract(BOND_TELLER_ADDRESSES[token][chainID].addr, BondTellerEth, walletOrProviderOrSigner), type: 'eth'}
            } else if (token.toLowerCase() === "matic") {
                this.bondTellerContractData = {contract: new Contract(BOND_TELLER_ADDRESSES[token][chainID].addr, BondTellerMatic, walletOrProviderOrSigner), type: 'matic'}
            } else {
                this.bondTellerContractData = {contract: new Contract(BOND_TELLER_ADDRESSES[token][chainID].addr, BondTellerErc20, walletOrProviderOrSigner), type: 'erc20'}
            }
        } else {
            this.bondTellerContractData = bondTellerContractData
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
        return (await this.bondTellerContractData.contract.bondPrice())
    }

    /**
     * @notice Calculate the amount of SOLACE out for an amount of principal.
     * @param amountIn Amount of principal to deposit.
     * @param stake True to stake, false to not stake.
     * @return amountOut Amount of SOLACE out.
     */
     public async calculateAmountOut(amountIn: BigNumberish, stake: boolean): Promise<BN> {
        return (await this.bondTellerContractData.contract.calculateAmountOut(amountIn, stake))
    }

    /**
     * @notice Calculate the amount of SOLACE out for an amount of principal.
     * @param amountOut Amount of SOLACE out.
     * @param stake True to stake, false to not stake.
     * @return amountIn Amount of principal to deposit.
     */
     public async calculateAmountIn(amountOut: BigNumberish, stake: boolean): Promise<BN> {
        return (await this.bondTellerContractData.contract.calculateAmountIn(amountOut, stake))
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

        const tx: providers.TransactionResponse = await this.bondTellerContractData.contract.claimPayout(bondID, {...gasConfig})
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
        invariant(this.bondTellerContractData.type !== "eth", "function does not exist on BondTellerEth")
        invariant(this.bondTellerContractData.type !== "matic", "function does not exist on BondTellerMatic")

        const tx: providers.TransactionResponse = await this.bondTellerContractData.contract.deposit(deposit, minAmountOut, depositor, stake, {...gasConfig})
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
        invariant(this.bondTellerContractData.type !== "eth", "function does not exist on BondTellerEth")
        invariant(this.bondTellerContractData.type !== "matic", "function does not exist on BondTellerMatic")

        const tx: providers.TransactionResponse = await this.bondTellerContractData.contract.depositSigned(deposit, minAmountOut, depositor, stake, deadline, v, r, s, {...gasConfig})
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
        invariant(this.bondTellerContractData.type === "eth", "function only exists on BondTellerEth")

        const tx: providers.TransactionResponse = await this.bondTellerContractData.contract.depositEth(minAmountOut, depositor, stake, {value: deposit, ...gasConfig})
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
        invariant(this.bondTellerContractData.type === "eth", "function only exists on BondTellerEth")


        const tx: providers.TransactionResponse = await this.bondTellerContractData.contract.depositWeth(deposit, minAmountOut, depositor, stake, {...gasConfig})
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
        invariant(this.bondTellerContractData.type === "eth", "function only exists on BondTellerEth")

        const tx: providers.TransactionResponse = await this.bondTellerContractData.contract.depositWethSigned(deposit, minAmountOut, depositor, stake, deadline, v, r, s, {...gasConfig})
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
        invariant(this.bondTellerContractData.type === "matic", "function only exists on BondTellerMatic")

        const tx: providers.TransactionResponse = await this.bondTellerContractData.contract.depositMatic(minAmountOut, depositor, stake, {value: deposit, ...gasConfig})
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
        invariant(this.bondTellerContractData.type === "matic", "function only exists on BondTellerMatic")


        const tx: providers.TransactionResponse = await this.bondTellerContractData.contract.depositWmatic(deposit, minAmountOut, depositor, stake, {...gasConfig})
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
        invariant(this.bondTellerContractData.type === "matic", "function only exists on BondTellerMatic")

        const tx: providers.TransactionResponse = await this.bondTellerContractData.contract.depositWmaticSigned(deposit, minAmountOut, depositor, stake, deadline, v, r, s, {...gasConfig})
        return tx
    }
}