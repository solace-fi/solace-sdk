import invariant from 'tiny-invariant'
import axios, { AxiosResponse } from "axios"
import { isNetworkSupported } from '../constants'
import { SolaceRiskBalance, SolaceRiskScore, SolaceRiskSeries } from '../types'

export class Risk {
    
    /**
     * @param address Ethereum address.
     * @returns DeFi protocol balances in USD for the address. See documentation for sample response object.
     */
     public async getSolaceRiskBalances(address: string, chainId: number): Promise<SolaceRiskBalance[] | undefined | unknown > {
        return await axios({
            url: 'https://risk-data.solace.fi/balances', 
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({
                chain_id: chainId,
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
        chains.forEach(item => invariant(isNetworkSupported(item),"not a supported chainID"))

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