import { BigNumber as BN, Contract, providers, Wallet, utils } from 'ethers'
import SolaceCoverProduct from "./abis/SolaceCoverProduct.json"
import invariant from 'tiny-invariant'
import { SOLACE_COVER_PRODUCT_ADDRESS } from './constants'

/*
 * Contains methods for accessing policyholder mutator functions in SolaceCoverProduct.sol
 */
export class Policyholder {
    /**************
    PROPERTIES
    **************/
    chainID: number;
    signer: Wallet | providers.JsonRpcSigner;
    solaceCoverProduct: Contract;

    // We can stuff both the policyholder and getReferralCode function here

    /**************
    CONSTRUCTOR
    **************/

    // It is up to the user to decide how to create the signer, whether that is a Wallet or JsonRpcSigner entity
    constructor(chainID: number, signer: Wallet | providers.JsonRpcSigner) {
        this.chainID = chainID;
        this.signer = signer;
        this.solaceCoverProduct = new Contract(SOLACE_COVER_PRODUCT_ADDRESS[chainID], SolaceCoverProduct, signer)
    }

    /**************
    METHODS
    **************/
    
    public async activatePolicy(
        policyholder: string,
        coverLimit: BN,
        amount: BN,
        referralCode: utils.BytesLike
    ): Promise<BN> {
        invariant(utils.isAddress(policyholder), 'not an Ethereum address')
        return (await this.solaceCoverProduct.activatePolicy(policyholder, coverLimit, amount, referralCode))
    }

    public async updateCoverLimit(
        newCoverLimit: BN,
        referralCode: utils.BytesLike
    ) {
        await this.solaceCoverProduct.updateCoverLimit(newCoverLimit, referralCode)
    }

    public async deposit(
        policyholder: string,
        amount: BN
    ) {
        invariant(utils.isAddress(policyholder), 'not an Ethereum address')
        await this.solaceCoverProduct.deposit(policyholder, amount)
    }

    public async withdraw() {
        await this.solaceCoverProduct.withdraw()
    }

    public async deactivatePolicy() {
        await this.solaceCoverProduct.deactivatePolicy()
    }

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