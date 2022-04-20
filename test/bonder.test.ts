import { Contract, getDefaultProvider, providers, BigNumber as BN } from "ethers"
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
    Eth Mainnet View Functions - ETH teller
    ****************************************/

    describe("Ethereum mainnet ETH-teller", () => {
        beforeEach(() => {
            provider = getDefaultProvider(getNetwork(1)) // Note using default provider gets rate-limit notification
            bond_teller_dai_contract = new Contract(BOND_TELLER_ADDRESSES["eth"][1].addr, BondTellerEth, provider)
            bonder = new Bonder(1, BOND_TELLER_ADDRESSES["eth"][1].addr, BOND_TELLER_ADDRESSES["eth"][1].type, provider);
        })

        test("#bondPrice - gets the same value as directly querying mainnet contract", async () => {
            expect(await bond_teller_dai_contract.bondPrice()).toEqual(await bonder.bondPrice());
        })
        
        test("#calculateAmountOut - gets the same value as directly querying mainnet contract", async () => {
            expect(await bond_teller_dai_contract.calculateAmountOut(BOND_DEPOSIT, false)).toEqual(await bonder.calculateAmountOut(BOND_DEPOSIT, false));
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
            bond_teller_dai_contract = new Contract(BOND_TELLER_ADDRESSES["usdt"][1].addr, BondTellerEth, provider)
            bonder = new Bonder(1, BOND_TELLER_ADDRESSES["usdt"][1].addr, BOND_TELLER_ADDRESSES["usdt"][1].type, provider);
        })

        test("#bondPrice - gets the same value as directly querying mainnet contract", async () => {
            expect(await bond_teller_dai_contract.bondPrice()).toEqual(await bonder.bondPrice());
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
            bond_teller_matic_contract = new Contract(BOND_TELLER_ADDRESSES["matic"][137].addr, BondTellerMatic, provider)
            bonder = new Bonder(137, BOND_TELLER_ADDRESSES["matic"][137].addr, BOND_TELLER_ADDRESSES["matic"][137].type, provider);
        })

        test("#bondPrice - gets the same value as directly querying mainnet contract", async () => {
            expect(await bond_teller_matic_contract.bondPrice()).toEqual(await bonder.bondPrice());
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
            bond_teller_wnear_contract = new Contract(BOND_TELLER_ADDRESSES["wnear"][1313161554].addr, BondTellerErc20, provider)
            bonder = new Bonder(1313161554, bond_teller_wnear_contract.address, BOND_TELLER_ADDRESSES["wnear"][1313161554].type, provider);
        })

        test("#bondPrice - gets the same value as directly querying mainnet contract", async () => {
            expect(await bond_teller_wnear_contract.bondPrice()).toEqual(await bonder.bondPrice());
        })
        
        test("#calculateAmountOut - gets the same value as directly querying mainnet contract", async () => {
            expect(await bond_teller_wnear_contract.calculateAmountOut(BOND_DEPOSIT, false)).toEqual(await bonder.calculateAmountOut(BOND_DEPOSIT, false));
        })

        test("#calculateAmountIn - gets the same value as directly querying mainnet contract", async () => {
            expect(await bond_teller_wnear_contract.calculateAmountIn(BOND_DEPOSIT, false)).toEqual(await bonder.calculateAmountIn(BOND_DEPOSIT, false));
        })
    })

})

