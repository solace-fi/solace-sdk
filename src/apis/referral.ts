import { BigNumber } from "ethers"
import { isAddress } from "ethers/lib/utils"
import { SOLACE_COVER_PRODUCT_V3_ADDRESS } from "../constants"
import { InfoResponse } from "../types"
import axios, { AxiosResponse } from "axios"

export class PolicyReferral {
  baseApiUrl: string

  constructor() {
    this.baseApiUrl = "https://risk-data.solace.fi/"
  }

  private async postReferralCode(account: string, policyId: BigNumber, chainId: number): Promise<string | undefined> {
    const response = await axios({
      url: `${this.baseApiUrl}referral-codes`,
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      data: {
        user: account,
        chain_id: chainId,
        policy_id: policyId.toNumber()
      }
    }).then((response: AxiosResponse<any, any>) => {
      return response.data
    })
    console.log("postReferralCode", response)
    const _referralCode = response.result?.referral_codes?.[0]?.referral_code
    return _referralCode
  }

  public async getInfo(
    account: string,
    policyId: BigNumber,
    chainId: number
  ): Promise<{
    earnedAmount: number
    referredCount: number
    appliedCode: string
    referralCode: string
    status: boolean
  }> {
    if (policyId.isZero() || !isAddress(account) || !isAddress(SOLACE_COVER_PRODUCT_V3_ADDRESS[chainId] ?? ""))
      return {
        earnedAmount: 0,
        referredCount: 0,
        appliedCode: "",
        referralCode: "",
        status: false
      }
    const response: InfoResponse = await axios({
      url: `${this.baseApiUrl}rewards-info`,
      method: "GET",
      params: {
        user: account
      }
    }).then((response: AxiosResponse<any, any>) => {
      return response.data
    })
    let _referralCode = response.result?.referral_codes?.[0]?.referral_code
    if (!_referralCode) _referralCode = await this.postReferralCode(account, policyId, chainId)
    const _earnedAmount = response.result?.reward_accounting?.referred_earns ?? 0
    const _referredCount = response.result?.referred_users.length ?? 0
    const _appliedCode = response.result?.applied_referral_codes?.[0]?.referral_code ?? ""
    return {
      earnedAmount: _earnedAmount,
      referredCount: _referredCount,
      appliedCode: _appliedCode,
      referralCode: _referralCode ?? "",
      status: true
    }
  }

  public async applyCode(
    account: string,
    referral_code: string,
    policy_id: BigNumber,
    chain_id: number,
    _info?: { earnedAmount: number | undefined; referredCount: number | undefined; appliedCode: string | undefined }
  ): Promise<{ message: string; status: boolean }> {
    if (!isAddress(account)) return { message: "Invalid account", status: false }
    if (policy_id.isZero()) return { message: "Invalid policy id", status: false }
    if (!isAddress(SOLACE_COVER_PRODUCT_V3_ADDRESS[chain_id] ?? ""))
      return { message: "Invalid chain id", status: false }

    let info = _info
    if (!info) info = await this.getInfo(account, policy_id, chain_id)
    console.log("applyCode info", info)
    if (info.appliedCode) return { message: "Already applied", status: false }
    const response = await axios({
      url: `${this.baseApiUrl}referral-codes/apply`,
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      data: {
        user: account,
        chain_id,
        policy_id: policy_id.toNumber(),
        referral_code
      }
    }).then((response: AxiosResponse<any, any>) => {
      console.log("applyCode1", response)
      return response.data
    })
    console.log("applyCode2", response)
    const _appliedCode: string | undefined = response.result?.referral_code
    let message = _appliedCode ?? "not found"
    if (!_appliedCode) message = "failure"
    return { message, status: true }
  }

  public async isReferralCodeUsable(referral_code: string): Promise<boolean> {
    const url = `${this.baseApiUrl}referral-codes?referral_code=${referral_code}`
    const response = await axios({
      url: url,
      method: "GET"
    }).then((response: AxiosResponse<any, any>) => {
      return response.data
    })
    const canBeUsed = response.result?.length > 0
    return canBeUsed
  }
}
