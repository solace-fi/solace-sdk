import { Contract, getDefaultProvider, providers, BigNumber as BN, BigNumberish } from "ethers"
const { getNetwork } = providers
import { Bonder, BOND_TELLER_ADDRESSES } from "../src"

import BondTellerErc20 from "../src/abis/BondTellerErc20.json"
import BondTellerEth from "../src/abis/BondTellerEth.json"
import BondTellerMatic from "../src/abis/BondTellerMatic.json"

describe("Bonder", () => {
    const BOND_DEPOSIT = BN.from("1000")

    let provider: providers.Provider
    let bond_teller_matic_contract: Contract
    let bond_teller_dai_contract: Contract
    let bond_teller_wnear_contract: Contract
    let bonder: Bonder

    beforeEach(() => {
        // Avoid jest avoid timeout error
        jest.setTimeout(20000);
    })

    /****************************************
    Eth Mainnet View Functions - USDT teller
    ****************************************/

    describe("Ethereum mainnet USDT-teller", () => {
        beforeEach(() => {
            provider = getDefaultProvider(getNetwork(1)) // Note using default provider gets rate-limit notification
            bond_teller_dai_contract = new Contract(BOND_TELLER_ADDRESSES["usdt"][1], BondTellerEth, provider)
            bonder = new Bonder(1, "usdt", provider);
        })

        test("#bondPrice - gets the same value as directly querying mainnet contract", async () => {
            expectClose(await bond_teller_dai_contract.bondPrice(), await bonder.bondPrice(), 1e14)
            // expect(await bond_teller_dai_contract.bondPrice()).toEqual(await bonder.bondPrice());
        })
        
        test("#calculateAmountOut - gets the same value as directly querying mainnet contract", async () => {
            expect(await bond_teller_dai_contract.calculateAmountOut(BOND_DEPOSIT, false)).toEqual(await bonder.calculateAmountOut(BOND_DEPOSIT, false));
        })

        test("#calculateAmountIn - gets the same value as directly querying mainnet contract", async () => {
            expect(await bond_teller_dai_contract.calculateAmountIn(BOND_DEPOSIT, false)).toEqual(await bonder.calculateAmountIn(BOND_DEPOSIT, false));
        })
    })

    /**********************************
    Matic Mainnet View Functions
    **********************************/

    describe("Matic mainnet MATIC-teller", () => {
        beforeEach(() => {
            provider = new providers.JsonRpcProvider("https://polygon-rpc.com")
            bond_teller_matic_contract = new Contract(BOND_TELLER_ADDRESSES["matic"][137], BondTellerMatic, provider)
            bonder = new Bonder(137, "matic", provider);
        })

        test("#bondPrice - gets the same value as directly querying mainnet contract", async () => {
            expectClose(await bond_teller_matic_contract.bondPrice(), await bonder.bondPrice(), 1e14)
            // expect(await bond_teller_matic_contract.bondPrice()).toEqual(await bonder.bondPrice());
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
            bond_teller_wnear_contract = new Contract(BOND_TELLER_ADDRESSES["wnear"][1313161554], BondTellerErc20, provider)
            bonder = new Bonder(1313161554, "wnear", provider);
        })

        test("#bondPrice - gets the same value as directly querying mainnet contract", async () => {
            expectClose(await bond_teller_wnear_contract.bondPrice(), await bonder.bondPrice(), 1e14)
            // expect(await bond_teller_wnear_contract.bondPrice()).toEqual(await bonder.bondPrice());
        })
        
        test("#calculateAmountOut - gets the same value as directly querying mainnet contract", async () => {
            expect(await bond_teller_wnear_contract.calculateAmountOut(BOND_DEPOSIT, false)).toEqual(await bonder.calculateAmountOut(BOND_DEPOSIT, false));
        })

        test("#calculateAmountIn - gets the same value as directly querying mainnet contract", async () => {
            expect(await bond_teller_wnear_contract.calculateAmountIn(BOND_DEPOSIT, false)).toEqual(await bonder.calculateAmountIn(BOND_DEPOSIT, false));
        })
    })

})

// Copied from https://github.com/solace-fi/solace-core/blob/main/test/utilities/math.ts
// asserts (expected-delta) <= actual <= expected+delta
export function expectClose(actual: BigNumberish, expected: BigNumberish, delta: BigNumberish) {
    let a = BN.from(actual);
    let e = BN.from(expected);
    let d = BN.from(delta);
    let l = e.sub(d);
    let r = e.add(d);
    let b = a.gte(l) && a.lte(r);
    // let m = `Expected ${a.toString()} to be within ${d.toString()} of ${e.toString()}`;
    expect(b).toEqual(true);
  }