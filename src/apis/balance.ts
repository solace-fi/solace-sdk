import { getDefaultProvider, providers, Contract, utils } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import invariant from "tiny-invariant";
const { getNetwork } = providers
import ERC20 from "../abis/ERC20.json";
import { DEFAULT_ENDPOINT } from "../constants";
import { getProvider } from "../utils/ethers";

export class SolaceBalance {

    CHAIN_IDS = [1,137,1313161554] // mainnet, polygon, aurora
    SOLACE_ADDRESS = "0x501acE9c35E60f03A2af4d484f49F9B1EFde9f40"
    ERC20ABI = ERC20

    account: string
    rpcUrlMapping: {[chain: number]: string} | undefined

    constructor (account: string, rpcUrlMapping?: {[chain: number]: string}) {
        invariant(utils.isAddress(account),"not an Ethereum address")
        // invariant(rpcUrlMapping && Object.keys(rpcUrlMapping).length > 0,"no rpcUrlMapping provided")
        this.account = account
        this.rpcUrlMapping = rpcUrlMapping
    }

    public async getSolaceBalanceOf(chainId: number) {
        invariant(this.CHAIN_IDS.includes(chainId),"not a supported chainID")

        let provider = null

        if(this.rpcUrlMapping && this.rpcUrlMapping[chainId]) {
            provider = getProvider(this.rpcUrlMapping[chainId])
        } else {
            if (chainId == 137 || chainId == 1313161554) {
                provider = getProvider(DEFAULT_ENDPOINT[chainId])
            } else {
                provider = getDefaultProvider(getNetwork(chainId))
            }
        }
        const solace = new Contract(this.SOLACE_ADDRESS, this.ERC20ABI, provider)
        const bal = await solace.balanceOf(this.account)
        return formatUnits(bal, 18)
    }

    public async getSolaceBalanceSum() {
        const promises = this.CHAIN_IDS.map(chain => this.getSolaceBalanceOf(chain))
        const balances = await Promise.all(promises)
        let sum = 0
        balances.forEach(bal => sum += parseFloat(bal))
        return sum
    }

    public async getAllSolaceBalances() {
        const promises = this.CHAIN_IDS.map(chain => this.getSolaceBalanceOf(chain))
        const balances = await Promise.all(promises)
        const res: any = {}
        for(var i = 0; i < this.CHAIN_IDS.length; ++i) {
            res[this.CHAIN_IDS[i]+""] = balances[i]
        }
        return JSON.stringify(res)    
    }
}

export class xSolaceBalance {

    CHAIN_IDS = [1,137,1313161554] // mainnet, polygon, aurora
    XSOLACE_ADDRESS = "0x501ACe802447B1Ed4Aae36EA830BFBde19afbbF9"
    ERC20ABI = ERC20

    account: string
    rpcUrlMapping: {[chain: number]: string} | undefined

    constructor (account: string, rpcUrlMapping?: {[chain: number]: string}) {
        invariant(utils.isAddress(account),"not an Ethereum address")
        // invariant(rpcUrlMapping && Object.keys(rpcUrlMapping).length > 0,"no rpcUrlMapping provided")
        this.account = account
        this.rpcUrlMapping = rpcUrlMapping
    }

    public async getXSolaceBalanceOf(chainId: number) {
        invariant(this.CHAIN_IDS.includes(chainId),"not a supported chainID")

        let provider = null

        if(this.rpcUrlMapping && this.rpcUrlMapping[chainId]) {
            provider = getProvider(this.rpcUrlMapping[chainId])
        } else {
            if (chainId == 137 || chainId == 1313161554) {
                provider = getProvider(DEFAULT_ENDPOINT[chainId])
            } else {
                provider = getDefaultProvider(getNetwork(chainId))
            }
        }
        const xsolace = new Contract(this.XSOLACE_ADDRESS, this.ERC20ABI, provider)
        const bal = await xsolace.balanceOf(this.account)
        return formatUnits(bal, 18)
    }

    public async getXSolaceBalanceSum() {
        const promises = this.CHAIN_IDS.map(chain => this.getXSolaceBalanceOf(chain))
        const balances = await Promise.all(promises)
        let sum = 0
        balances.forEach(bal => sum += parseFloat(bal))
        return sum
    }

    public async getAllXSolaceBalances() {
        const promises = this.CHAIN_IDS.map(chain => this.getXSolaceBalanceOf(chain))
        const balances = await Promise.all(promises)
        const res: any = {}
        for(var i = 0; i < this.CHAIN_IDS.length; ++i) {
            res[this.CHAIN_IDS[i]+""] = balances[i]
        }
        return JSON.stringify(res)    
    }
}