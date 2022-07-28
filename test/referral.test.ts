/**
 * @jest-environment node
 */

import { BigNumber } from "ethers"
import { PolicyReferral } from "../src/apis/referral"

describe("PolicyReferral", () => {
  let policyReferral = new PolicyReferral()
  let account = "0x34Bb9e91dC8AC1E13fb42A0e23f7236999e063D4"

  beforeEach(() => {
    // Avoid jest avoid timeout error
    jest.setTimeout(20000)
  })

  describe("getUserReferralCode", () => {
    it("will return a valid response", async () => {
      const res = await policyReferral.getUserReferralCode(account, BigNumber.from(1), 1)
      console.log(res)
    })
  })

  describe("getInfo", () => {
    it("will return a valid response", async () => {
      const res = await policyReferral.getInfo(account, BigNumber.from(1), 137)
      console.log(res)
    })
  })
})
