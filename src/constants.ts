import { AbstractConnector } from "@web3-react/abstract-connector";
import { InjectedConnector } from "@web3-react/injected-connector";
// import { LedgerConnector } from "@web3-react/ledger-connector";
// import { TrezorConnector } from "@web3-react/trezor-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { BigNumber as BN } from "ethers";
import { Network, NetworkConfig, WalletConnector } from "./types";

// exports for internal consumption
export const ZERO = BN.from("0")
export const ONE = BN.from("1")
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

/***************
TOKEN ADDRESSES
***************/

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

/****************************
SOLACECOVERPRODUCT ADDRESSES
****************************/

export const SOLACE_COVER_PRODUCT_ADDRESS: { [chainID: number]: string } = {
    [1]: "0x501ACEbe29eabc346779BcB5Fd62Eaf6Bfb5320E",
    [4]: "0x501AcE125346445b04A7c414C55a3d18d51Bf547",
    [137]: "0x501AcEC83d440c00644cA5C48d059e1840852a64",
    [80001]: "0x501AcEC83d440c00644cA5C48d059e1840852a64"
}

/*****************
STAKING ADDRESSES
*****************/

export const XSLOCKER_ADDRESS: { [chainID: number]: string } = {
    [1]: "0x501Ace47c5b0C2099C4464f681c3fa2ECD3146C1",
    [4]: "0x501Ace47c5b0C2099C4464f681c3fa2ECD3146C1",
    [137]: "0x501Ace47c5b0C2099C4464f681c3fa2ECD3146C1",
    [1313161554]: "0x501Ace47c5b0C2099C4464f681c3fa2ECD3146C1"
}

export const STAKING_REWARDS_ADDRESS: { [chainID: number]: string } = {
    [1]: "0x501ace3D42f9c8723B108D4fBE29989060a91411",
    [4]: "0x501ace3D42f9c8723B108D4fBE29989060a91411",
    [137]: "0x501ace3D42f9c8723B108D4fBE29989060a91411",
    [1313161554]: "0x501ace3D42f9c8723B108D4fBE29989060a91411"
}

/*****************
BONDING ADDRESSES
*****************/

const BOND_TELLER_DAI_ADDRESS: { [chainID: number]: string } = {
    [1]: "0x501ACe677634Fd09A876E88126076933b686967a",
    [4]: "0x501ACe677634Fd09A876E88126076933b686967a",
    [42]: "0x501ACe677634Fd09A876E88126076933b686967a",
    [137]: "0x501ACe677634Fd09A876E88126076933b686967a",
    [80001]: "0x501ACe677634Fd09A876E88126076933b686967a",
    [1313161554]: "0x501ACe677634Fd09A876E88126076933b686967a",
    [1313161556]: "0x501acED0B949D96B3289A1b37791cA8bD93B0D65"
}

const BOND_TELLER_USDC_ADDRESS: { [chainID: number]: string } = {
    [1]: "0x501ACE7E977e06A3Cb55f9c28D5654C9d74d5cA9",
    [4]: "0x501ACE7E977e06A3Cb55f9c28D5654C9d74d5cA9",
    [42]: "0x501ACE7E977e06A3Cb55f9c28D5654C9d74d5cA9",
    [137]: "0x501ACE7E977e06A3Cb55f9c28D5654C9d74d5cA9",
    [80001]: "0x501ACE7E977e06A3Cb55f9c28D5654C9d74d5cA9",
    [1313161554]: "0x501ACE7E977e06A3Cb55f9c28D5654C9d74d5cA9",
    [1313161556]: "0x501AcE2248c1bB34f709f2768263A64A9805cCdB"
}

const BOND_TELLER_USDT_ADDRESS: { [chainID: number]: string } = {
    [1]: "0x501ACe5CeEc693Df03198755ee80d4CE0b5c55fE",
    [4]: "0x501ACe5CeEc693Df03198755ee80d4CE0b5c55fE",
    [42]: "0x501ACe5CeEc693Df03198755ee80d4CE0b5c55fE",
    [137]: "0x501ACe5CeEc693Df03198755ee80d4CE0b5c55fE",
    [80001]: "0x501ACe5CeEc693Df03198755ee80d4CE0b5c55fE",
    [1313161554]: "0x501ACe5CeEc693Df03198755ee80d4CE0b5c55fE",
    [1313161556]: "0x501aCEa6ff6dcE05D108D616cE886AF74f00EAAa"
}

const BOND_TELLER_FRAX_ADDRESS: { [chainID: number]: string } = {
    [1]: "0x501aCef4F8397413C33B13cB39670aD2f17BfE62",
    [4]: "0x501aCef4F8397413C33B13cB39670aD2f17BfE62",
    [42]: "0x501aCef4F8397413C33B13cB39670aD2f17BfE62",
    [137]: "0x501aCef4F8397413C33B13cB39670aD2f17BfE62",
    [80001]: "0x501aCef4F8397413C33B13cB39670aD2f17BfE62",
    [1313161554]: "0x501aCef4F8397413C33B13cB39670aD2f17BfE62",
    [1313161556]: "0x501acE87fF4E7A1498320ABB674a4960A87792E4"
}

const BOND_TELLER_WBTC_ADDRESS: { [chainID: number]: string } = {
    [1]: "0x501aCEF0d0c73BD103337e6E9Fd49d58c426dC27",
    [4]: "0x501aCEF0d0c73BD103337e6E9Fd49d58c426dC27",
    [42]: "0x501aCEF0d0c73BD103337e6E9Fd49d58c426dC27",
    [137]: "0x501aCEF0d0c73BD103337e6E9Fd49d58c426dC27",
    [80001]: "0x501aCEF0d0c73BD103337e6E9Fd49d58c426dC27",
    [1313161554]: "0x501aCEF0d0c73BD103337e6E9Fd49d58c426dC27",
    [1313161556]: "0x501Ace54C7a2Cf564ae37538053902550a859D39"
}

const BOND_TELLER_ETH_ADDRESS: { [chainID: number]: string } = {
    [1]: "0x501ACe95141F3eB59970dD64af0405f6056FB5d8",
    [4]: "0x501ACe95141F3eB59970dD64af0405f6056FB5d8",
    [42]: "0x501ACe95141F3eB59970dD64af0405f6056FB5d8",
    [80001]: "0x501ACe95141F3eB59970dD64af0405f6056FB5d8",
    [1313161554]: "0x501ACe95141F3eB59970dD64af0405f6056FB5d8",
    [1313161556]: "0x501aCE92490feCEFACa6F9c9Fbe91caCBc823be1"
}

const BOND_TELLER_WETH_ADDRESS: { [chainID: number]: string } = {
    [137]: "0x501Ace367f1865DEa154236D5A8016B80a49e8a9",
}

const BOND_TELLER_MATIC_ADDRESS: { [chainID: number]: string } = {
    [137]: "0x501aCe133452D4Df83CA68C684454fCbA608b9DD",
}

const BOND_TELLER_WNEAR_ADDRESS: { [chainID: number]: string } = {
    [1313161554]: "0x501aCe71a83CBE03B1467a6ffEaeB58645d844b4",
    [1313161556]: "0x501AcE9D730dcf60d6bbD1FDDca9c1b69CAF0A61"
}

const BOND_TELLER_AURORA_ADDRESS: { [chainID: number]: string } = {
    [1313161554]: "0x501Ace35f0B7Fad91C199824B8Fe555ee9037AA3",
    [1313161556]: "0x501ACef4fDF8C0597aA40b5Cb82035FFe5Ad3552"
}

export const BOND_TELLER_ADDRESSES: { [token: string]: {[chainID: number]: string} }  = {
    ["dai"]: BOND_TELLER_DAI_ADDRESS,
    ["usdc"]: BOND_TELLER_USDC_ADDRESS,
    ["usdt"]: BOND_TELLER_USDT_ADDRESS,
    ["frax"]: BOND_TELLER_FRAX_ADDRESS,
    ["wbtc"]: BOND_TELLER_WBTC_ADDRESS,
    ["eth"]: BOND_TELLER_ETH_ADDRESS,
    ["weth"]: BOND_TELLER_WETH_ADDRESS,
    ["matic"]: BOND_TELLER_MATIC_ADDRESS,
    ["wnear"]: BOND_TELLER_WNEAR_ADDRESS,
    ["aurora"]: BOND_TELLER_AURORA_ADDRESS,
}

/**************
NETWORK CONFIG 
**************/

export const NETWORKS: Network[] = [
    {
        chainId: 1,
        supportedTxTypes: [0, 2]
    },{
        chainId: 4,
        supportedTxTypes: [0, 2],
        isTestnet: true,
    },{
        chainId: 42,
        supportedTxTypes: [0, 2],
        isTestnet: true,
    },{
        chainId: 137,
        supportedTxTypes: [0, 2]
    },{
        chainId: 80001,
        supportedTxTypes: [0, 2],
        isTestnet: true,
    },{
        chainId: 1313161554,
        supportedTxTypes: [0],
    },{
        chainId: 1313161555,
        supportedTxTypes: [0],
        isTestnet: true,
    }
]

export const isNetworkSupported = (chainID: number): boolean => {
    const supportedChainIds = NETWORKS.map((network) => network.chainId);
    if ( supportedChainIds.includes(chainID) ) return true
    else return false
}

export const WALLETS: WalletConnector[] = [
    {
        id: 'metamask',
        supportedTxTypes: [0, 2],
        getConnector(): AbstractConnector {
            return new InjectedConnector({
                supportedChainIds: NETWORKS.map((network) => network.chainId),
            })
        }
    },
    // {
    //     id: 'ledger',
    //     supportedTxTypes: [0, 2],
    //     getConnector(network: NetworkConfig) {
    //         return new LedgerConnector({
    //             chainId: network.chainId,
    //             url: network.rpc.httpsUrl,
    //             pollingInterval: network.rpc.pollingInterval,
    //             baseDerivationPath: args.baseDerivationPath ?? undefined,
    //           })
    //     }
    // }, {
    //     id: 'trezor',
    //     supportedTxTypes: [0],
    //     getConnector(network: NetworkConfig) {
    //         return new TrezorConnector({
    //             chainId: network.chainId,
    //             url: network.rpc.httpsUrl,
    //             pollingInterval: network.rpc.pollingInterval,
    //             manifestEmail: '',
    //             manifestAppUrl: '',
    //             config: {
    //               networkId: network.chainId,
    //             },
    //           })
    //     }
    // }, 
    {
        id: 'walletconnect',
        supportedTxTypes: [0],
        getConnector(network: NetworkConfig): AbstractConnector {
            return new WalletConnectConnector({
                rpc: { [network.chainId]: network.rpc.httpsUrl },
                bridge: 'https://bridge.walletconnect.org',
                qrcode: true,
              })
        }
    }, {
        id: 'walletlink',
        supportedTxTypes: [0],
        getConnector(network: NetworkConfig): AbstractConnector {
            return new WalletLinkConnector({
                url: network.rpc.httpsUrl,
                appName: 'coinbase',
                appLogoUrl: '',
              })
        }
    },
]