/**
 * @jest-environment node
 */

import { BigNumber } from "ethers"
import { PolicyReferral } from "../src/apis/referral"

describe("PolicyReferral", () => {
  let policyReferral = new PolicyReferral()
  let rinkebyAccounts = [
    { address: "0xe73bef17f3b54b0b5fb3795a1f0ac87a2702ec7d", policyId: 5, chainId: 4 },
    { address: "0xc2ce57069dfd639fb0e6a783eb39bcb743fa2d3c", policyId: 7, chainId: 4 },
    { address: "0x9ada9ae98457ad8a2d53de2b888cd1337d3438e8", policyId: 21, chainId: 4 }
  ]

  beforeEach(() => {
    // Avoid jest avoid timeout error
    jest.setTimeout(20000)
  })

  describe("getInfo", () => {
    it("will return a valid response", async () => {
      let a: any = []
      await Promise.all(
        rinkebyAccounts.map(async (account: any) => {
          const res = await policyReferral.getInfo(account.address, BigNumber.from(account.policyId), account.chainId)
          a.push(res)
        })
      )
      console.log(a)
    })
  })

  describe("applyCode", () => {
    it("will return a valid response", async () => {
      const res = await policyReferral.applyCode(
        "0xc2ce57069dfd639fb0e6a783eb39bcb743fa2d3c",
        "Z4C8G",
        BigNumber.from(7),
        4
      )
      console.log(res)
    })
  })
})
