import { BondTellerTokenData } from "../types/bond"
import { MasterToken } from "./token"

const BOND_TELLER_DAI_ADDRESS: BondTellerTokenData = {
    [1]: {addr: "0x501ACe677634Fd09A876E88126076933b686967a", type: 'erc20'},
    [4]: {addr: "0x501ACe677634Fd09A876E88126076933b686967a", type: 'erc20'},
    [42]: {addr: "0x501ACe677634Fd09A876E88126076933b686967a", type: 'erc20'},
    [137]: {addr: "0x501ACe677634Fd09A876E88126076933b686967a", type: 'erc20'},
    [250]: {addr: "0x501ACe677634Fd09A876E88126076933b686967a", type: 'erc20'},
    [4002]: {addr: "0x501acED0B949D96B3289A1b37791cA8bD93B0D65", type: 'erc20'},
    [43113] : {addr: "", type: "erc20"}, // Avalanche Fuji Testnet
    [43114] : {addr: "", type: "erc20"}, // Avalanche C-chain
    [80001]: {addr: "0x501ACe677634Fd09A876E88126076933b686967a", type: 'erc20'},
    [1313161554]: {addr: "0x501ACe677634Fd09A876E88126076933b686967a", type: 'erc20'},
    [1313161555]: {addr: "0x501acED0B949D96B3289A1b37791cA8bD93B0D65", type: 'erc20'},
}

const BOND_TELLER_USDC_ADDRESS: BondTellerTokenData = {
    [1]: {addr: "0x501ACE7E977e06A3Cb55f9c28D5654C9d74d5cA9", type: 'erc20'},
    [4]: {addr: "0x501ACE7E977e06A3Cb55f9c28D5654C9d74d5cA9", type: 'erc20'},
    [42]: {addr: "0x501ACE7E977e06A3Cb55f9c28D5654C9d74d5cA9", type: 'erc20'},
    [137]: {addr: "0x501ACE7E977e06A3Cb55f9c28D5654C9d74d5cA9", type: 'erc20'},
    [250]: {addr: "0x501ACE7E977e06A3Cb55f9c28D5654C9d74d5cA9", type: 'erc20'},
    [4002]: {addr: "0x501AcE2248c1bB34f709f2768263A64A9805cCdB", type: 'erc20'},
    [43113] : {addr: "", type: "erc20"}, // Avalanche Fuji Testnet
    [43114] : {addr: "", type: "erc20"}, // Avalanche C-chain
    [80001]: {addr: "0x501ACE7E977e06A3Cb55f9c28D5654C9d74d5cA9", type: 'erc20'},
    [1313161554]: {addr: "0x501ACE7E977e06A3Cb55f9c28D5654C9d74d5cA9", type: 'erc20'},
    [1313161555]: {addr: "0x501AcE2248c1bB34f709f2768263A64A9805cCdB", type: 'erc20'},
}

const BOND_TELLER_USDT_ADDRESS: BondTellerTokenData = {
    [1]: {addr: "0x501ACe5CeEc693Df03198755ee80d4CE0b5c55fE", type: 'erc20'},
    [4]: {addr: "0x501ACe5CeEc693Df03198755ee80d4CE0b5c55fE", type: 'erc20'},
    [42]: {addr: "0x501ACe5CeEc693Df03198755ee80d4CE0b5c55fE", type: 'erc20'},
    [137]: {addr: "0x501ACe5CeEc693Df03198755ee80d4CE0b5c55fE", type: 'erc20'},
    [250]: {addr: "0x501ACe5CeEc693Df03198755ee80d4CE0b5c55fE", type: 'erc20'},
    [4002]: {addr: "0x501aCEa6ff6dcE05D108D616cE886AF74f00EAAa", type: 'erc20'},
    [43113] : {addr: "", type: "erc20"}, // Avalanche Fuji Testnet
    [43114] : {addr: "", type: "erc20"}, // Avalanche C-chain
    [80001]: {addr: "0x501ACe5CeEc693Df03198755ee80d4CE0b5c55fE", type: 'erc20'},
    [1313161554]: {addr: "0x501ACe5CeEc693Df03198755ee80d4CE0b5c55fE", type: 'erc20'},
    [1313161555]: {addr: "0x501aCEa6ff6dcE05D108D616cE886AF74f00EAAa", type: 'erc20'}
}

const BOND_TELLER_FRAX_ADDRESS: BondTellerTokenData = {
    [1]: {addr: "0x501aCef4F8397413C33B13cB39670aD2f17BfE62", type: 'erc20'},
    [4]: {addr: "0x501aCef4F8397413C33B13cB39670aD2f17BfE62", type: 'erc20'},
    [42]: {addr: "0x501aCef4F8397413C33B13cB39670aD2f17BfE62", type: 'erc20'},
    [137]: {addr: "0x501aCef4F8397413C33B13cB39670aD2f17BfE62", type: 'erc20'},
    [250]: {addr: "0x501aCef4F8397413C33B13cB39670aD2f17BfE62", type: 'erc20'},
    [4002]: {addr: "0x501acE87fF4E7A1498320ABB674a4960A87792E4", type: 'erc20'},
    [43113] : {addr: "", type: "erc20"}, // Avalanche Fuji Testnet
    [43114] : {addr: "", type: "erc20"}, // Avalanche C-chain
    [80001]: {addr: "0x501aCef4F8397413C33B13cB39670aD2f17BfE62", type: 'erc20'},
    [1313161554]: {addr: "0x501aCef4F8397413C33B13cB39670aD2f17BfE62", type: 'erc20'},
    [1313161555]: {addr: "0x501acE87fF4E7A1498320ABB674a4960A87792E4", type: 'erc20'}
}

const BOND_TELLER_WBTC_ADDRESS: BondTellerTokenData = {
    [1]: {addr: "0x501aCEF0d0c73BD103337e6E9Fd49d58c426dC27", type: 'erc20'},
    [4]: {addr: "0x501aCEF0d0c73BD103337e6E9Fd49d58c426dC27", type: 'erc20'},
    [42]: {addr: "0x501aCEF0d0c73BD103337e6E9Fd49d58c426dC27", type: 'erc20'},
    [137]: {addr: "0x501aCEF0d0c73BD103337e6E9Fd49d58c426dC27", type: 'erc20'},
    [250]: {addr: "0x501aCEF0d0c73BD103337e6E9Fd49d58c426dC27", type: 'erc20'},
    [4002]: {addr: "0x501Ace54C7a2Cf564ae37538053902550a859D39", type: 'erc20'},
    [43113] : {addr: "", type: "erc20"}, // Avalanche Fuji Testnet
    [43114] : {addr: "", type: "erc20"}, // Avalanche C-chain
    [80001]: {addr: "0x501aCEF0d0c73BD103337e6E9Fd49d58c426dC27", type: 'erc20'},
    [1313161554]: {addr: "0x501aCEF0d0c73BD103337e6E9Fd49d58c426dC27", type: 'erc20'},
    [1313161555]: {addr: "0x501Ace54C7a2Cf564ae37538053902550a859D39", type: 'erc20'}
}

const BOND_TELLER_ETH_ADDRESS: BondTellerTokenData = {
    [1]: {addr: "0x501ACe95141F3eB59970dD64af0405f6056FB5d8", type: 'eth'},
    [4]: {addr: "0x501ACe95141F3eB59970dD64af0405f6056FB5d8", type: 'eth'},
    [42]: {addr: "0x501ACe95141F3eB59970dD64af0405f6056FB5d8", type: 'eth'},
    [1313161554]: {addr: "0x501ACe95141F3eB59970dD64af0405f6056FB5d8", type: 'eth'},
    [1313161555]: {addr: "0x501aCE92490feCEFACa6F9c9Fbe91caCBc823be1", type: 'eth'},
}

const BOND_TELLER_WETH_ADDRESS: BondTellerTokenData = {
    [137]: {addr: "0x501Ace367f1865DEa154236D5A8016B80a49e8a9", type: 'erc20'},
    [250]: {addr: "0x501ACe95141F3eB59970dD64af0405f6056FB5d8", type: 'erc20'},
    [4002]: {addr: "0x501AcE1CaC9c5c5c5e8Ac61575c7928E0A3397e7", type: 'erc20'},
    [43113] : {addr: "", type: "erc20"}, // Avalanche Fuji Testnet
    [43114] : {addr: "", type: "erc20"}, // Avalanche C-chain
    [80001]: {addr: "0x501Ace367f1865DEa154236D5A8016B80a49e8a9", type: 'erc20'},
}

const BOND_TELLER_MATIC_ADDRESS: BondTellerTokenData = {
    [137]: {addr: "0x501aCe133452D4Df83CA68C684454fCbA608b9DD", type: 'matic'},
    [80001]: {addr: "0x501aCe133452D4Df83CA68C684454fCbA608b9DD", type: 'matic'},
}

const BOND_TELLER_WNEAR_ADDRESS: BondTellerTokenData = {
    [1313161554]: {addr: "0x501aCe71a83CBE03B1467a6ffEaeB58645d844b4", type: 'erc20'},
    [1313161555]: {addr: "0x501AcE9D730dcf60d6bbD1FDDca9c1b69CAF0A61", type: 'erc20'}
}

const BOND_TELLER_AURORA_ADDRESS: BondTellerTokenData = {
    [1313161554]: {addr: "0x501Ace35f0B7Fad91C199824B8Fe555ee9037AA3", type: 'erc20'},
    [1313161555]: {addr: "0x501ACef4fDF8C0597aA40b5Cb82035FFe5Ad3552", type: 'erc20'}
}

const BOND_TELLER_FTM_TELLER: BondTellerTokenData = {
    [4002]: { addr: "0x501acEDb97de787b1A760AbD0e0FC1E5DfC033D8", type: 'ftm' },
}

const BOND_TELLER_SCP_ADDRESS: BondTellerTokenData = {
    [1]: {addr: "0x501ACe00FD8e5dB7C3be5e6D254ba4995e1B45b7", type: 'erc20'},
    [4]: {addr: "0x501ACe00FD8e5dB7C3be5e6D254ba4995e1B45b7", type: 'erc20'},
    [42]: {addr: "0x501ACe00FD8e5dB7C3be5e6D254ba4995e1B45b7", type: 'erc20'}
}
 
export const BOND_TELLER_ADDRESSES: { [token: string]: BondTellerTokenData } = {
    [MasterToken.dai]: BOND_TELLER_DAI_ADDRESS,
    [MasterToken.usdc]: BOND_TELLER_USDC_ADDRESS,
    [MasterToken.usdt]: BOND_TELLER_USDT_ADDRESS,
    [MasterToken.frax]: BOND_TELLER_FRAX_ADDRESS,
    [MasterToken.btc]: BOND_TELLER_WBTC_ADDRESS,
    [MasterToken.eth]: BOND_TELLER_ETH_ADDRESS,
    [MasterToken.weth]: BOND_TELLER_WETH_ADDRESS,
    [MasterToken.matic]: BOND_TELLER_MATIC_ADDRESS,
    [MasterToken.wnear]: BOND_TELLER_WNEAR_ADDRESS,
    [MasterToken.aurora]: BOND_TELLER_AURORA_ADDRESS,
    [MasterToken.scp]: BOND_TELLER_SCP_ADDRESS,
    [MasterToken.ftm]: BOND_TELLER_FTM_TELLER
}