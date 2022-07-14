import { Network } from "../types"
import { MasterToken } from "./token"

const ethmainnet: Network = {
  chainId: 1,
  supportedTxTypes: [0, 2],
  nativeCurrency: {
    symbol: MasterToken.eth,
    decimals: 18
  },
  features: {
    general: {
      bondingV2: true,
      coverageV1: true,
      coverageV3: true,
      stakingRewardsV2: true,
      stakingV2: true
    }
  },
  underwritingPoolAddr: "0x5efc0d9ee3223229ce3b53e441016efc5ba83435"
}

const rinkeby: Network = {
  chainId: 4,
  supportedTxTypes: [0, 2],
  isTestnet: true,
  nativeCurrency: {
    symbol: MasterToken.eth,
    decimals: 18
  },
  features: {
    general: {
      bondingV2: true,
      coverageV1: true,
      coverageV3: true,
      stakingRewardsV2: true,
      stakingV2: true
    }
  }
}

const kovan: Network = {
  chainId: 42,
  supportedTxTypes: [0, 2],
  isTestnet: true,
  nativeCurrency: {
    symbol: MasterToken.eth,
    decimals: 18
  },
  features: {
    general: {
      bondingV2: true,
      coverageV3: true,
      stakingRewardsV2: true,
      stakingV2: true
    }
  }
}

const polygon = {
  chainId: 137,
  supportedTxTypes: [0, 2],
  nativeCurrency: {
    symbol: MasterToken.matic,
    decimals: 18
  },
  features: {
    general: {
      bondingV2: true,
      coverageV2: true,
      coverageV3: true,
      stakingRewardsV2: true,
      stakingV2: true
    }
  },
  underwritingPoolAddr: "0xd1108a800363C262774B990e9DF75a4287d5c075"
}

const polygonTestnet = {
  chainId: 80001,
  supportedTxTypes: [0, 2],
  isTestnet: true,
  nativeCurrency: {
    symbol: MasterToken.matic,
    decimals: 18
  },
  features: {
    general: {
      bondingV2: true,
      coverageV2: true,
      coverageV3: true,
      stakingRewardsV2: true,
      stakingV2: true
    }
  }
}

const aurora = {
  chainId: 1313161554,
  supportedTxTypes: [0],
  nativeCurrency: {
    symbol: MasterToken.eth,
    decimals: 18
  },
  features: {
    general: {
      bondingV2: true,
      coverageV3: true,
      stakingRewardsV2: true,
      stakingV2: true
    }
  },
  underwritingPoolAddr: "0x501ace27a074471f099fffec008bd1b151c7f7de"
}

const auroraTestnet = {
  chainId: 1313161555,
  supportedTxTypes: [0],
  isTestnet: true,
  nativeCurrency: {
    symbol: MasterToken.eth,
    decimals: 18
  },
  features: {
    general: {
      bondingV2: true,
      coverageV3: true,
      stakingRewardsV2: true,
      stakingV2: true
    }
  },
  underwritingPoolAddr: "0x501ace27a074471f099fffec008bd1b151c7f7de"
}

const fantom = {
  chainId: 250,
  supportedTxTypes: [0],
  nativeCurrency: {
    symbol: MasterToken.ftm,
    decimals: 18
  },
  features: {
    general: {
      bondingV2: true,
      coverageV2: true,
      coverageV3: true,
      stakingRewardsV2: true,
      stakingV2: true
    }
  },
  underwritingPoolAddr: "0x2971f45c0952437934B3F055C401241e5C339F93"
}

const fantomTestnet = {
  chainId: 4002,
  supportedTxTypes: [0],
  isTestnet: true,
  nativeCurrency: {
    symbol: MasterToken.ftm,
    decimals: 18
  },
  features: {
    general: {
      bondingV2: true,
      coverageV2: true,
      coverageV3: true,
      stakingRewardsV2: true,
      stakingV2: true
    }
  },
  underwritingPoolAddr: "0x2971f45c0952437934B3F055C401241e5C339F93"
}

// const avalanche = {
//     chainId: 43113,
//     supportedTxTypes: [0, 2],
//     nativeCurrency: {
//         symbol: MasterToken.avax,
//         decimals: 18
//     },
//     features: {
//         general: {},
//
//     },
// }

// const avalancheTestnet = {
//     chainId: 43113,
//     supportedTxTypes: [0, 2],
//     nativeCurrency: {
//         symbol: MasterToken.avax,
//         decimals: 18
//     },
//     features: {
//         general: {},
//
//     },
// }

export const NETWORKS: Network[] = [
  ethmainnet,
  rinkeby,
  kovan,
  polygon,
  polygonTestnet,
  aurora,
  auroraTestnet,
  fantom,
  fantomTestnet
  // avalanche,
  // avalancheTestnet,
]

export const NETWORKS_MAPPING = NETWORKS.reduce((acc, network) => {
  acc[network.chainId] = network
  return acc
}, {} as { [chainId: number]: Network })

export const isNetworkSupported = (chainID: number): boolean => {
  return NETWORKS_MAPPING[chainID] !== undefined
}

export const foundNetwork = (chainID: number): Network | undefined => {
  return NETWORKS_MAPPING[chainID]
}

export const mainnetChains = NETWORKS.filter(n => !n.isTestnet)

export const DEFAULT_ENDPOINT: { [chainID: number]: string } = {
  [137]: "https://polygon-rpc.com",
  [250]: "https://rpc.ftm.tools/",
  [4002]: "https://rpc.testnet.fantom.network/",
  [43113]: "https://api.avax-test.network/ext/bc/C/rpc",
  [43114]: "https://api.avax.network/ext/bc/C/rpc",
  [80001]: "https://matic-mumbai.chainstacklabs.com",
  [1313161554]: "https://mainnet.aurora.dev",
  [1313161555]: "https://testnet.aurora.dev/"
}
