
export enum MasterToken {
    solace = 'solace',
    xsolace = 'xsolace',
    dai = 'dai',
    usdc = 'usdc',
    usdt = 'usdt',
    eth = 'eth',
    weth = 'weth',
    btc = 'btc',
    frax = 'frax',
    near = 'near',
    aurora = 'aurora',
    matic = 'matic',
    ftm = 'ftm',
    scp = 'scp',
    slp = 'slp'
}

export const WrappedTokenToMasterToken: { [token: string]: MasterToken } = {
    ['wbtc']: MasterToken.btc,
    ['weth']: MasterToken.eth,
    ['wftm']: MasterToken.ftm,
    ['wnear']: MasterToken.near,
    ['wmatic']: MasterToken.matic
}

const SOLACE_ADDRESS: { [chainID : number]: string } = {
    [1] : "0x501acE9c35E60f03A2af4d484f49F9B1EFde9f40", // Eth Mainnet
    [4] : "0x501acE9c35E60f03A2af4d484f49F9B1EFde9f40", // Rinkeby
    [42]: '0x501acE9c35E60f03A2af4d484f49F9B1EFde9f40',
    [137] : "0x501acE9c35E60f03A2af4d484f49F9B1EFde9f40", // Polygon
    [250] : "0x501acE9c35E60f03A2af4d484f49F9B1EFde9f40",
    [4002]: "0x501ACE0C6DeA16206bb2D120484a257B9F393891",
    [80001]: '0x501acE9c35E60f03A2af4d484f49F9B1EFde9f40',
    [1313161554] : "0x501acE9c35E60f03A2af4d484f49F9B1EFde9f40", // Aurora
    [1313161555]: '0x501ACE0C6DeA16206bb2D120484a257B9F393891',
}

const XSOLACE_ADDRESS: { [chainID : number]: string } = {
    [1]: '0x501ACe802447B1Ed4Aae36EA830BFBde19afbbF9',
    [4]: '0x501ACe802447B1Ed4Aae36EA830BFBde19afbbF9',
    [42]: '0x501ACe802447B1Ed4Aae36EA830BFBde19afbbF9',
    [137]: '0x501ACe802447B1Ed4Aae36EA830BFBde19afbbF9',
    [250] : "0x501ACe802447B1Ed4Aae36EA830BFBde19afbbF9",
    [4002]: '0x501ACEF0358fb055027A89AE46387a53C75498e0',
    [80001]: '0x501ACe802447B1Ed4Aae36EA830BFBde19afbbF9',
    [1313161554]: '0x501ACe802447B1Ed4Aae36EA830BFBde19afbbF9',
    [1313161555]: '0x501ACEF0358fb055027A89AE46387a53C75498e0',
}

const DAI_ADDRESS: { [chainID : number]: string } = {
    [1]: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    [4]: '0x8ad3aA5d5ff084307d28C8f514D7a193B2Bfe725',
    [42]: '0x31a1D59460a9619ec6965a5684C6d3Ae470D0fE5',
    [137]: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
    [250] : "0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E",
    [4002]: '0xC709a8965eF42fD80b28F226E253283539ddBb12',
    [80001]: '0x829F3bc2f95E190fcf75Cca9D53ECd873404AeA4',
    [1313161554]: '0xe3520349F477A5F6EB06107066048508498A291b',
    [1313161555]: '0x87Eba7597721C156240Ae7d8aE26e269118AFdca',
}

const WETH_ADDRESS: { [chainID : number]: string } = {
    [1] : "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // Eth Mainnet
    [4]: '0xc778417E063141139Fce010982780140Aa0cD5Ab',
    [42]: '0xd0A1E359811322d97991E03f863a0C30C2cF029C',
    [137] : "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619", // Polygon
    [250] : "0x74b23882a30290451A17c44f4F05243b6b58C76d",
    [4002]: "0x82b2c5950955cfEf23AD73675F7dC8C66cE23150",
    [80001]: '0xb11CD68Cebb89E8ED0733B2C46B333Fb7a51816E',
    [1313161554] : "0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB", // Aurora
    [1313161555]: '0xfBc3957C8448824D6b7928f160331ec595D0dC0E',
}

const WBTC_ADDRESS: { [chainID : number]: string } = {
    [1] : "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", // Eth Mainnet
    [4]: '0x20fB9CDDbcA5a5EB468c76010AEc6eD4eAcc037F',
    [42]: '0x1063bf969F8D3D7296a2A94274D3df9202da2A3A',
    [137] : "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6", // Polygon
    [250] : "0x321162Cd933E2Be498Cd2267a90534A804051b11",
    [4002]: '0xe3a5001b027168dc9b4b64311fc7a9eb87363d78',
    [80001]: '0x7aD1341d3f29Cd6694fF43e284502A9eD3048E20',
    [1313161554] : "0xf4eb217ba2454613b15dbdea6e5f22276410e89e", // Aurora
    [1313161555]: '0x952349F445Ee8A2D546E1E8c963f3004A87e5f93',
}

const USDC_ADDRESS: { [chainID : number]: string } = {
    [1]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    [4]: '0x6D6DC3A8f02a1fEc0B9575e8dDE4135929Bd6e21',
    [42]: '0x512d93ADc3DF4E24cb4b26c44A91682Ec073F559',
    [137]: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    [250] : "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75",
    [4002]: '0x1EE27c7c11E12dBa0F4b3aeEF9599D51Df06bB14',
    [80001]: '0xca08aB81e4E437AcDda0E7505026bdD9A97b8B76',
    [1313161554]: '0xb12bfca5a55806aaf64e99521918a4bf0fc40802',
    [1313161555]: '0xd0062b097a077F1c9DC97aE082a7FE58a0Be03a8',
}

const USDT_ADDRESS: { [chainID : number]: string } = {
    [1]: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    [4]: '0x638b7BaA3D0C7d235fb904B01523883F980f24Ce',
    [42]: '0xAEA2B0F4763c8Ffc33A4c454CD08F803B02B6B53',
    [137]: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    [250] : "0x049d68029688eAbF473097a2fC38ef61633A3C7A",
    [4002]: '0xC382931bF0D86B0Fd04ecAC093676A61446F3E2d',
    [80001]: '0x992fbE5C6fc9d5f09F4Fd85eF1FD331df078821C',
    [1313161554]: '0x4988a896b1227218e4a686fde5eabdcabd91571f',
    [1313161555]: '0xb9D6BB8D150a566Eb93d097b9b65dc9b7455Dd67',
}

const FRAX_ADDRESS: { [chainID : number]: string } = {
    [1]: '0x853d955acef822db058eb8505911ed77f175b99e',
    [4]: '0x86E5B6485e28E52a0dEEd28Cc10772FeB9c4C400',
    [42]: '0x58B23b32a9774153E1E344762751aDfdca2764DD',
    [137]: '0x45c32fA6DF82ead1e2EF74d17b76547EDdFaFF89',
    [250] : "0xdc301622e621166BD8E82f2cA0A26c13Ad0BE355",
    [4002]: '0x87Eba7597721C156240Ae7d8aE26e269118AFdca',
    [80001]: '0xE338d08783CE3bdE2Cc03b137b196168641A8C05',
    [1313161554]: '0xda2585430fef327ad8ee44af8f1f989a2a91a3d2',
    [1313161555]: '0x5405059004A74d191a07badC3e32501ac8A39788',
}

const SCP_ADDRESS: {
    [chainId: number]: string
  } = {
    [1]: '0x501AcEe83a6f269B77c167c6701843D454E2EFA0',
    [4]: '0x501AcEe83a6f269B77c167c6701843D454E2EFA0',
    [42]: '0x501AcEe83a6f269B77c167c6701843D454E2EFA0',
  }

const WMATIC_ADDRESS: { [chainID : number]: string } = {
    [1]: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
    [137] : "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270", // Polygon
    [80001]: '0xaCCcDcEd4198c837d9A98E870F330697f94208f7',
}

const WNEAR_ADDRESS: { [chainID : number]: string } = {
    [1313161554] : "0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d", // Aurora
    [1313161555]: '0x80dAF9794A2b6f0A6B1E58c6Ae99803c028c00f8',
}

const WFTM_ADDRESS: { [chainID : number]: string } = {
    [250]: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83',
    [4002]: '0x4701b4535CDcC6541292fCef468836486D871250'
}

const AURORA_ADDRESS: { [chainID : number]: string } = {
    [1]: '0xaaaaaa20d9e0e2461697782ef11675f668207961',
    [1313161554] : "0x8BEc47865aDe3B172A928df8f990Bc7f2A3b9f79", // Aurora
    [1313161555]: '0x034c971902b0B2EF37abd249c1A5DEc5Dc5bE14B',
}

const SOLACE_USDC_SLP_ADDRESS: { [chainID : number]: string } = {
    [1] : "0x9C051F8A6648a51eF324D30C235da74D060153aC", // Eth Mainnet
    [137] : "0x38e7e05Dfd9fa3dE80dB0e7AC03AC57Fa832C78A", // Polygon
    [1313161554] : "0xdDAdf88b007B95fEb42DDbd110034C9a8e9746F2", // Aurora
}

export const TOKEN_ADDRESSES: { [token: string]: {[chainID: number]: string} }  = {
    [MasterToken.dai]: DAI_ADDRESS,
    [MasterToken.usdc]: USDC_ADDRESS,
    [MasterToken.usdt]: USDT_ADDRESS,
    [MasterToken.frax]: FRAX_ADDRESS,
    [MasterToken.btc]: WBTC_ADDRESS,
    [MasterToken.eth]: WETH_ADDRESS,
    [MasterToken.matic]: WMATIC_ADDRESS,
    [MasterToken.near]: WNEAR_ADDRESS,
    [MasterToken.aurora]: AURORA_ADDRESS,
    [MasterToken.solace]: SOLACE_ADDRESS,
    [MasterToken.xsolace]: XSOLACE_ADDRESS,
    [MasterToken.slp]: SOLACE_USDC_SLP_ADDRESS,
    [MasterToken.scp]: SCP_ADDRESS,
    [MasterToken.ftm]: WFTM_ADDRESS,
}

export const GAS_TOKEN: { [chainID : number]: string } = {
    [1] : "ethereum", // Eth Mainnet
    [137] : "matic-network", // Polygon
    [1313161554] : "ethereum", // Aurora
}


const MainnetTokenList: {[ token: string]: {name: string, symbol: string, decimals: number} } = {
    [MasterToken.dai]: {name: 'Dai Stablecoin', symbol: 'DAI', decimals: 18},
    [MasterToken.usdc]: {name: 'USD Coin', symbol: 'USDC', decimals: 6},
    [MasterToken.usdt]: {name: 'Tether USD', symbol: 'USDT', decimals: 6},
    [MasterToken.eth]: {name: 'Wrapped Ether', symbol: 'WETH', decimals: 18},
    [MasterToken.btc]: {name: 'Wrapped BTC', symbol: 'WBTC', decimals: 8},
    [MasterToken.frax]: {name: 'Frax', symbol: 'FRAX', decimals: 18},
    [MasterToken.scp]: {name: 'Solace CP Token', symbol: 'SCP', decimals: 18},
}

const RinkebyTokenList: {[ token: string]: {name: string, symbol: string, decimals: number} } = {
    [MasterToken.dai]: {name: 'Dai Stablecoin', symbol: 'DAI', decimals: 18},
    [MasterToken.usdc]: {name: 'USD Coin', symbol: 'USDC', decimals: 6},
    [MasterToken.usdt]: {name: 'Tether USD', symbol: 'USDT', decimals: 6},
    [MasterToken.eth]: {name: 'Wrapped Ether', symbol: 'WETH', decimals: 18},
    [MasterToken.btc]: {name: 'Wrapped BTC', symbol: 'WBTC', decimals: 8},
    [MasterToken.frax]: {name: 'Frax', symbol: 'FRAX', decimals: 18},
    [MasterToken.scp]: {name: 'Solace CP Token', symbol: 'SCP', decimals: 18},
}

const KovanTokenList: {[ token: string]: {name: string, symbol: string, decimals: number} } = {
    [MasterToken.dai]: {name: 'Dai Stablecoin', symbol: 'DAI', decimals: 18},
    [MasterToken.usdc]: {name: 'USD Coin', symbol: 'USDC', decimals: 6},
    [MasterToken.usdt]: {name: 'Tether USD', symbol: 'USDT', decimals: 6},
    [MasterToken.eth]: {name: 'Wrapped Ether', symbol: 'WETH', decimals: 18},
    [MasterToken.btc]: {name: 'Wrapped BTC', symbol: 'WBTC', decimals: 8},
    [MasterToken.frax]: {name: 'Frax', symbol: 'FRAX', decimals: 18},
    [MasterToken.scp]: {name: 'Solace CP Token', symbol: 'SCP', decimals: 18},
}

const PolygonTokenList: {[ token: string]: {name: string, symbol: string, decimals: number} } = {
    [MasterToken.dai]: {name: '(PoS) Dai Stablecoin', symbol: 'DAI', decimals: 18},
    [MasterToken.usdc]: {name: 'USD Coin (PoS)', symbol: 'USDC', decimals: 6},
    [MasterToken.usdt]: {name: '(PoS) Tether USD', symbol: 'USDT', decimals: 6},
    [MasterToken.weth]: {name: 'Wrapped Ether', symbol: 'WETH', decimals: 18},
    [MasterToken.btc]: {name: '(PoS) Wrapped BTC', symbol: 'WBTC', decimals: 8},
    [MasterToken.frax]: {name: 'Frax', symbol: 'FRAX', decimals: 18},
    [MasterToken.matic]: {name: 'Wrapped Matic', symbol: 'WMATIC', decimals: 18},
}

const MumbaiTokenList: {[ token: string]: {name: string, symbol: string, decimals: number} } = {
    [MasterToken.dai]: {name: '(PoS) Dai Stablecoin', symbol: 'DAI', decimals: 18},
    [MasterToken.usdc]: {name: 'USD Coin (PoS)', symbol: 'USDC', decimals: 6},
    [MasterToken.usdt]: {name: '(PoS) Tether USD', symbol: 'USDT', decimals: 6},
    [MasterToken.weth]: {name: 'Wrapped Ether', symbol: 'WETH', decimals: 18},
    [MasterToken.btc]: {name: '(PoS) Wrapped BTC', symbol: 'WBTC', decimals: 8},
    [MasterToken.frax]: {name: 'Frax', symbol: 'FRAX', decimals: 18},
    [MasterToken.matic]: {name: 'Wrapped Matic', symbol: 'WMATIC', decimals: 18},
}

const AuroraTokenList: {[ token: string]: {name: string, symbol: string, decimals: number} } = {
    [MasterToken.dai]: {name: 'Dai Stablecoin', symbol: 'DAI', decimals: 18},
    [MasterToken.usdc]: {name: 'USD Coin', symbol: 'USDC', decimals: 6},
    [MasterToken.usdt]: {name: 'Tether USD', symbol: 'USDT', decimals: 6},
    [MasterToken.eth]: {name: 'Wrapped Ether', symbol: 'WETH', decimals: 18},
    [MasterToken.btc]: {name: 'Wrapped BTC', symbol: 'WBTC', decimals: 8},
    [MasterToken.frax]: {name: 'Frax', symbol: 'FRAX', decimals: 18},
    [MasterToken.near]: {name: 'NEAR', symbol: 'NEAR', decimals: 24},
    [MasterToken.aurora]: {name: 'Aurora', symbol: 'AURORA', decimals: 18},
}

const AuroraTestnetTokenList: {[ token: string]: {name: string, symbol: string, decimals: number} } = {
    [MasterToken.dai]: {name: 'Dai Stablecoin', symbol: 'DAI', decimals: 18},
    [MasterToken.usdc]: {name: 'USD Coin', symbol: 'USDC', decimals: 6},
    [MasterToken.usdt]: {name: 'Tether USD', symbol: 'USDT', decimals: 6},
    [MasterToken.eth]: {name: 'Wrapped Ether', symbol: 'WETH', decimals: 18},
    [MasterToken.btc]: {name: 'Wrapped BTC', symbol: 'WBTC', decimals: 8},
    [MasterToken.frax]: {name: 'Frax', symbol: 'FRAX', decimals: 18},
    [MasterToken.near]: {name: 'NEAR', symbol: 'NEAR', decimals: 24},
    [MasterToken.aurora]: {name: 'Aurora', symbol: 'AURORA', decimals: 18},
}

const FantomTokenList: {[ token: string]: {name: string, symbol: string, decimals: number} } = {
    [MasterToken.dai]: {name: 'Dai Stablecoin', symbol: 'DAI', decimals: 18},
    [MasterToken.usdc]: {name: 'USD Coin', symbol: 'USDC', decimals: 6},
    [MasterToken.usdt]: {name: 'USD Token', symbol: 'USDT', decimals: 6},
    [MasterToken.weth]: {name: 'Wrapped Ether', symbol: 'WETH', decimals: 18},
    [MasterToken.btc]: {name: 'Wrapped Bitcoin', symbol: 'WBTC', decimals: 8},
    [MasterToken.frax]: {name: 'Frax', symbol: 'FRAX', decimals: 18},
    [MasterToken.ftm]: {name: 'Wrapped Fantom', symbol: 'WFTM', decimals: 18},
}

const FantomTestnetTokenList: {[ token: string]: {name: string, symbol: string, decimals: number} } = {
    [MasterToken.dai]: {name: 'Dai Stablecoin', symbol: 'DAI', decimals: 18},
    [MasterToken.usdc]: {name: 'USD Coin', symbol: 'USDC', decimals: 6},
    [MasterToken.usdt]: {name: 'USD Token', symbol: 'USDT', decimals: 6},
    [MasterToken.weth]: {name: 'Wrapped Ether', symbol: 'WETH', decimals: 18},
    [MasterToken.btc]: {name: 'Wrapped Bitcoin', symbol: 'WBTC', decimals: 8},
    [MasterToken.frax]: {name: 'Frax', symbol: 'FRAX', decimals: 18},
    [MasterToken.ftm]: {name: 'Wrapped Fantom', symbol: 'WFTM', decimals: 18},
}

export const MasterTokenList: { [chainId: number]: {[ token: string]: {name: string, symbol: string, decimals: number}} } = {
    [1]: MainnetTokenList,
    [4]: RinkebyTokenList,
    [42]: KovanTokenList,
    [137]: PolygonTokenList,
    [250]: FantomTokenList,
    [4002]: FantomTestnetTokenList,
    [80001]: MumbaiTokenList,
    [1313161554]: AuroraTokenList,
    [1313161555]: AuroraTestnetTokenList,
}
