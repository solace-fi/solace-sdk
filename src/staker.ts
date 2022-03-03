import { BigNumber as BN, Contract, providers, Wallet, utils } from 'ethers'
import xsLocker from "./abis/xsLocker.json"
import StakingRewards from "./abis/StakingRewards.json"
import invariant from 'tiny-invariant'
import { STAKING_REWARDS_ADDRESS, XSLOCKER_ADDRESS, ZERO_ADDRESS } from './constants'
import { GasConfiguration } from './types';

/*
 * Contains methods for accessing Solace staking functionality (xsLocker.sol & StakingRewards.sol).
 * All blockchain mutating functions require a valid Ethereum private key (through a Signer object) to work.
 * All blockchain reading functions require only a Provider (to connect to and read the blockchain) to work.
 */
export class Staker {
    /**************
    PROPERTIES
    **************/
    chainID: number;
    providerOrSigner: Wallet | providers.JsonRpcSigner | providers.Provider;
    StakingRewards: Contract;
    xsLocker: Contract;

    /**************
    CONSTRUCTOR
    **************/

    /**
     * @param chainID The chainID for the Staker object, 1 for Ethereum Mainnet.
     * @param providerOrSigner providerOrSigner object - either a Provider (https://docs.ethers.io/v5/api/providers/) or Signer (https://docs.ethers.io/v5/api/signer/)
     */
    constructor(chainID: number, providerOrSigner: Wallet | providers.JsonRpcSigner | providers.Provider) {
        this.chainID = chainID;
        this.providerOrSigner = providerOrSigner;
        this.StakingRewards = new Contract(STAKING_REWARDS_ADDRESS[chainID], StakingRewards, providerOrSigner)
        this.xsLocker = new Contract(XSLOCKER_ADDRESS[chainID], xsLocker, providerOrSigner)
    }

    /**********************************
    xsLocker Mutator Functions
    **********************************/

    /**
     * Deposit SOLACE to create a new lock, assumes SOLACE already approved
     * @param recipient The account that will receive the lock.
     * @param amount The amount of [**SOLACE**](./../SOLACE) to deposit.
     * @param end The timestamp the lock will unlock, use end = 0 to initialize as unlocked
     */
     public async createLock(
        recipient: string,
        amount: BN,
        end: BN,
        gasConfig?: GasConfiguration
    ): Promise<providers.TransactionResponse> {
        invariant(providers.JsonRpcSigner.isSigner(this.providerOrSigner), "cannot execute mutator function without a signer")
        invariant(utils.isAddress(recipient), "not an Ethereum address")
        invariant(recipient != ZERO_ADDRESS, "cannot enter zero address policyholder")
        invariant(amount.gt(0), "cannot enter zero cover limit")

        const tx: providers.TransactionResponse = await this.xsLocker.createLock(recipient, amount, end, {...gasConfig})
        return tx
    }


    /**********************************
    xsLocker View Functions
    **********************************/

    /**********************************
    StakingRewards Mutator Functions
    **********************************/

    /**********************************
    StakingRewards View Functions
    **********************************/
}