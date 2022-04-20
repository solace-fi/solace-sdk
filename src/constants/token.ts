export const SOLACE_ADDRESS: { [chainID : number]: string } = {
    [1] : "0x501acE9c35E60f03A2af4d484f49F9B1EFde9f40", // Eth Mainnet
    [4] : "0x501acE9c35E60f03A2af4d484f49F9B1EFde9f40", // Rinkeby
    [137] : "0x501acE9c35E60f03A2af4d484f49F9B1EFde9f40", // Polygon
    [1313161554] : "0x501acE9c35E60f03A2af4d484f49F9B1EFde9f40", // Aurora
}

export const DAI_ADDRESS: { [chainID : number]: string } = {
    [1] : "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    [4] : "0x8ad3aA5d5ff084307d28C8f514D7a193B2Bfe725",
    [137] : "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
    [1313161554] : "0xe3520349F477A5F6EB06107066048508498A291b",
}

const WETH_ADDRESS: { [chainID : number]: string } = {
    [1] : "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // Eth Mainnet
    [137] : "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619", // Polygon
    [1313161554] : "0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB", // Aurora
}

const WBTC_ADDRESS: { [chainID : number]: string } = {
    [1] : "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", // Eth Mainnet
    [137] : "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6", // Polygon
    [1313161554] : "0xf4eb217ba2454613b15dbdea6e5f22276410e89e", // Aurora
}

const USDC_ADDRESS: { [chainID : number]: string } = {
    [1] : "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // Eth Mainnet
    [137] : "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", // Polygon
    [1313161554] : "0xB12BFcA5A55806AaF64E99521918A4bf0fC40802", // Aurora
}

const USDT_ADDRESS: { [chainID : number]: string } = {
    [1] : "0xdAC17F958D2ee523a2206206994597C13D831ec7", // Eth Mainnet
    [137] : "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", // Polygon
    [1313161554] : "0x4988a896b1227218e4A686fdE5EabdcAbd91571f", // Aurora
}

const FRAX_ADDRESS: { [chainID : number]: string } = {
    [1] : "0x853d955aCEf822Db058eb8505911ED77F175b99e", // Eth Mainnet
    [137] : "0x45c32fA6DF82ead1e2EF74d17b76547EDdFaFF89", // Polygon
    [1313161554] : "0xDA2585430fEf327aD8ee44Af8F1f989a2A91A3d2", // Aurora, actual FRAX address on Aurora
}

export const SCP_ADDRESS: {
    [chainId: number]: string
  } = {
    [1]: '0x501AcEe83a6f269B77c167c6701843D454E2EFA0',
    [4]: '0x501AcEe83a6f269B77c167c6701843D454E2EFA0',
    [42]: '0x501AcEe83a6f269B77c167c6701843D454E2EFA0',
  }

const WMATIC_ADDRESS: { [chainID : number]: string } = {
    [1]: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
    [137] : "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270", // Polygon
}

const WNEAR_ADDRESS: { [chainID : number]: string } = {
    [1313161554] : "0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d", // Aurora
}

const AURORA_ADDRESS: { [chainID : number]: string } = {
    [1]: '0xaaaaaa20d9e0e2461697782ef11675f668207961',
    [1313161554] : "0x8BEc47865aDe3B172A928df8f990Bc7f2A3b9f79", // Aurora
}

export const SOLACE_USDC_SLP_ADDRESS: { [chainID : number]: string } = {
    [1] : "0x9C051F8A6648a51eF324D30C235da74D060153aC", // Eth Mainnet
    [137] : "0x38e7e05Dfd9fa3dE80dB0e7AC03AC57Fa832C78A", // Polygon
    [1313161554] : "0xdDAdf88b007B95fEb42DDbd110034C9a8e9746F2", // Aurora
}

export const TOKEN_ADDRESSES: { [token: string]: {[chainID: number]: string} }  = {
    ["dai"]: DAI_ADDRESS,
    ["usdc"]: USDC_ADDRESS,
    ["usdt"]: USDT_ADDRESS,
    ["frax"]: FRAX_ADDRESS,
    ["wbtc"]: WBTC_ADDRESS,
    ["weth"]: WETH_ADDRESS,
    ["wmatic"]: WMATIC_ADDRESS,
    ["wnear"]: WNEAR_ADDRESS,
    ["aurora"]: AURORA_ADDRESS,
    ["solace"]: SOLACE_ADDRESS,
    ["slp"]: SOLACE_USDC_SLP_ADDRESS,
    ['scp']: SCP_ADDRESS,
}

export const GAS_TOKEN: { [chainID : number]: string } = {
    [1] : "ethereum", // Eth Mainnet
    [137] : "matic-network", // Polygon
    [1313161554] : "ethereum", // Aurora
}