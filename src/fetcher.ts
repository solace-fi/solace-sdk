import { BigNumber as BN, Contract, getDefaultProvider, providers, utils } from 'ethers'
const { getNetwork } = providers
import SolaceCoverProduct from "./abis/SolaceCoverProduct.json"
import invariant from 'tiny-invariant'
import axios, { AxiosResponse } from "axios"
import { SOLACE_COVER_PRODUCT_ADDRESS } from './constants'
import { SolaceRiskBalance, SolaceRiskScore } from './types/api'

/*
 * Contains methods for accessing external view functions in SolaceCoverProduct.sol
 * To make this versatile for multi-chain deployment of SolaceCoverProduct.sol (even though at present it is only deployed on Rinkeby and Mainnet)
 * We will have the chainID as the required constructor parameter for the Fetcher-derived object
 * 
 * Uniswap has an abstract class here, I've chosen to use a class instead
 * The problem is you need to feed the chainID at some point, to enable multi-chain flexibility
 * The way Uniswap have done it, you need to provide the chainID as a parameter with each individual method call
 * I am choosing to have the user provide one line of code at the top, to create an instance of Fetcher with custom property chainID
 * This does burden the dev with needing basic knowledge on Javascript classes, hopefully good dev docs mitigate this
 * I believe this approach scales much better, when the dev wants to integrate many methods from this class in the one script
 * 
 * Don't want abstract class here, we want to create a new instance of the Fetcher class for each use, that is linked to the chainID
 */
export class Fetcher {
    /**************
    PROPERTIES
    **************/
    chainID: number;
    provider: providers.Provider;
    solaceCoverProduct: Contract;

    /**************
    CONSTRUCTOR
    **************/
    // TODO - Optional parameter, provider, in case dev wants to use their own provider
    constructor(chainID: number, provider?: providers.Provider) {
        this.chainID = chainID;
        typeof(provider) == 'undefined' ? this.provider = getDefaultProvider(getNetwork(chainID)) : this.provider = provider;
        this.solaceCoverProduct = new Contract(SOLACE_COVER_PRODUCT_ADDRESS[chainID], SolaceCoverProduct, this.provider)
    }

    /*************************************************************
    METHODS - SOLACECOVERPRODUCT EXTERNAL VIEW FUNCTION WRAPPERS
    *************************************************************/
    
    // TO-DO Decode from hex to usable number
    public async activeCoverLimit(): Promise<BN> {
        return (await this.solaceCoverProduct.activeCoverLimit())
    }

    // TO-DO Decode from hex to usable number
    public async availableCoverCapacity(): Promise<BN> {
        return (await this.solaceCoverProduct.availableCoverCapacity())
    }

    // TO-DO Decode from hex to usable number
    public async maxCover(): Promise<BN> {
        return (await this.solaceCoverProduct.maxCover())
    }
    
    public async policyCount(): Promise<BN> {
        return (await this.solaceCoverProduct.policyCount())
    }

    // TO-DO Decode from hex to usable number
    public async accountBalanceOf(policyholder: string): Promise<BN> {
        invariant(utils.isAddress(policyholder), 'not an Ethereum address')
        return (await this.solaceCoverProduct.accountBalanceOf(policyholder))
    }

    // TO-DO Decode from hex to usable number
    public async coverLimitOf(policyID: number): Promise<BN> {
        return (await this.solaceCoverProduct.coverLimitOf(policyID))
    }

    // TO-DO Decode from hex to usable number
    public async minRequiredAccountBalance(coverLimit: BN): Promise<BN> {
        return (await this.solaceCoverProduct.minRequiredAccountBalance(coverLimit))
    }

    public async policyStatus(policyID: number): Promise<boolean> {
        return (await this.solaceCoverProduct.policyStatus(policyID))
    }

    public async policyOf(policyholder: string): Promise<BN> {
        invariant(utils.isAddress(policyholder), 'not an Ethereum address')
        return (await this.solaceCoverProduct.policyOf(policyholder))
    }

    public async rewardPointsOf(policyholder: string): Promise<BN> {
        invariant(utils.isAddress(policyholder), 'not an Ethereum address')
        return (await this.solaceCoverProduct.rewardPointsOf(policyholder))
    }

    public async isReferralCodeUsed(policyholder: string): Promise<boolean> {
        invariant(utils.isAddress(policyholder), 'not an Ethereum address')
        return (await this.solaceCoverProduct.isReferralCodeUsed(policyholder))
    }

    public async getReferrerFromReferralCode(referralCode: utils.BytesLike): Promise<string> {
        return (await this.solaceCoverProduct.getReferrerFromReferralCode(referralCode))
    }

    public async isReferralCodeValid(referralCode: utils.BytesLike): Promise<boolean> {
        return (await this.solaceCoverProduct.isReferralCodeValid(referralCode))
    }    

    /******************************
    METHODS - OFF-CHAIN API CALLS
    ******************************/

    public async getSolaceRiskBalances(address: string): Promise<SolaceRiskBalance[] | undefined | unknown > {
        return await axios({
            url: `https://risk-data.solace.fi/balances?account=${address}&chain_id=${this.chainID}`, 
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        })
        .then((response: AxiosResponse<any, any>) => {return response.data})
        .catch((error: AxiosResponse<any, any>) => {
            console.error('Error getSolaceRiskBalances:', error)
            return undefined
        })
    }    

    public async getSolaceRiskScores (
        address: string,
        positions: SolaceRiskBalance[]
    ): Promise<SolaceRiskScore | undefined> {
        return await axios({
            url:'https://risk-data.solace.fi/scores',
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({
                account: address,
                positions: positions,
            }),
        })
        .then((response) => {return response.data})
        .catch((error) => {
            console.error('Error getSolaceRiskScores:', error)
            return undefined
        })
    }
}