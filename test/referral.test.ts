/**
 * @jest-environment node
 */

import { BigNumber } from "ethers"
import { PolicyReferral } from "../src/apis/referral"

describe("PolicyReferral", () => {
  let policyReferral = new PolicyReferral()
  let rinkebyAccounts = [
    "0x0fb78424e5021404093aa0cfcf50b176b30a3c1d",
    "0x6849310926127f819d48894dea667f3ecd18a07c",
    "0x7e0874834B8e309aC98D747e0019066Eb57f3Ea7",
    "0x84fc70e796e0339001a027202e1dde7d01ba347b",
    "0xdd9a4112508a448f80096224c6b69799bce42cbc",
    "0x09748f07b839edd1d79a429d3ad918f670d602cd",
    "0x59733c7cd78d08dab90368ad2cc09c8c81f097c0",
    "0x1fc6e73075c584dbdda0e53449e2c944986b9a72",
    "0x7e0874834b8e309ac98d747e0019066eb57f3ea7",
    "0xc585bbf1e19ff471f72e10b4afc6c4885eb11a3d",
    "0x507af49146e8b29b0778af89f6224d07e31a113d",
    "0x9a1768f92c57e7b0f609364185c92404049f4f3b",
    "0x17dbe35f2225d5c08564cede1ae6d014888a604b",
    "0x75e4455606347cc00c4b2ac7176e3ab28ea2635e",
    "0xc2ce57069dfd639fb0e6a783eb39bcb743fa2d3c",
    "0x9549bf77f664f12c3a6b96f6a631e5bf02d52d60",
    "0xfb5caae76af8d3ce730f3d62c6442744853d43ef",
    "0x129531165eb932385f7d2ce5022ed9d72c7e6b67",
    "0x6cf218ce6539161dc028857c6de14503e685444b",
    "0xa7499aa6464c078eeb940da2fc95c6acd010c3cc",
    "0x45c2ad385af67a8a771f0b78311b3aa3b50d60a0",
    "0x8b80755c441d355405ca7571443bb9247b77ec16",
    "0xe73bef17f3b54b0b5fb3795a1f0ac87a2702ec7d",
    "0x6849310926127f819d48894dea667f3ecd18a07c",
    "0xa4c86a9706605611a6954a5f70fe9f8afc5018ce",
    "0x091c8a414ba05b5112cc104f5309398417c09160",
    "0x34bb9e91dc8ac1e13fb42a0e23f7236999e063d4"
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
          const res = await policyReferral.getInfo(account, BigNumber.from(15), 4)
          a.push(res)
        })
      )
      console.log(a)
    })
  })

  // describe("applyCode", () => {
  //   it("will return a valid response", async () => {
  //     const res = await policyReferral.applyCode(
  //       "0xdd9a4112508a448f80096224c6b69799bce42cbc",
  //       "FOCP2",
  //       BigNumber.from(19),
  //       4
  //     )
  //     console.log(res)
  //   })
  // })
})
