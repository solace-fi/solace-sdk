import { getDefaultProvider, providers, Contract } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import invariant from "tiny-invariant";
const { getNetwork } = providers
import ERC20 from "../abis/ERC20.json";
import { DEFAULT_ENDPOINT } from "../constants";
import { getProvider } from "../utils/ethers";
import { MulticallContract, MulticallProvider } from "../utils/multicall";

export class TotalSupply {
    CHAIN_IDS = [1,137,1313161554] // mainnet, polygon, aurora
    SOLACE_ADDRESS = "0x501acE9c35E60f03A2af4d484f49F9B1EFde9f40"
    XSOLACE_ADDRESS = "0x501ACe802447B1Ed4Aae36EA830BFBde19afbbF9"
    ERC20ABI = ERC20

    public async getTotalSupply(chainId: number, token: 'SOLACE' | 'XSOLACE', providerOrSigner?: providers.Provider | providers.JsonRpcSigner): Promise<string> {
        invariant(this.CHAIN_IDS.includes(chainId), `chainId must be one of ${this.CHAIN_IDS}`)
        let provider = null
        if (!providerOrSigner) {
            if (chainId == 137 || chainId == 1313161554) {
                provider = getProvider(DEFAULT_ENDPOINT[chainId])
            } else {
                provider = getDefaultProvider(getNetwork(chainId))
            }
        } else {
            provider = providerOrSigner
        }

        const contract = new Contract(token == 'SOLACE' ? this.SOLACE_ADDRESS : this.XSOLACE_ADDRESS, this.ERC20ABI, provider)
        const bal = await contract.totalSupply()
        return formatUnits(bal, 18)
    }

    public async getTotalSupplySum(token: 'SOLACE' | 'XSOLACE') {
        invariant(token == 'SOLACE' || 'XSOLACE', `token must be one of 'SOLACE' or 'XSOLACE'`)
        const promises = this.CHAIN_IDS.map(chain => this.getTotalSupply(chain, token))
        const balances = await Promise.all(promises)
        let sum = 0
        balances.forEach(bal => sum += parseFloat(bal))
        return sum
    }

    public async getTotalSupplyAll(token: 'SOLACE' | 'XSOLACE') {
        invariant(token == 'SOLACE' || 'XSOLACE', `token must be one of 'SOLACE' or 'XSOLACE'`)
        const promises = this.CHAIN_IDS.map(chain => this.getTotalSupply(chain, token))
        const balances = await Promise.all(promises)
        const res: any = {}
        for(var i = 0; i < this.CHAIN_IDS.length; ++i) {
            res[this.CHAIN_IDS[i]+""] = balances[i]
        }
        return JSON.stringify(res)
    }
}

export class CirculatingSupply {
    CHAIN_IDS = [1,137,1313161554] // mainnet, polygon, aurora
    SOLACE_ADDRESS = "0x501acE9c35E60f03A2af4d484f49F9B1EFde9f40"
    XSOLACE_ADDRESS = "0x501ACe802447B1Ed4Aae36EA830BFBde19afbbF9"
    ERC20ABI = ERC20

    skipSolaceAddrs: {[key: string]: any} = {
        "1": {
            "0xf075334Df87f0a5d9fe6381b5035b60f384D6c2c": "launch DAO",
            "0xc47911f768c6fE3a9fe076B95e93a33Ed45B7B34": "core multisig",
            "0x5efC0d9ee3223229Ce3b53e441016efC5BA83435": "underwriting pool",
            "0x88fdDCe9aD3C5A12c06B597F0948F8EafFC3862d": "premium pool",
            "0x23Ddd3e3692d1861Ed57EDE224608875809e127f": "rainbow bridge",
            "0x40ec5B33f54e0E8A33A975908C5BA1c14e5BbbDf": "polygon pos bridge"
        },
        "137": {
            "0x4999d2076Ec9388a742A400B7632B8A07d59ae06": "core multisig",
            "0xd1108a800363C262774B990e9DF75a4287d5c075": "underwriting pool",
            "0x37cd57c6C7243455aC66631cE37Bb7F977C71442": "premium pool",
            "0x501acE01AB2A6Cf9eCb54071038Dea19D2Aa5Ee3": "bridge wrapper"
        },
        "1313161554" : {
            "0x21afD3bCDa49c125a72ef123Af86d3133b6565Be": "core multisig",
            "0x4A6B0f90597e7429Ce8400fC0E2745Add343df78": "underwriting pool",
            "0x0436C20030d0C2e278E7e8e4b42D304a6420D3bb": "premium pool",
            "0x501ACE45014539C5574055794d8a82A3d31fcb54": "bridge wrapper"
        }
    }

    skipXSolaceAddrs: {[key: string]: any} = {"1":{},"137":{},"1313161554":{}}

    public async getCirculatingSupply(chainId: number, token: 'SOLACE' | 'XSOLACE', provider?: providers.Provider) {
        invariant(this.CHAIN_IDS.includes(chainId), `chainId must be one of ${this.CHAIN_IDS}`)
        invariant(token == 'SOLACE' || 'XSOLACE', `token must be one of 'SOLACE' or 'XSOLACE'`)

        let _provider = null

        if (!provider) {
            if (chainId == 137 || chainId == 1313161554) {
                _provider = new MulticallProvider(getProvider(DEFAULT_ENDPOINT[chainId]), chainId)
            } else {
                _provider = new MulticallProvider(getDefaultProvider(getNetwork(chainId)), chainId)
            }
        } else {
            _provider = new MulticallProvider(provider, chainId)
        }

        const contract = new MulticallContract(token == 'SOLACE' ? this.SOLACE_ADDRESS : this.XSOLACE_ADDRESS, this.ERC20ABI)
        const supplyPromise = contract.totalSupply()
        const balancePromises = Object.keys((token == 'SOLACE' ? this.skipSolaceAddrs : this.skipXSolaceAddrs)[chainId+""]).map(addr => contract.balanceOf(addr))
        let promises = [supplyPromise, ...balancePromises]
        let [supply, ...balances] = await _provider.all(promises)
        balances.forEach(b => supply = supply.sub(b));
        return formatUnits(supply, 18)
    }

     public async getCirculatingSupplySum(token: 'SOLACE' | 'XSOLACE') {
        invariant(token == 'SOLACE' || 'XSOLACE', `token must be one of 'SOLACE' or 'XSOLACE'`)
        const promises = this.CHAIN_IDS.map(chain => this.getCirculatingSupply(chain, token))
        const balances = await Promise.all(promises)
        let sum = 0
        balances.forEach(bal => sum += parseFloat(bal))
        return sum
    }

    public async getCirculatingSupplyAll(token: 'SOLACE' | 'XSOLACE') {
        invariant(token == 'SOLACE' || 'XSOLACE', `token must be one of 'SOLACE' or 'XSOLACE'`)
        const promises = this.CHAIN_IDS.map(chain => this.getCirculatingSupply(chain, token))
        const balances = await Promise.all(promises)
        const res: any = {}
        for(var i = 0; i < this.CHAIN_IDS.length; ++i) {
            res[this.CHAIN_IDS[i]+""] = balances[i]
        }
        return JSON.stringify(res)
    }
}