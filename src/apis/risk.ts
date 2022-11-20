import invariant from 'tiny-invariant'
import axios, { AxiosResponse } from "axios"
import { isNetworkSupported } from '../constants'
import { SolaceRiskBalance, SolaceRiskScore, SolaceRiskSeries } from '../types'
import series from '../data/series.json';

export class Risk {

    /*************************************************************
    RATE CARD
    *************************************************************/
    
    /**
     * @returns Get Solace risk series data.
     */
     public async getSolaceRiskSeries(): Promise<SolaceRiskSeries | undefined > {
        // return await axios({
        //     url: 'https://risk-data.solace.fi/series', 
        //     method: 'GET',
        //     headers: {
        //         Accept: 'application/json',
        //         'Content-Type': 'application/json',
        //     },
        // })
        // .then((response: AxiosResponse<any, any>) => {return response.data})
        // .catch((error: AxiosResponse<any, any>) => {
        //     console.error('Error getSolaceRiskSeries', error)
        //     return undefined
        // })
        return series;
    }

    /*************************************************************
    QUOTE POLICY PRICE
    *************************************************************/

    /**
     * @param address Ethereum address.
     * @param chainId DeFi protocol chain ID.
     * @returns Get annual premium for current account
     */

    public async getSolaceRiskPremium(address: string, chainId: number) {
        return await axios({
            url: 'https://risk-data.solace.fi/premium', 
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            params: {
                account: address,
                chain_id: chainId,
            }
        })
        .then((response: AxiosResponse<any, any>) => {return response.data})
        .catch((error: AxiosResponse<any, any>) => {
            console.error('Error getSolaceRiskPremium', error)
            return undefined
        })
    }  

    /**
     * @param policyholder Ethereum address of policy holder.
     * @param chainId DeFi protocol chain ID.
     * @returns Get annual premium for current account
     */

    public async getSolaceRiskPremiumData(policyholder: string, chainId: number) {
       return await axios({
           url: 'https://risk-data.solace.fi/premium-data',
           method: 'GET',
           headers: {
               Accept: 'application/json',
               'Content-Type': 'application/json',
           },
           params: {
               policyholder: policyholder,
               chain_id: chainId,
           }
       })
       .then((response: AxiosResponse<any, any>) => {return response.data})
       .catch((error: AxiosResponse<any, any>) => {
           console.error('Error getSolaceRiskPremiumData', error)
           return undefined
       })
    }  
    
    /**
     * @param address Ethereum address.
     * @returns DeFi protocol balances in USD for the address. See documentation for sample response object.
     */

     public async getSolaceRiskBalances(address: string, chainIdOrChains: number | number[]): Promise<SolaceRiskBalance[] | undefined> {
        if (Array.isArray(chainIdOrChains)) chainIdOrChains.forEach(item => invariant(isNetworkSupported(item),"not a supported chainID"))

        return await axios({
            url: 'https://risk-data.solace.fi/balances', 
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            data: JSON.stringify(typeof(chainIdOrChains) == 'number' ? {
                chain_id: chainIdOrChains,
                account: address,
            } : {
                chains: chainIdOrChains,
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

    /*************************************************************
    ACCOUNTING MONITORING
    *************************************************************/

    /**
     * @param address Ethereum address.
     * @param chainId DeFi protocol chain ID.
     * @returns Get all tracking files account billing
     */
    public async getSolaceRiskTracks (address: string, chainId: number) {
        return await axios({
            url: 'https://risk-data.solace.fi/tracks',
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            params: {
                account: address,
                chain_id: chainId,
            }
        })
        .then((response: AxiosResponse<any, any>) => {return response.data})
        .catch((error: AxiosResponse<any, any>) => {
            console.error('Error getSolaceRiskTracks:', error)
            return undefined
        })
    }

    /**
     * @param chainId DeFi protocol chain ID.
     * @returns Get all billings for a chain
     */
    public async getSolaceRiskBillings_All (chainId: number) {
        return await axios({
            url: 'https://risk-data.solace.fi/billings/all',
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            params: {
                chain_id: chainId,
            }
        })
        .then((response: AxiosResponse<any, any>) => {return response.data})
        .catch((error: AxiosResponse<any, any>) => {
            console.error('Error getSolaceRiskBillings_All:', error)
            return undefined
        })
    }

    /**
     * @param address Ethereum address.
     * @param chainId DeFi protocol chain ID.
     * @returns Get all billings for a chain
     */
     public async getSolaceRiskBillings ( address: string, chainId: number, category?: 'paid' | 'unpaid') {
        return await axios({
            url: `https://risk-data.solace.fi/billings${category ? `/${category}` : ''}`,
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            params: {
                account: address,
                chain_id: chainId,
            }
        })
        .then((response: AxiosResponse<any, any>) => {return response.data})
        .catch((error: AxiosResponse<any, any>) => {
            console.error('Error getSolaceRiskBillings:', error)
            return undefined
        })
    }
}