import { Contract, getDefaultProvider, providers, BigNumber as BN } from "ethers"
const { getNetwork } = providers
import { Bonder, BOND_TELLER_ADDRESSES } from "../src"
import { expectClose } from "../src/utils/test"

import {
    BondTellerErc20_ABI,
    BondTellerEth_ABI,
    BondTellerMatic_ABI
} from "../src"

describe("Bonder", () => {
    const BOND_DEPOSIT = BN.from("1000")

    let provider: providers.Provider
    let bond_teller_matic_contract: Contract
    let bond_teller_dai_contract: Contract
    let bond_teller_usdt_contract: Contract
    let bond_teller_wnear_contract: Contract
    let bonder: Bonder

    beforeEach(() => {
        // Avoid jest avoid timeout error
        jest.setTimeout(20000);
    })

    /****************************************
    Eth Mainnet View Functions - ETH teller
    ****************************************/

    describe("Ethereum mainnet ETH-teller", () => {
        beforeEach(() => {
            provider = getDefaultProvider(getNetwork(1)) // Note using default provider gets rate-limit notification
            bond_teller_dai_contract = new Contract(BOND_TELLER_ADDRESSES["eth"][1].addr, BondTellerEth_ABI, provider)
            bonder = new Bonder(1, BOND_TELLER_ADDRESSES["eth"][1].addr, provider);
        })

        test("#bondPrice - gets the same value as directly querying mainnet contract", async () => {
            expectClose(await bond_teller_dai_contract.bondPrice(), await bonder.bondPrice(), 1e14)
        })
        
        test("#calculateAmountOut - gets the same value as directly querying mainnet contract", async () => {
            expectClose(await bond_teller_dai_contract.calculateAmountOut(BOND_DEPOSIT, false), await bonder.calculateAmountOut(BOND_DEPOSIT, false), 1e14)
        })

        test("#calculateAmountIn - gets the same value as directly querying mainnet contract", async () => {
            expect(await bond_teller_dai_contract.calculateAmountIn(BOND_DEPOSIT, false)).toEqual(await bonder.calculateAmountIn(BOND_DEPOSIT, false));
        })
    })

    
    /****************************************
    Eth Mainnet View Functions - USDT teller
    ****************************************/

    describe("Ethereum mainnet USDT-teller", () => {
        beforeEach(() => {
            provider = getDefaultProvider(getNetwork(1)) // Note using default provider gets rate-limit notification
            bond_teller_usdt_contract = new Contract(BOND_TELLER_ADDRESSES["usdt"][1].addr, BondTellerEth_ABI, provider)
            bonder = new Bonder(1, BOND_TELLER_ADDRESSES["usdt"][1].addr, provider);
        })

        test("#bondPrice - gets the same value as directly querying mainnet contract", async () => {
            expectClose(await bond_teller_usdt_contract.bondPrice(), await bonder.bondPrice(), 1e14)
        })
        
        test("#calculateAmountOut - gets the same value as directly querying mainnet contract", async () => {
            expect(await bond_teller_usdt_contract.calculateAmountOut(BOND_DEPOSIT, false)).toEqual(await bonder.calculateAmountOut(BOND_DEPOSIT, false));
        })

        test("#calculateAmountIn - gets the same value as directly querying mainnet contract", async () => {
            expect(await bond_teller_usdt_contract.calculateAmountIn(BOND_DEPOSIT, false)).toEqual(await bonder.calculateAmountIn(BOND_DEPOSIT, false));
        })
    })

    /**********************************
    Matic Mainnet View Functions
    **********************************/

    describe("Matic mainnet MATIC-teller", () => {
        beforeEach(() => {
            provider = new providers.JsonRpcProvider("https://polygon-rpc.com")
            bond_teller_matic_contract = new Contract(BOND_TELLER_ADDRESSES["matic"][137].addr, BondTellerMatic_ABI, provider)
            bonder = new Bonder(137, BOND_TELLER_ADDRESSES["matic"][137].addr, provider);
        })

        test("#bondPrice - gets the same value as directly querying mainnet contract", async () => {
            expectClose(await bond_teller_matic_contract.bondPrice(), await bonder.bondPrice(), 1e14)
        })
        
        test("#calculateAmountOut - gets the same value as directly querying mainnet contract", async () => {
            expect(await bond_teller_matic_contract.calculateAmountOut(BOND_DEPOSIT, false)).toEqual(await bonder.calculateAmountOut(BOND_DEPOSIT, false));
        })

        test("#calculateAmountIn - gets the same value as directly querying mainnet contract", async () => {
            expect(await bond_teller_matic_contract.calculateAmountIn(BOND_DEPOSIT, false)).toEqual(await bonder.calculateAmountIn(BOND_DEPOSIT, false));
        })
    })
 
    /**********************************
    Aurora Mainnet View Functions
    **********************************/

    describe("Aurora mainnet WNEAR-teller", () => {
        beforeEach(() => {
            provider = new providers.JsonRpcProvider("https://mainnet.aurora.dev")
            bond_teller_wnear_contract = new Contract(BOND_TELLER_ADDRESSES["wnear"][1313161554].addr, BondTellerErc20_ABI, provider)
            bonder = new Bonder(1313161554, bond_teller_wnear_contract.address, provider);
        })

        test("#bondPrice - gets the same value as directly querying mainnet contract", async () => {
            expectClose(await bond_teller_wnear_contract.bondPrice(), await bonder.bondPrice(), 1e14)
        })
        
        test("#calculateAmountOut - gets the same value as directly querying mainnet contract", async () => {
            expect(await bond_teller_wnear_contract.calculateAmountOut(BOND_DEPOSIT, false)).toEqual(await bonder.calculateAmountOut(BOND_DEPOSIT, false));
        })

        test("#calculateAmountIn - gets the same value as directly querying mainnet contract", async () => {
            expect(await bond_teller_wnear_contract.calculateAmountIn(BOND_DEPOSIT, false)).toEqual(await bonder.calculateAmountIn(BOND_DEPOSIT, false));
        })
    })

})