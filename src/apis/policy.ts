import { BigNumber, Contract, getDefaultProvider, providers, utils } from 'ethers'
import invariant from 'tiny-invariant'
import { DEFAULT_ENDPOINT, SOLACE_COVER_PRODUCT_ADDRESS } from '../constants'
import { getProvider } from '../utils/ethers'
const { getNetwork } = providers

import SolaceCoverProduct from "../abis/SolaceCoverProduct.json"
import SolaceCoverProductV2 from "../abis/SolaceCoverProductV2.json"

export class Policy {
    public async getTotalActivePolicies(chainId: number): Promise<{ totalPolicies: BigNumber; totalActiveCoverLimit: BigNumber }> {
        invariant(SOLACE_COVER_PRODUCT_ADDRESS[chainId],"not a supported chainID")

        let provider = null
        let solaceCoverProduct = null
        if (chainId == ( 137 || 80001 )) {
            provider = getProvider(DEFAULT_ENDPOINT[chainId])
        } else {
            provider = getDefaultProvider(getNetwork(chainId))
        }

        if (chainId == 137 || 80001) {
            // SolaceCoverProductV2 deployed on Polygon mainnet (137) and Mumbai (80001)
            solaceCoverProduct = new Contract(SOLACE_COVER_PRODUCT_ADDRESS[chainId], SolaceCoverProductV2, provider)
        } else {
            solaceCoverProduct = new Contract(SOLACE_COVER_PRODUCT_ADDRESS[chainId], SolaceCoverProduct, provider)
        }

        const [policyCount, coverLimit] = await Promise.all([
            solaceCoverProduct.policyCount(),
            solaceCoverProduct.activeCoverLimit()
        ])

        return {
            totalPolicies: policyCount,
            totalActiveCoverLimit: coverLimit
        }
    }

    public async getTotalActivePolicies_All(): Promise<{ totalPolicies: BigNumber; totalActiveCoverLimit: BigNumber }> {
        const [res1, res137] = await Promise.all([
            this.getTotalActivePolicies(1),
            this.getTotalActivePolicies(137),
        ])

        return {
            totalPolicies: res1.totalPolicies.add(res137.totalPolicies),
            totalActiveCoverLimit: res1.totalActiveCoverLimit.add(res137.totalActiveCoverLimit)
        }
    }

    public async getExistingPolicy(account: string, includeTestnets?: boolean): Promise<{ policyId: BigNumber, chainId: number }[]> {
        invariant(utils.isAddress(account),"not an Ethereum address")

        const supportedChains = [1, 4, 137, 80001]

        const conditionedChains = includeTestnets ? supportedChains : [1, 137]

        let res: {policyId: BigNumber, chainId: number}[] = []

        async function processChain(chainId: number) {
            let provider = null
            let solaceCoverProduct = null
            if (chainId == ( 137 || 80001 )) {
                provider = getProvider(DEFAULT_ENDPOINT[chainId])
            } else {
                provider = getDefaultProvider(getNetwork(chainId))
            }
            
            if (chainId == ( 137 || 80001 )) {
                // SolaceCoverProductV2 deployed on Polygon mainnet (137) and Mumbai (80001)
                solaceCoverProduct = new Contract(SOLACE_COVER_PRODUCT_ADDRESS[chainId], SolaceCoverProductV2, provider)
            } else {
                solaceCoverProduct = new Contract(SOLACE_COVER_PRODUCT_ADDRESS[chainId], SolaceCoverProduct, provider)
            }

            const policyId = await solaceCoverProduct.policyOf(account)

            if (policyId.gt(BigNumber.from(0))) {
                res.push({ policyId, chainId })
            }
        }

        await Promise.all(conditionedChains.map((chain) => {return processChain(chain)}))

        res.sort((a, b) => a.chainId - b.chainId)

        return res
    }
}