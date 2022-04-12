import { getDefaultProvider, providers, Contract } from "ethers";
import { formatUnits } from "ethers/lib/utils";
const { getNetwork } = providers
import ERC20 from "../abis/ERC20.json";

export class SolaceBalance {

    CHAIN_IDS = [1,137,1313161554] // mainnet, polygon, aurora
    SOLACE_ADDRESS = "0x501acE9c35E60f03A2af4d484f49F9B1EFde9f40"
    ERC20ABI = ERC20

    public async getSolaceBalanceOf(chainId: number, account: string) {

        let provider = null
        if (chainId == 137) {
            provider = new providers.JsonRpcProvider("https://polygon-rpc.com")
        } else if (chainId == 1313161554) {
            provider = new providers.JsonRpcProvider("https://mainnet.aurora.dev")
        } else {
            provider = getDefaultProvider(getNetwork(chainId))
        }
        const solace = new Contract(this.SOLACE_ADDRESS, this.ERC20ABI, provider)
        const bal = await solace.balanceOf(account)
        return formatUnits(bal, 18)
    }

    public async getSolaceBalanceSum(account: string) {
        const promises = this.CHAIN_IDS.map(chain => this.getSolaceBalanceOf(chain, account))
        const balances = await Promise.all(promises)
        let sum = 0
        balances.forEach(bal => sum += parseFloat(bal))
        return sum
    }

    public async getAllSolaceBalances(account: string) {
        const promises = this.CHAIN_IDS.map(chain => this.getSolaceBalanceOf(chain, account))
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

    public async getXSolaceBalanceOf(chainId: number, account: string) {

        let provider = null
        if (chainId == 137) {
            provider = new providers.JsonRpcProvider("https://polygon-rpc.com")
        } else if (chainId == 1313161554) {
            provider = new providers.JsonRpcProvider("https://mainnet.aurora.dev")
        } else {
            provider = getDefaultProvider(getNetwork(chainId))
        }
        const xsolace = new Contract(this.XSOLACE_ADDRESS, this.ERC20ABI, provider)
        const bal = await xsolace.balanceOf(account)
        return formatUnits(bal, 18)
    }

    public async getXSolaceBalanceSum(account: string) {
        const promises = this.CHAIN_IDS.map(chain => this.getXSolaceBalanceOf(chain, account))
        const balances = await Promise.all(promises)
        let sum = 0
        balances.forEach(bal => sum += parseFloat(bal))
        return sum
    }

    public async getAllXSolaceBalances(account: string) {
        const promises = this.CHAIN_IDS.map(chain => this.getXSolaceBalanceOf(chain, account))
        const balances = await Promise.all(promises)
        const res: any = {}
        for(var i = 0; i < this.CHAIN_IDS.length; ++i) {
            res[this.CHAIN_IDS[i]+""] = balances[i]
        }
        return JSON.stringify(res)    
    }
}