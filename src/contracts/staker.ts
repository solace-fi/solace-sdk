import { BigNumber as BN, Contract, providers, Wallet, utils, getDefaultProvider, BigNumberish } from 'ethers'
const { getNetwork } = providers
import xsLocker from "../abis/xsLocker.json"
import StakingRewards from "../abis/StakingRewards.json"
import StakingRewardsV2 from "../abis/StakingRewardsV2.json"
import invariant from 'tiny-invariant'
import { STAKING_REWARDS_ADDRESS, XSLOCKER_ADDRESS, ZERO_ADDRESS, DEFAULT_ENDPOINT, STAKING_REWARDS_V2_ADDRESS, foundNetwork } from '../constants'
import { GasConfiguration } from '../types';
import { getProvider } from '../utils/ethers'

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
    walletOrProviderOrSigner: Wallet | providers.JsonRpcSigner | providers.Provider;
    stakingRewards: Contract;
    xsLocker: Contract;

    /**************
    CONSTRUCTOR
    **************/

    /**
     * @param chainID The chainID for the Staker object, 1 for Ethereum Mainnet.
     * @param walletOrProviderOrSigner walletOrProviderOrSigner object - a Wallet (https://docs.ethers.io/v5/api/signer/#Wallet) or a Provider (https://docs.ethers.io/v5/api/providers/) or Signer (https://docs.ethers.io/v5/api/signer/)
     */
    constructor(chainID: number, walletOrProviderOrSigner?: Wallet | providers.JsonRpcSigner | providers.Provider) {
        invariant(foundNetwork(chainID)?.features.general.stakingV2, 'stakingV2 not supported on this chain')
        const xslAddr = XSLOCKER_ADDRESS[chainID]
        const srAddr = foundNetwork(chainID)?.features.general.stakingRewardsV2 ? STAKING_REWARDS_V2_ADDRESS[chainID] : STAKING_REWARDS_ADDRESS[chainID]
        invariant(xslAddr, `XSLOCKER_ADDRESS[${chainID}] not found`)
        invariant(srAddr, `STAKING_REWARDS_V2_ADDRESS[${chainID}] or STAKING_REWARDS_ADDRESS[${chainID}] not found`)
  
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
         
        if (foundNetwork(chainID)?.features.general.stakingRewardsV2) {
            this.stakingRewards = new Contract(STAKING_REWARDS_V2_ADDRESS[chainID], StakingRewardsV2, walletOrProviderOrSigner)
        }
        else {
            this.stakingRewards = new Contract(STAKING_REWARDS_ADDRESS[chainID], StakingRewards, walletOrProviderOrSigner)
        }

        this.xsLocker = new Contract(xslAddr, xsLocker, walletOrProviderOrSigner)
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
        amount: BigNumberish,
        end: BigNumberish,
        gasConfig?: GasConfiguration
    ): Promise<providers.TransactionResponse> {
        invariant(providers.JsonRpcSigner.isSigner(this.walletOrProviderOrSigner), "cannot execute mutator function without a signer")
        invariant(utils.isAddress(recipient), "not an Ethereum address")
        invariant(recipient != ZERO_ADDRESS, "cannot enter zero address policyholder")
        invariant(BN.from(amount).gt(0), "cannot enter zero amount")

        const tx: providers.TransactionResponse = await this.xsLocker.createLock(recipient, amount, end, {...gasConfig})
        return tx
    }

    /**
     * Deposit SOLACE to create a new lock, uses EIP-712 signature to perform approval in same transaction
     * @dev recipient = msg.sender
     * @param amount The amount of [**SOLACE**](./../SOLACE) to deposit.
     * @param end The timestamp the lock will unlock, use end = 0 to initialize as unlocked
     * @param deadline Time the transaction must go through before.
     * @param v secp256k1 signature
     * @param r secp256k1 signature
     * @param s secp256k1 signature
     */
     public async createLockSigned(
        amount: BigNumberish,
        end: BigNumberish,
        deadline: BigNumberish,
        v: utils.BytesLike,
        r: utils.BytesLike,
        s: utils.BytesLike,
        gasConfig?: GasConfiguration
    ): Promise<providers.TransactionResponse> {
        invariant(providers.JsonRpcSigner.isSigner(this.walletOrProviderOrSigner), "cannot execute mutator function without a signer")
        invariant(BN.from(amount).gt(0), "cannot enter zero amount")

        const tx: providers.TransactionResponse = await this.xsLocker.createLockSigned(amount, end, deadline, v, r, s, {...gasConfig})
        return tx
    }


    /**
     * @notice Deposit SOLACE to increase the value of an existing lock.
     * @dev SOLACE is transferred from msg.sender, assumes its already approved.
     * @param xsLockID The ID of the lock to update.
     * @param amount The amount of SOLACE to deposit.
     */
     public async increaseAmount(
        xsLockID: BigNumberish,
        amount: BigNumberish,
        gasConfig?: GasConfiguration
    ): Promise<providers.TransactionResponse> {
        invariant(providers.JsonRpcSigner.isSigner(this.walletOrProviderOrSigner), "cannot execute mutator function without a signer")
        invariant(BN.from(amount).gt(0), "cannot enter zero amount")

        const tx: providers.TransactionResponse = await this.xsLocker.increaseAmount(xsLockID, amount, {...gasConfig})
        return tx
    }

    /**
     * @notice Deposit SOLACE to increase the value of an existing lock.
     * @dev SOLACE is transferred from msg.sender, uses EIP-712 signature to perform approval in same transaction
     * @param xsLockID The ID of the lock to update.
     * @param amount The amount of SOLACE to deposit.
     * @param deadline Time the transaction must go through before.
     * @param v secp256k1 signature
     * @param r secp256k1 signature
     * @param s secp256k1 signature
     */
     public async increaseAmountSigned(
        xsLockID: BigNumberish,
        amount: BigNumberish,
        deadline: BigNumberish,
        v: utils.BytesLike,
        r: utils.BytesLike,
        s: utils.BytesLike,
        gasConfig?: GasConfiguration
    ): Promise<providers.TransactionResponse> {
        invariant(providers.JsonRpcSigner.isSigner(this.walletOrProviderOrSigner), "cannot execute mutator function without a signer")
        invariant(BN.from(amount).gt(0), "cannot enter zero amount")

        const tx: providers.TransactionResponse = await this.xsLocker.increaseAmountSigned(xsLockID, amount, deadline, v, r, s, {...gasConfig})
        return tx
    }

    /**
     * @notice Extend a lock's duration.
     * @dev Can only be called by the lock owner or approved.
     * @param xsLockID The ID of the lock to update.
     * @param end The new time for the lock to unlock.
     */
     public async extendLock(
        xsLockID: BigNumberish,
        end: BigNumberish,
        gasConfig?: GasConfiguration
    ): Promise<providers.TransactionResponse> {
        invariant(providers.JsonRpcSigner.isSigner(this.walletOrProviderOrSigner), "cannot execute mutator function without a signer")
        invariant(BN.from(end).gt(0), "not extended")

        const tx: providers.TransactionResponse = await this.xsLocker.extendLock(xsLockID, end, {...gasConfig})
        return tx
    }

    /**
     * @notice Withdraw from a lock in full.
     * @dev Can only be called by the lock owner or approved.
     * @dev Can only be called if unlocked.
     * @param xsLockID The ID of the lock to withdraw from.
     * @param recipient The user to receive the lock's SOLACE.
     */
     public async withdraw(
        xsLockID: BigNumberish,
        recipient: string,
        gasConfig?: GasConfiguration
    ): Promise<providers.TransactionResponse> {
        invariant(providers.JsonRpcSigner.isSigner(this.walletOrProviderOrSigner), "cannot execute mutator function without a signer")
        invariant(utils.isAddress(recipient), "not an Ethereum address")
        invariant(recipient != ZERO_ADDRESS, "cannot enter zero address policyholder")

        const tx: providers.TransactionResponse = await this.xsLocker.withdraw(xsLockID, recipient, {...gasConfig})
        return tx
    }

    /**
     * @notice Withdraw from a lock in part.
     * @dev Can only be called by the lock owner or approved.
     * @dev Can only be called if unlocked.
     * @param xsLockID The ID of the lock to withdraw from.
     * @param recipient The user to receive the lock's SOLACE.
     * @param amount The amount of SOLACE to withdraw.
     */
     public async withdrawInPart(
        xsLockID: BigNumberish,
        recipient: string,
        amount: BigNumberish,
        gasConfig?: GasConfiguration
    ): Promise<providers.TransactionResponse> {
        invariant(providers.JsonRpcSigner.isSigner(this.walletOrProviderOrSigner), "cannot execute mutator function without a signer")
        invariant(utils.isAddress(recipient), "not an Ethereum address")
        invariant(recipient != ZERO_ADDRESS, "cannot enter zero address policyholder")
        invariant(BN.from(amount).gt(0), "cannot enter zero amount")

        const tx: providers.TransactionResponse = await this.xsLocker.withdrawInPart(xsLockID, recipient, amount, {...gasConfig})
        return tx
    }

    /**
     * @notice Withdraw from a multiple locks in full.
     * @dev Can only be called by the lock owner or approved.
     * @dev Can only be called if unlocked.
     * @param xsLockIDs The ID of the locks to withdraw from.
     * @param recipient The user to receive the lock's SOLACE.
     */
     public async withdrawMany(
        xsLockIDs: BigNumberish[],
        recipient: string,
        gasConfig?: GasConfiguration
    ): Promise<providers.TransactionResponse> {
        invariant(providers.JsonRpcSigner.isSigner(this.walletOrProviderOrSigner), "cannot execute mutator function without a signer")
        invariant(utils.isAddress(recipient), "not an Ethereum address")
        invariant(recipient != ZERO_ADDRESS, "cannot enter zero address policyholder")

        const tx: providers.TransactionResponse = await this.xsLocker.withdrawMany(xsLockIDs, recipient, {...gasConfig})
        return tx
    }

    /**********************************
    xsLocker View Functions
    **********************************/


    // TO-DO Create Lock type?
    /**
     * @notice Information about a lock.
     * @param xsLockID The ID of the lock to query.
     * @return lock_ Information about the lock.
     */
     public async locks(xsLockID: BigNumberish): Promise<any> {
        return (await this.xsLocker.locks(xsLockID))
    }

    /**
     * @notice Returns whether a lock is locked.
     * @param xsLockID The ID of the lock to query.
     * @return locked True if the lock is locked, false if unlocked.
     */
     public async isLocked(xsLockID: BigNumberish): Promise<boolean> {
        return (await this.xsLocker.isLocked(xsLockID))
    }

    /**
     * @notice Determines the time left until the lock unlocks.
     * @param xsLockID The ID of the lock to query.
     * @return time The time left in seconds, 0 if unlocked.
     */
     public async timeLeft(xsLockID: BigNumberish): Promise<BN> {
        return (await this.xsLocker.timeLeft(xsLockID))
    }

    /**
     * @notice Returns the amount of [**SOLACE**](./../SOLACE) the user has staked.
     * @param account The account to query.
     * @return balance The user's balance.
     */
     public async stakedBalance(account: string): Promise<BN> {
        invariant(utils.isAddress(account), "not an Ethereum address")
        invariant(account != ZERO_ADDRESS, "cannot enter zero address policyholder")
        return (await this.xsLocker.stakedBalance(account))
    }

    /**********************************
    StakingRewards Mutator Functions
    **********************************/

    /**
     * @notice Updates and sends a lock's rewards.
     * @param xsLockID The ID of the lock to process rewards for.
     */
     public async harvestLock(
        xsLockID: BigNumberish,
        gasConfig?: GasConfiguration
    ): Promise<providers.TransactionResponse> {
        invariant(providers.JsonRpcSigner.isSigner(this.walletOrProviderOrSigner), "cannot execute mutator function without a signer")
        const tx: providers.TransactionResponse = await this.stakingRewards.harvestLock(xsLockID, {...gasConfig})
        return tx
    }
    
    /**
     * @notice Updates and sends a lock's rewards.
     * @param xsLockID The ID of the lock to process rewards for.
     */
     public async harvestLocks(
        xsLockIDs: BigNumberish[],
        gasConfig?: GasConfiguration
    ): Promise<providers.TransactionResponse> {
        invariant(providers.JsonRpcSigner.isSigner(this.walletOrProviderOrSigner), "cannot execute mutator function without a signer")
        const tx: providers.TransactionResponse = await this.stakingRewards.harvestLock(xsLockIDs, {...gasConfig})
        return tx
    }

    /**
     * @notice Withdraws a lock's rewards and deposits it back into the lock.
     * Can only be called by the owner of the lock.
     * @param xsLockID The ID of the lock to compound.
     */
     public async compoundLock(
        xsLockID: BigNumberish,
        gasConfig?: GasConfiguration
    ): Promise<providers.TransactionResponse> {
        invariant(providers.JsonRpcSigner.isSigner(this.walletOrProviderOrSigner), "cannot execute mutator function without a signer")
        const tx: providers.TransactionResponse = await this.stakingRewards.compoundLock(xsLockID, {...gasConfig})
        return tx
    }

    /**
     * @notice Withdraws multiple lock's rewards and deposits it into lock.
     * Can only be called by the owner of the locks.
     * @param xsLockIDs The ID of the locks to compound.
     * @param increasedLockID The ID of the lock to deposit into.
     */
     public async compoundLocks(
        xsLockIDs: BigNumberish[],
        increasedLockID: BigNumberish,
        gasConfig?: GasConfiguration
    ): Promise<providers.TransactionResponse> {
        invariant(providers.JsonRpcSigner.isSigner(this.walletOrProviderOrSigner), "cannot execute mutator function without a signer")
        const tx: providers.TransactionResponse = await this.stakingRewards.compoundLocks(xsLockIDs, increasedLockID, {...gasConfig})
        return tx
    }

    /**********************************
    StakingRewardsV2 Mutator Functions
    **********************************/

	/**
     * @notice Updates and sends a lock's rewards.
     * @param xsLockID The ID of the lock to process rewards for.
     * @param price The `SOLACE` price in wei(usd).
     * @param priceDeadline Expiry timestamp for price quote.
     * @param signature The `SOLACE` price signature.
    */
     public async harvestLockForScp(
        xsLockID: BigNumberish,
        price: BigNumberish,
        priceDeadline: BigNumberish,
        signature: utils.BytesLike,
        gasConfig?: GasConfiguration
    ): Promise<providers.TransactionResponse> {
        invariant(STAKING_REWARDS_V2_ADDRESS[this.chainID], "StakingRewardsV2 not deployed on chain")
        invariant(providers.JsonRpcSigner.isSigner(this.walletOrProviderOrSigner), "cannot execute mutator function without a signer")
        const tx: providers.TransactionResponse = await this.stakingRewards.harvestLockForScp(xsLockID, price, priceDeadline, signature, {...gasConfig})
        return tx
    }

	/**
     * @notice Updates and sends multiple lock's rewards.
     * @param xsLockIDs The IDs of the locks to process rewards for.
     * @param price The `SOLACE` price in wei(usd).
     * @param priceDeadline The `SOLACE` price in wei(usd).
     * @param signature The `SOLACE` price signature.
     */
     public async harvestLocksForScp(
        xsLockIDs: BigNumberish[],
        price: BigNumberish,
        priceDeadline: BigNumberish,
        signature: utils.BytesLike,
        gasConfig?: GasConfiguration
    ): Promise<providers.TransactionResponse> {
        invariant(STAKING_REWARDS_V2_ADDRESS[this.chainID], "StakingRewardsV2 not deployed on chain")
        invariant(providers.JsonRpcSigner.isSigner(this.walletOrProviderOrSigner), "cannot execute mutator function without a signer")
        const tx: providers.TransactionResponse = await this.stakingRewards.harvestLocksForScp(xsLockIDs, price, priceDeadline, signature, {...gasConfig})
        return tx
    }

    /**
     * @notice Adds a one time boost to rewards.
     * Paid in [**SOLACE**](./../../SOLACE) by `msg.sender`.
     * @param amount Amount of rewards to distribute.
     */
     public async postRewards(
        amount: BigNumberish,
        gasConfig?: GasConfiguration
    ): Promise<providers.TransactionResponse> {
        invariant(STAKING_REWARDS_V2_ADDRESS[this.chainID], "StakingRewardsV2 not deployed on chain")
        invariant(providers.JsonRpcSigner.isSigner(this.walletOrProviderOrSigner), "cannot execute mutator function without a signer")
        const tx: providers.TransactionResponse = await this.stakingRewards.postRewards(amount, {...gasConfig})
        return tx
    }

    /**********************************
    StakingRewards View Functions
    **********************************/

    /**
     * @notice Information about each lock.
     * @param xsLockID The ID of the lock to query.
     * @return StakedLockInfo
     */
     public async stakedLockInfo(xsLockID: BigNumberish): Promise<any> {
        return (await this.stakingRewards.stakedLockInfo(xsLockID))
    }

    /**
     * @notice Calculates the accumulated balance of [**SOLACE**](./../SOLACE) for specified lock.
     * @param xsLockID The ID of the lock to query rewards for.
     * @return reward Total amount of withdrawable reward tokens.
     */
     public async pendingRewardsOfLock(xsLockID: BigNumberish): Promise<BN> {
        return (await this.stakingRewards.pendingRewardsOfLock(xsLockID))
    }

}