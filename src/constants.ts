import { BigNumber as BN } from "ethers";

// exports for internal consumption
export const ZERO = BN.from("0")
export const ONE = BN.from("1")
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export const SOLACE_ADDRESS: { [chainID : number]: string } = {
    [1] : "0x501acE9c35E60f03A2af4d484f49F9B1EFde9f40",
    [4] : "0x501acE9c35E60f03A2af4d484f49F9B1EFde9f40"
}

export const DAI_ADDRESS: { [chainID : number]: string } = {
    [1] : "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    [4] : "0x8ad3aA5d5ff084307d28C8f514D7a193B2Bfe725"
}

export const SOLACE_COVER_PRODUCT_ADDRESS: { [chainID: number]: string } = {
    [1]: "0x501ACEbe29eabc346779BcB5Fd62Eaf6Bfb5320E",
    [4]: "0x501ace2146981263604F7F5C4d0600583ebA8eF6"
}