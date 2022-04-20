import { BOND_TELLER_ADDRESSES, MasterTokenList, isNetworkSupported } from "../constants";
import { getDefaultProvider, providers, Contract, utils, BigNumber } from "ethers";

const { getNetwork } = providers
const ethers = require('ethers')
const formatUnits = ethers.utils.formatUnits

import bondTellerEth from '../abis/BondTellerEth.json'
import bondTellerMatic from '../abis/BondTellerMatic.json'
import bondTellerErc20 from '../abis/BondTellerErc20.json'

import ERC20 from '../abis/ERC20.json'
import WETH9 from '../abis/WETH9.json'
import WMATIC from '../abis/WMATIC.json'

import BondTellerErc20 from "../abis/BondTellerErc20.json"
import BondTellerEth from "../abis/BondTellerEth.json"
import BondTellerMatic from "../abis/BondTellerMatic.json"

import { withBackoffRetries } from "../utils";
import { BondTellerDetails, BondToken } from "../types/bond";
import { Price } from "./price";
import { getProvider } from "../utils/ethers";
import { listTokensOfOwner } from "../utils/contract";
import invariant from "tiny-invariant";


export class Bond {
    provider: providers.Provider
    chainId: number

    constructor(chainId: number) {
        if (chainId == 137) {
            this.provider = getProvider("https://polygon-rpc.com")
        } else if (chainId == 80001) {
            this.provider = getProvider("https://matic-mumbai.chainstacklabs.com")
        }
        else if (chainId == 1313161554) {
            this.provider = getProvider("https://mainnet.aurora.dev")
        } 
        else if (chainId == 1313161555) {
            this.provider = getProvider("https://testnet.aurora.dev")
        }
        else {
            this.provider = getDefaultProvider(getNetwork(chainId))
        }
        this.chainId = chainId
    }

    public async getBondTellerData (apiPriceMapping: {
        [x: string]: number;
    }) {
        const price_obj = new Price()
        let fetchedPriceMapping: { [x: string]: number } = {}
        let fetchedPriceMappingPromise: Promise<typeof fetchedPriceMapping>

        if (this.chainId == 137) {
            fetchedPriceMappingPromise = withBackoffRetries(async () => price_obj.getPolygonPrices())
        } else if (this.chainId == 80001) {
            fetchedPriceMappingPromise = withBackoffRetries(async () => price_obj.getPolygonPrices())
        }
        else if (this.chainId == 1313161554) {
            fetchedPriceMappingPromise = withBackoffRetries( async () => price_obj.getAuroraPrices())
        } 
        else if (this.chainId == 1313161555) {
            fetchedPriceMappingPromise = withBackoffRetries( async () => price_obj.getAuroraPrices())
        }
        else {
            fetchedPriceMappingPromise = withBackoffRetries( async () => price_obj.getMainnetPrices())
        }

        let teller: {addr: string, type: 'erc20' | 'matic' | 'eth', token: string}[] = []

        Object.keys(BOND_TELLER_ADDRESSES).forEach((key) => {
            if(BOND_TELLER_ADDRESSES[key][this.chainId] != undefined) {
                teller.push({addr: BOND_TELLER_ADDRESSES[key][this.chainId].addr, type: BOND_TELLER_ADDRESSES[key][this.chainId].type, token: key})
            }
        })

        const data = await Promise.all(teller.map(async (t) => {
            let bondTellerAbi = null

            if (t.token == 'eth' && this.chainId == 1 || 4 || 42 || 1313161554 || 1313161555 ) {
                bondTellerAbi = bondTellerEth
            } else if (t.token == 'matic' && this.chainId == 137 || 80001) {
                bondTellerAbi = bondTellerMatic
            } else {
                bondTellerAbi = bondTellerErc20
            }
    
            const tellerContract = new Contract(t.addr, bondTellerAbi, this.provider)

            const [principalAddr, bondPrice, vestingTermInSeconds, capacity, maxPayout] = await Promise.all([
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

            if (t.token == 'eth' && this.chainId == 1 || 4 || 42 || 1313161554 || 1313161555 ) {
                principalAbi = WETH9
            } else if (t.token == 'matic' && this.chainId == 137 || 80001) {
                principalAbi = WMATIC
            } else {
                principalAbi = ERC20
            }

            const principalContract = new Contract(principalAddr, principalAbi, this.provider)

            const {decimals, name, symbol} = MasterTokenList[this.chainId][t.token]

            let usdBondPrice = 0
            let solacePrice = 0

            // Why do we are we repeating network calls: 
            // getCoingeckoPrice() to obtain the parameter - apiPriceMapping
            // Then getMainnetPrices/getAuroraPrices/getPolygonPrices again within this function
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
                  teller: {contract: new Contract(t.addr, bondTellerAbi, this.provider), type: t.type},
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

    public async getUserBondData(bondTellerContract: Contract, account: string, token?: string): Promise<BondToken[]> {
        invariant(isNetworkSupported(this.chainId),"not a supported chainID")
        invariant(utils.isAddress(account),"account must be a valid address")
        invariant(() => {
            let found = false
            Object.keys(BOND_TELLER_ADDRESSES).forEach((key) => {
                if(BOND_TELLER_ADDRESSES[key][this.chainId] != undefined) {
                    if(BOND_TELLER_ADDRESSES[key][this.chainId].addr == bondTellerContract.address) {
                        found = true
                    }
                }
            })
            return found
        }, 'must provide valid bond teller contract')
        
        if ( token ) { invariant(token && BOND_TELLER_ADDRESSES[token][this.chainId] ,"not a supported token") }

        let bondTeller: Contract | null = null

        if (token) {
            if (token.toLowerCase() === "eth") {
                bondTeller = new Contract(BOND_TELLER_ADDRESSES[token][this.chainId].addr, BondTellerEth, this.provider)
            } else if (token.toLowerCase() === "matic") {
                bondTeller = new Contract(BOND_TELLER_ADDRESSES[token][this.chainId].addr, BondTellerMatic, this.provider)
            } else {
                bondTeller = new Contract(BOND_TELLER_ADDRESSES[token][this.chainId].addr, BondTellerErc20, this.provider)
            }
        } else {
            bondTeller = bondTellerContract
        }

        // 2 consecutive await calls within listTokensOfOwner
        // Can do it in one, however public Polygon RPC does not allow fetching event logs
        const ownedTokenIds: BigNumber[] = await listTokensOfOwner(bondTeller, account)

        // 1 await call, for a total of 3
        const ownedBondData = await Promise.all(ownedTokenIds.map((tokenId) => {return bondTeller?.bonds(tokenId)}))

        const ownedBonds: BondToken[] = ownedTokenIds.map((id, idx) => {
            return {
              id,
              payoutAmount: ownedBondData[idx].payoutAmount,
              payoutAlreadyClaimed: ownedBondData[idx].payoutAlreadyClaimed,
              principalPaid: ownedBondData[idx].principalPaid,
              vestingStart: ownedBondData[idx].vestingStart,
              localVestingTerm: ownedBondData[idx].localVestingTerm,
            }
        })

        return ownedBonds
    }
}