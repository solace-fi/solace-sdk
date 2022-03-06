import { BigNumber as BN, Contract, getDefaultProvider, providers, utils } from 'ethers'
const { getNetwork } = providers
import SolaceCoverProduct from "./abis/SolaceCoverProduct.json"
import invariant from 'tiny-invariant'
import axios, { AxiosResponse } from "axios"
import { SOLACE_COVER_PRODUCT_ADDRESS, NETWORKS } from './constants'
import { SolaceRiskBalance, SolaceRiskScore, SolaceRiskSeries } from './types'

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

    /**
     * @param chainID The chainID for the Fetcher object, 1 for Ethereum Mainnet.
     * @param provider Optional parameter to provide a custom Provider object.
     * If no provider argument is given, Fetcher object will use the default provider as per ethers.js.
     */
    constructor(chainID: number, provider?: providers.Provider) {
        this.chainID = chainID;
        typeof(provider) == 'undefined' ? this.provider = getDefaultProvider(getNetwork(chainID)) : this.provider = provider;
        this.solaceCoverProduct = new Contract(SOLACE_COVER_PRODUCT_ADDRESS[chainID], SolaceCoverProduct, this.provider)
    }

    /*************************************************************
    METHODS - SOLACECOVERPRODUCT EXTERNAL VIEW FUNCTION WRAPPERS
    *************************************************************/
    
    /**
     * TO-DO Decide if need to decode return value from BN hex.
     * @returns The active cover limit in **USD** to 18 decimal places. In other words, the total cover that has been sold at the current time.
     */
    public async activeCoverLimit(): Promise<BN> {
        return (await this.solaceCoverProduct.activeCoverLimit())
    }

    /**
     * TO-DO Decide if need to decode return value from BN hex.
     * @returns The amount of available remaining capacity for new cover.
     */
    public async availableCoverCapacity(): Promise<BN> {
        return (await this.solaceCoverProduct.availableCoverCapacity())
    }

    /**
     * TO-DO Decide if need to decode return value from BN hex.
     * @returns The maximum amount of cover that can be sold in **USD** to 18 decimals places.
     */
    public async maxCover(): Promise<BN> {
        return (await this.solaceCoverProduct.maxCover())
    }

    /**
     * @returns The policy count (amount of policies that have been purchased, includes inactive policies).
     */
    public async policyCount(): Promise<BN> {
        return (await this.solaceCoverProduct.policyCount())
    }

    /**
     * TO-DO Decide if need to decode return value from BN hex.
     * @param policyholder The policyholder address.
     * @returns The policyholder's account balance in **USD**.
     */
    public async accountBalanceOf(policyholder: string): Promise<BN> {
        invariant(utils.isAddress(policyholder), 'not an Ethereum address')
        return (await this.solaceCoverProduct.accountBalanceOf(policyholder))
    }

    /**
     * TO-DO Decide if need to decode return value from BN hex.
     * @param policyID The policy ID.
     * @returns The cover limit for the given policy ID.
     */
    public async coverLimitOf(policyID: number): Promise<BN> {
        return (await this.solaceCoverProduct.coverLimitOf(policyID))
    }

    /**
     * TO-DO Decide if need to decode return value from BN hex.
     * @param coverLimit Cover limit.
     * @returns The minimum required account balance for a given cover limit. Equals the maximum chargeable fee for one epoch.
     */
    public async minRequiredAccountBalance(coverLimit: BN): Promise<BN> {
        return (await this.solaceCoverProduct.minRequiredAccountBalance(coverLimit))
    }

    /**
     * TO-DO Decide if need to decode return value from BN hex.
     * @param policyID The policy ID.
     * @returns True if policy is active. False if policy is inactive, or does not exist.
     */
    public async policyStatus(policyID: number): Promise<boolean> {
        return (await this.solaceCoverProduct.policyStatus(policyID))
    }

    /**
     * TO-DO Decide if need to decode return value from BN hex.
     * @param policyholder The policyholder address.
     * @returns policyID The policy ID.
     */
    public async policyOf(policyholder: string): Promise<BN> {
        invariant(utils.isAddress(policyholder), 'not an Ethereum address')
        return (await this.solaceCoverProduct.policyOf(policyholder))
    }

    /**
     * TO-DO Decide if need to decode return value from BN hex.
     * @param policyholder The policyholder address.
     * @returns The reward points for the policyholder.
     */
    public async rewardPointsOf(policyholder: string): Promise<BN> {
        invariant(utils.isAddress(policyholder), 'not an Ethereum address')
        return (await this.solaceCoverProduct.rewardPointsOf(policyholder))
    }

    /**
     * @param policyholder The policyholder address.
     * @returns True if the policyholder has previously used a valid referral code, false if not.
     */
    public async isReferralCodeUsed(policyholder: string): Promise<boolean> {
        invariant(utils.isAddress(policyholder), 'not an Ethereum address')
        return (await this.solaceCoverProduct.isReferralCodeUsed(policyholder))
    }

    /**
     * @param referralCode The referral code.
     * @returns The referrer address, returns 0 address if invalid referral code.
     */
    public async getReferrerFromReferralCode(referralCode: utils.BytesLike): Promise<string> {
        return (await this.solaceCoverProduct.getReferrerFromReferralCode(referralCode))
    }

    /**
     * @param referralCode The referral code.
     * @returns True if valid referral code, false otherwise.
     */
    public async isReferralCodeValid(referralCode: utils.BytesLike): Promise<boolean> {
        return (await this.solaceCoverProduct.isReferralCodeValid(referralCode))
    }    

    /******************************
    METHODS - OFF-CHAIN API CALLS
    ******************************/

    /**
     * @param address Ethereum address.
     * @returns DeFi protocol balances in USD for the address. See documentation for sample response object.
     */
    public async getSolaceRiskBalances_SingleChain(address: string): Promise<SolaceRiskBalance[] | undefined | unknown > {
        return await axios({
            url: 'https://risk-data.solace.fi/balances', 
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({
                chain_id: this.chainID,
                account: address,
            }),
        })
        .then((response: AxiosResponse<any, any>) => {return response.data})
        .catch((error: AxiosResponse<any, any>) => {
            console.error('Error getSolaceRiskBalances:', error)
            return undefined
        })
    }  

    /**
     * @param address Ethereum address.
     * @param chains Array of chainIDs to obtain DeFi protocol balances for.
     * @returns DeFi protocol balances in USD for the address for the selected chains. See documentation for sample response object.
     */
    public async getSolaceRiskBalances_MultiChain(address: string, chains: number[]): Promise<SolaceRiskBalance[] | undefined | unknown > {
        // Input check for chainIds
        const supportedChainIds = NETWORKS.map((network) => network.chainId);
        chains.forEach(item => invariant(supportedChainIds.includes(item),"not a supported chainID"))

        return await axios({
            url: 'https://risk-data.solace.fi/balances', 
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({
                chains: chains,
                account: address,
            }),
        })
        .then((response: AxiosResponse<any, any>) => {return response.data})
        .catch((error: AxiosResponse<any, any>) => {
            console.error('Error getSolaceRiskBalances:', error)
            return undefined
        })
    }  

    /**
     * @param address Ethereum address.
     * @param positions DeFi protocol balances for the address, returned by getSolaceRiskBalances() object.
     * @returns Risk scores for the address's DeFi portfolio. See documentation for sample response object.
     */
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

    /**
     * @returns Get Solace risk series data.
     */
     public async getSolaceRiskSeries(): Promise<SolaceRiskSeries | undefined | unknown > {
        return await axios({
            url: 'https://risk-data.solace.fi/series', 
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        })
        .then((response: AxiosResponse<any, any>) => {return response.data})
        .catch((error: AxiosResponse<any, any>) => {
            console.error('Error getSolaceRiskSeries', error)
            return undefined
        })
    }    
}