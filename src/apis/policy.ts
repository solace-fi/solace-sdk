import { BigNumber, Contract, getDefaultProvider, providers, utils } from 'ethers'
import invariant from 'tiny-invariant'
import { DEFAULT_ENDPOINT, NETWORKS, SOLACE_COVER_PRODUCT_ADDRESS, SOLACE_COVER_PRODUCT_V2_ADDRESS, SOLACE_COVER_PRODUCT_V3_ADDRESS } from '../constants'
import { getProvider } from '../utils/ethers'
const { getNetwork } = providers

import {
    SolaceCoverProduct_ABI,
    SolaceCoverProductV2_ABI,
    SolaceCoverProductV3_ABI,
} from "../"

export class Policy {
    public async getTotalActivePolicies(chainId: number, rpcUrl?: string): Promise<{ totalPolicies: BigNumber; totalActiveCoverLimit: BigNumber }> {
        invariant(SOLACE_COVER_PRODUCT_ADDRESS[chainId] || SOLACE_COVER_PRODUCT_V2_ADDRESS[chainId] || SOLACE_COVER_PRODUCT_V3_ADDRESS[chainId],"not a supported chainID")

        let provider = null
        let solaceCoverProduct = null

        if (!rpcUrl) {
            if (DEFAULT_ENDPOINT[chainId]) {
                provider = getProvider(DEFAULT_ENDPOINT[chainId])
            } else {
                provider = getDefaultProvider(getNetwork(chainId))
            }
        } else {
            provider = getProvider(rpcUrl)
        }

        if (SOLACE_COVER_PRODUCT_V2_ADDRESS[chainId]) {
            solaceCoverProduct = new Contract(SOLACE_COVER_PRODUCT_V2_ADDRESS[chainId], SolaceCoverProductV2_ABI, provider)
        }
        else if (SOLACE_COVER_PRODUCT_V3_ADDRESS[chainId]) {
            solaceCoverProduct = new Contract(SOLACE_COVER_PRODUCT_V3_ADDRESS[chainId], SolaceCoverProductV3_ABI, provider)
        } else {
            solaceCoverProduct = new Contract(SOLACE_COVER_PRODUCT_ADDRESS[chainId], SolaceCoverProduct_ABI, provider)
        }

        let policyCount;
        let coverLimit;

        if (SOLACE_COVER_PRODUCT_V2_ADDRESS[chainId]) {
            [policyCount, coverLimit] = await Promise.all([
                solaceCoverProduct.policyCount(),
                solaceCoverProduct.activeCoverLimit()
            ])
        }
        else if (SOLACE_COVER_PRODUCT_V3_ADDRESS[chainId]) {
            [policyCount, coverLimit] = await Promise.all([
                solaceCoverProduct.totalSupply(),
                solaceCoverProduct.activeCoverLimit()
            ])
        } else {
            [policyCount, coverLimit] = await Promise.all([
                solaceCoverProduct.policyCount(),
                solaceCoverProduct.activeCoverLimit()
            ])
        }

        return {
            totalPolicies: policyCount,
            totalActiveCoverLimit: coverLimit
        }
    }

    public async getTotalActivePolicies_All(rpcUrlMapping?: {[chain: number] : string}): Promise<{ totalPolicies: BigNumber; totalActiveCoverLimit: BigNumber }> {
        const [res1, res137, res250] = await Promise.all([
            this.getTotalActivePolicies(1, rpcUrlMapping ? rpcUrlMapping[1] : undefined),
            this.getTotalActivePolicies(137, rpcUrlMapping ? rpcUrlMapping[137] : undefined),
            this.getTotalActivePolicies(250, rpcUrlMapping ? rpcUrlMapping[250] : undefined),
        ])

        return {
            totalPolicies: res1.totalPolicies.add(res137.totalPolicies).add(res250.totalPolicies),
            totalActiveCoverLimit: res1.totalActiveCoverLimit.add(res137.totalActiveCoverLimit).add(res250.totalActiveCoverLimit)
        }
    }

    public async getExistingPolicy_V2(account: string, rpcUrlMapping?: {[chain: number] : string}, includeTestnets?: boolean): Promise<{ policyId: BigNumber, chainId: number, coverLimit: BigNumber }[]> {
        invariant(utils.isAddress(account),"not an Ethereum address")

        const supportedChains = NETWORKS.filter((n) => {
            const f = n.features.general
            return f.coverageV1 || f.coverageV2
        })

        const conditionedChains = includeTestnets ? supportedChains : supportedChains.filter((n) => !n.isTestnet)

        let res: { policyId: BigNumber, chainId: number, coverLimit: BigNumber }[] = []

        async function processChain(chainId: number) {
            let provider = null
            let solaceCoverProduct = null
            if(rpcUrlMapping && rpcUrlMapping[chainId]) {
                provider = getProvider(rpcUrlMapping[chainId])
            } else {
                if (DEFAULT_ENDPOINT[chainId]) {
                    provider = getProvider(DEFAULT_ENDPOINT[chainId])
                } else {
                    provider = getDefaultProvider(getNetwork(chainId))
                }
            }
             
            if (SOLACE_COVER_PRODUCT_V2_ADDRESS[chainId]) {
                solaceCoverProduct = new Contract(SOLACE_COVER_PRODUCT_V2_ADDRESS[chainId], SolaceCoverProductV2_ABI, provider)
            } else if (SOLACE_COVER_PRODUCT_V3_ADDRESS[chainId]) {
                solaceCoverProduct = new Contract(SOLACE_COVER_PRODUCT_V3_ADDRESS[chainId], SolaceCoverProductV3_ABI, provider)
            } else {
                solaceCoverProduct = new Contract(SOLACE_COVER_PRODUCT_ADDRESS[chainId], SolaceCoverProduct_ABI, provider)
            }

            const policyId = await solaceCoverProduct.policyOf(account)

            if (policyId.gt(BigNumber.from(0))) {
                const policyCoverLimit: BigNumber = await solaceCoverProduct.coverLimitOf(policyId)
                res.push({ policyId, chainId, coverLimit: policyCoverLimit})
            }
        }

        await Promise.all(conditionedChains.map((chain) => {return processChain(chain.chainId)}))

        res.sort((a, b) => a.chainId - b.chainId)

        return res
    }
}