/**
 * @jest-environment node
 */

import { BigNumber } from "ethers"
import { PolicyReferral } from "../src/apis/referral"

describe("PolicyReferral", () => {
  let policyReferral = new PolicyReferral()
  let rinkebyAccounts = [{ address: "0x9c9e609d5940b1eb6097dba837659dd39e3ed20d", policyId: 28, chainId: 4 }]

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

  describe("isReferralCodeUsable", () => {
    it("will return a valid response", async () => {
      const res = await policyReferral.isReferralCodeUsable("AQ3CH", 4)
      console.log(res)
    })
  })
})
