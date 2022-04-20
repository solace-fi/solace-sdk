import { BOND_TELLER_ADDRESSES, DEFAULT_ENDPOINT, isNetworkSupported } from "../constants";
// import { Contract as MultiCallContract, Provider } from 'ethers-multicall';
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
    providerOrSigner: providers.JsonRpcSigner | providers.Provider
    chainId: number

    constructor(chainId: number, providerOrSigner?: providers.JsonRpcSigner | providers.Provider) {
        invariant(isNetworkSupported(chainId),"not a supported chainID")
        if (!providerOrSigner) {
            if (DEFAULT_ENDPOINT[chainId]) {
                this.providerOrSigner = getProvider(DEFAULT_ENDPOINT[chainId])
            } else {
                this.providerOrSigner = getDefaultProvider(getNetwork(chainId))
            }
        } else {
            this.providerOrSigner = providerOrSigner
        }

        this.chainId = chainId
    }

    public async getBondTellerData (apiPriceMapping: {
        [x: string]: number;
    }): Promise<BondTellerDetails[]> {
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
            let principalAbi = null

            if (t.token == 'eth' && this.chainId == 1 || 4 || 42 || 1313161554 || 1313161555 ) {
                bondTellerAbi = bondTellerEth
                principalAbi = WETH9
            } else if (t.token == 'matic' && this.chainId == 137 || 80001) {
                bondTellerAbi = bondTellerMatic
                principalAbi = WMATIC
            } else {
                bondTellerAbi = bondTellerErc20
                principalAbi = ERC20
            }
    
            const tellerContract = new Contract(t.addr, bondTellerAbi, this.providerOrSigner)

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

            const principalContract = new Contract(principalAddr, principalAbi, this.providerOrSigner)

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
                  teller: {contract: new Contract(t.addr, bondTellerAbi, this.providerOrSigner), type: t.type},
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

    public async getUserBondData(bondTellerContractAddress: string, type: 'erc20' | 'eth' | 'matic', account: string): Promise<BondToken[]> {
        invariant(utils.isAddress(account),"account must be a valid address")
        let storedType = 'erc20'
        let found = false
        Object.keys(BOND_TELLER_ADDRESSES).forEach((key) => {
            if(BOND_TELLER_ADDRESSES[key][this.chainId] != undefined) {
                if(BOND_TELLER_ADDRESSES[key][this.chainId].addr.toLowerCase() == bondTellerContractAddress.toLowerCase()) {
                    storedType = BOND_TELLER_ADDRESSES[key][this.chainId].type
                    found = true
                }
            }
        })
        invariant(found, 'must provide valid bond teller contract address for this chain')
        invariant(storedType === type, 'type must match the type of the bond teller contract')

        let bondTeller: Contract | null = null

        if (type === "eth") {
            bondTeller = new Contract(bondTellerContractAddress, BondTellerEth, this.providerOrSigner)
        } else if (type === "matic") {
            bondTeller = new Contract(bondTellerContractAddress, BondTellerMatic, this.providerOrSigner)
        } else {
            bondTeller = new Contract(bondTellerContractAddress, BondTellerErc20, this.providerOrSigner)
        }

        const ownedTokenIds: BigNumber[] = await listTokensOfOwner(bondTeller, account)

        const ownedBondData: any[] = ownedTokenIds.map(async (id) => await bondTeller?.bonds(id))

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