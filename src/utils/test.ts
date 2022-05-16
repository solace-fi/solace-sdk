import { BigNumber as BN, BigNumberish } from "ethers"

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