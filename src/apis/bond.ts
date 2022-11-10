import {
  BOND_TELLER_ADDRESSES,
  MasterTokenList,
  DEFAULT_ENDPOINT,
  WrappedTokenToMasterToken,
  foundNetwork,
  NETWORKS
} from "../constants"
import { getDefaultProvider, providers, Contract, utils, BigNumber } from "ethers"

const { getNetwork } = providers
const ethers = require("ethers")
const formatUnits = ethers.utils.formatUnits

import {
  BondTellerEth_ABI,
  BondTellerMatic_ABI,
  BondTellerErc20_ABI,
  BondTellerFtm_ABI,
  ERC20_ABI,
  WETH9_ABI,
  WMATIC_ABI,
  WFTM_ABI
} from "../"

import { withBackoffRetries } from "../utils"
import { BondTellerDetails, BondToken, BondTellerType } from "../types/bond"
import { getProvider } from "../utils/ethers"
import { listTokensOfOwner } from "../utils/contract"
import invariant from "tiny-invariant"

export class Bond {
  providerOrSigner: providers.JsonRpcSigner | providers.Provider
  chainId: number

  constructor(chainId: number, providerOrSigner?: providers.JsonRpcSigner | providers.Provider) {
    invariant(foundNetwork(chainId)?.features.general.bondingV2, "not a supported chainID")
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

  public async getBondTellerData(apiPriceMapping: { [x: string]: number }): Promise<BondTellerDetails[]> {
    let tellers: { addr: string; type: BondTellerType; token: string }[] = []

    Object.keys(BOND_TELLER_ADDRESSES).forEach(key => {
      if (BOND_TELLER_ADDRESSES[key][this.chainId] != undefined) {
        tellers.push({
          addr: BOND_TELLER_ADDRESSES[key][this.chainId].addr,
          type: BOND_TELLER_ADDRESSES[key][this.chainId].type,
          token: key
        })
      }
    })

    const data = await Promise.all(
      tellers.map(async t => {
        let bondTellerAbi = null
        let principalAbi = null

        if (
          t.token == "eth" &&
          NETWORKS.filter(c => c.nativeCurrency.symbol == "eth")
            .map(c => c.chainId)
            .includes(this.chainId)
        ) {
          bondTellerAbi = BondTellerEth_ABI
          principalAbi = WETH9_ABI
        }
        if (
          t.token == "matic" &&
          NETWORKS.filter(c => c.nativeCurrency.symbol == "matic")
            .map(c => c.chainId)
            .includes(this.chainId)
        ) {
          bondTellerAbi = BondTellerMatic_ABI
          principalAbi = WMATIC_ABI
        }
        if (
          t.token == "ftm" &&
          NETWORKS.filter(c => c.nativeCurrency.symbol == "ftm")
            .map(c => c.chainId)
            .includes(this.chainId)
        ) {
          bondTellerAbi = BondTellerFtm_ABI
          principalAbi = WFTM_ABI
        }
        if (bondTellerAbi == null || principalAbi == null) {
          bondTellerAbi = BondTellerErc20_ABI
          principalAbi = ERC20_ABI
        }

        const tellerContract = new Contract(t.addr, bondTellerAbi, this.providerOrSigner)

        const [principalAddr, bondPrice, vestingTermInSeconds, capacity, maxPayout] = await Promise.all([
          withBackoffRetries(async () => tellerContract.principal()),
          withBackoffRetries(async () => tellerContract.bondPrice()),
          withBackoffRetries(async () => tellerContract.globalVestingTerm()),
          withBackoffRetries(async () => tellerContract.capacity()),
          withBackoffRetries(async () => tellerContract.maxPayout())
        ])

        const principalContract = new Contract(principalAddr, principalAbi, this.providerOrSigner)

        console.log(MasterTokenList[this.chainId][t.token], this.chainId, t.token)

        const { decimals, name, symbol } = MasterTokenList[this.chainId][t.token]

        let usdBondPrice = 0
        let solacePrice = 0

        const price: number = apiPriceMapping[WrappedTokenToMasterToken[symbol.toLowerCase()] ?? symbol.toLowerCase()]
        usdBondPrice = price * parseFloat(formatUnits(bondPrice, decimals))

        solacePrice = apiPriceMapping["solace"]

        const bondRoi = usdBondPrice > 0 ? ((solacePrice - usdBondPrice) * 100) / usdBondPrice : 0

        const d: BondTellerDetails = {
          tellerData: {
            teller: { contract: new Contract(t.addr, bondTellerAbi, this.providerOrSigner), type: t.type },
            bondPrice,
            usdBondPrice,
            vestingTermInSeconds,
            capacity,
            maxPayout,
            bondRoi
          },
          principalData: {
            principal: principalContract,
            principalProps: {
              symbol,
              decimals,
              name,
              address: principalAddr
            }
          }
        }

        return d
      })
    )

    return data
  }

  public async getUserBondData(bondTellerContractAddress: string, account: string): Promise<BondToken[]> {
    invariant(utils.isAddress(account), "account must be a valid address")
    let storedType = "erc20"
    let found = false
    Object.keys(BOND_TELLER_ADDRESSES).forEach(key => {
      if (BOND_TELLER_ADDRESSES[key][this.chainId] != undefined) {
        if (BOND_TELLER_ADDRESSES[key][this.chainId].addr.toLowerCase() == bondTellerContractAddress.toLowerCase()) {
          storedType = BOND_TELLER_ADDRESSES[key][this.chainId].type
          found = true
        }
      }
    })
    invariant(found, "must provide valid bond teller contract address for this chain")

    let bondTeller: Contract | null = null

    if (String(storedType) === "eth") {
      bondTeller = new Contract(bondTellerContractAddress, BondTellerEth_ABI, this.providerOrSigner)
    } else if (String(storedType) === "matic") {
      bondTeller = new Contract(bondTellerContractAddress, BondTellerMatic_ABI, this.providerOrSigner)
    } else if (String(storedType) === "ftm") {
      bondTeller = new Contract(bondTellerContractAddress, BondTellerFtm_ABI, this.providerOrSigner)
    } else {
      bondTeller = new Contract(bondTellerContractAddress, BondTellerErc20_ABI, this.providerOrSigner)
    }

    // 2 consecutive await calls within listTokensOfOwner
    // Can do it in one, however public Polygon RPC does not allow fetching event logs
    const ownedTokenIds: BigNumber[] = await listTokensOfOwner(bondTeller, account)

    // 1 await call, for a total of 3
    const ownedBondData = await Promise.all(
      ownedTokenIds.map(tokenId => {
        return bondTeller?.bonds(tokenId)
      })
    )

    const ownedBonds: BondToken[] = ownedTokenIds.map((id, idx) => {
      return {
        id,
        payoutAmount: ownedBondData[idx].payoutAmount,
        payoutAlreadyClaimed: ownedBondData[idx].payoutAlreadyClaimed,
        principalPaid: ownedBondData[idx].principalPaid,
        vestingStart: ownedBondData[idx].vestingStart,
        localVestingTerm: ownedBondData[idx].localVestingTerm
      }
    })

    return ownedBonds
  }
}
