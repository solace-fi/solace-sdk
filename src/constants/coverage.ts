export const SOLACE_COVER_PRODUCT_ADDRESS: { [chainID: number]: string } = {
    [1]: "0x501ACEbe29eabc346779BcB5Fd62Eaf6Bfb5320E",
    [4]: "0x501AcE125346445b04A7c414C55a3d18d51Bf547",
    [137]: "0x501AcEC83d440c00644cA5C48d059e1840852a64",
    [4002]: "0x501ACe36fF9078aEA9b9Cc43a4e329f01361764e",
    [80001]: "0x501AcEC83d440c00644cA5C48d059e1840852a64"
}

export const UWP_ADDRESS: { [chainID : number]: string } = {
    [1] : "0x5efC0d9ee3223229Ce3b53e441016efC5BA83435", // Eth Mainnet
    [137] : "0xd1108a800363C262774B990e9DF75a4287d5c075", // Polygon
    [250] : "", // Fantom
    [4002] : '0x501ace27A074471F099ffFeC008Bd1b151c7F7dE', // Fantom Testnet
    [43113] : "", // Avalanche testnet
    [43114] : "", // Avalanche C-chain
    [1313161554] : "0x4A6B0f90597e7429Ce8400fC0E2745Add343df78", // Aurora
}

export const SOLACE_COVER_PRODUCT_V3_ADDRESS: { [chainID: number]: string } = {
    [250] : "", // Fantom
    [4002] : "0x501aCE7271065019707Fad7DEbDcCE78bd10F7AC", // Fantom Testnet
    [43113] : "", // Avalanche Testnet
    [43114] : "" // Avalanche C-chain
}

export const COVERAGE_SCP_ADDRESS: { [chainId : number]: string } = {
    [250]: '',
    [4002]: '0x501acE6a7022727f62ffC95558a3359E900C506D',
    [43113] : "", // Avalanche Testnet
    [43114] : "", // Avalanche C-chain
}

export const COVER_PAYMENT_MANAGER_ADDRESS: { [chainId : number]: string } = {
    [250]: '',
    [4002]: '0x501AcE6f3aa5898909E1D490A0ACcDf5580201Df',
    [43113] : "", // Avalanche Testnet
    [43114] : "", // Avalanche C-chain
}
