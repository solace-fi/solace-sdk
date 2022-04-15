import { BOND_TELLER_ADDRESSES } from "../constants";
// import { Contract as MultiCallContract, Provider } from 'ethers-multicall';
import { getDefaultProvider, providers, Contract } from "ethers";
const { getNetwork } = providers
const ethers = require('ethers')
const formatUnits = ethers.utils.formatUnits

import bondTellerEth from '../abis/BondTellerEth.json'
import bondTellerMatic from '../abis/BondTellerMatic.json'
import bondTellerErc20 from '../abis/BondTellerErc20.json'

import ERC20 from '../abis/ERC20.json'
import WETH9 from '../abis/WETH9.json'
import WMATIC from '../abis/WMATIC.json'

import { withBackoffRetries } from "../utils";
import { BondTellerDetails } from "../types/bond";
import { Price } from "./price";


export class Bond {
    public async getBondTellerData (chainId: number, apiPriceMapping: {
        [x: string]: number;
    }) {
        const price_obj = new Price()
        let provider: providers.Provider
        let fetchedPriceMapping: { [x: string]: number } = {}
        let fetchedPriceMappingPromise: Promise<typeof fetchedPriceMapping>

        if (chainId == 137) {
            provider = new providers.JsonRpcProvider("https://polygon-rpc.com")
            fetchedPriceMappingPromise = withBackoffRetries(async () => price_obj.getPolygonPrices())
        } else if (chainId == 80001) {
            provider = new providers.JsonRpcProvider("https://matic-mumbai.chainstacklabs.com")
            fetchedPriceMappingPromise = withBackoffRetries(async () => price_obj.getPolygonPrices())
        }
        else if (chainId == 1313161554) {
            provider = new providers.JsonRpcProvider("https://mainnet.aurora.dev")
            fetchedPriceMappingPromise = withBackoffRetries( async () => price_obj.getAuroraPrices())
        } 
        else if (chainId == 1313161555) {
            provider = new providers.JsonRpcProvider("https://testnet.aurora.dev")
            fetchedPriceMappingPromise = withBackoffRetries( async () => price_obj.getAuroraPrices())
        }
        else {
            provider = getDefaultProvider(getNetwork(chainId))
            fetchedPriceMappingPromise = withBackoffRetries( async () => price_obj.getMainnetPrices())
        }

        let teller: {addr: string, token: string}[] = []
        Object.keys(BOND_TELLER_ADDRESSES).forEach((key) => {
            if(BOND_TELLER_ADDRESSES[key][chainId] != undefined) {
                teller.push({addr: BOND_TELLER_ADDRESSES[key][chainId], token: key})
            }
        })

        const data = await Promise.all(teller.map(async (t) => {

            let bondTellerAbi = null

            if (t.token == 'eth' && chainId == 1 || 4 || 42 || 1313161554 || 1313161555 ) {
                bondTellerAbi = bondTellerEth
            } else if (t.token == 'matic' && chainId == 137 || 80001) {
                bondTellerAbi = bondTellerMatic
            } else {
                bondTellerAbi = bondTellerErc20
            }
    
            const tellerContract = new Contract(t.addr, bondTellerAbi, provider)

            const [principalAddr, bondPrice, vestingTermInSeconds, capacity, maxPayout, _] = await Promise.all([
                withBackoffRetries(async () => tellerContract.principal()),
                withBackoffRetries(async () => tellerContract.bondPrice()),
                withBackoffRetries(async () => tellerContract.globalVestingTerm()),
                withBackoffRetries(async () => tellerContract.capacity()),
                withBackoffRetries(async () => tellerContract.maxPayout()),
                fetchPriceMappingCache()
            ])

            async function fetchPriceMappingCache() {
                if (Object.keys(fetchedPriceMapping).length === 0) {
                    fetchedPriceMapping = await fetchedPriceMappingPromise
                } else {
                    return
                }
            }

            let principalAbi = null

            if (t.token == 'eth' && chainId == 1 || 4 || 42 || 1313161554 || 1313161555 ) {
                principalAbi = WETH9
            } else if (t.token == 'matic' && chainId == 137 || 80001) {
                principalAbi = WMATIC
            } else {
                principalAbi = ERC20
            }

            const principalContract = new Contract(principalAddr, principalAbi, provider)

            const [decimals, name, symbol] = await Promise.all([
                principalContract.decimals(),
                principalContract.name(),
                principalContract.symbol(),
            ])

            let usdBondPrice = 0
            let solacePrice = 0

            if(fetchedPriceMapping[symbol.toLowerCase()]) {
                const price: number = fetchedPriceMapping[symbol.toLowerCase()]
                usdBondPrice = price * parseFloat(formatUnits(bondPrice, decimals))
            } else {
                const price: number = apiPriceMapping[symbol.toLowerCase()]
                usdBondPrice = price * parseFloat(formatUnits(bondPrice, decimals))
            }
    
            if(fetchedPriceMapping['solace']) {
                solacePrice = fetchedPriceMapping['solace']
            }
            else {
                solacePrice = apiPriceMapping['solace']
            }
    
            const bondRoi = usdBondPrice > 0 ? ((solacePrice - usdBondPrice) * 100) / usdBondPrice : 0
    
            const d: BondTellerDetails = {
                tellerData: {
                  teller: new Contract(t.addr, bondTellerAbi, provider),
                  bondPrice,
                  usdBondPrice,
                  vestingTermInSeconds,
                  capacity,
                  maxPayout,
                  bondRoi,
                },
                principalData: {
                  principal: principalContract,
                  principalProps: {
                    symbol,
                    decimals,
                    name,
                    address: principalAddr
                  },
                },
            }
            return d
        }))
        return data
    }
}