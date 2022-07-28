import { BigNumber } from "ethers"
import { isAddress } from "ethers/lib/utils"
import { SOLACE_COVER_PRODUCT_V3_ADDRESS } from "../constants"
import { GetByUserResponse, InfoResponse, InfoResponseArray } from "../types"
import axios, { AxiosResponse } from "axios"

export class PolicyReferral {
  baseApiUrl: string

  constructor() {
    this.baseApiUrl = "https://2vo3wfced8.execute-api.us-west-2.amazonaws.com/prod/"
  }

  private async postReferralCode(account: string, policyId: BigNumber, chainId: number): Promise<string | undefined> {
    const response = await axios({
      url: `https://risk-data.solace.fi/referral-codes`,
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
    const data = (await response.json()) as InfoResponse
    const _referralCode = data.result?.referral_codes?.[0]?.referral_code
    return _referralCode
  }

  public async getUserReferralCode(
    account: string,
    policyId: BigNumber,
    chainId: number
  ): Promise<{ code: string | undefined; status: boolean }> {
    if (policyId.isZero() || !isAddress(account) || !isAddress(SOLACE_COVER_PRODUCT_V3_ADDRESS[chainId] ?? ""))
      return { code: undefined, status: false }

    const getUserReferralCodeUrl = `${this.baseApiUrl}referral-codes?user=${account}`
    const response: GetByUserResponse = await axios({
      url: getUserReferralCodeUrl,
      method: "GET"
    }).then((response: AxiosResponse<any, any>) => {
      return response.data
    })
    const _referralCode: string | undefined = response.result?.[0]?.referral_code

    if (!_referralCode) {
      const postedReferralCode = await this.postReferralCode(account, policyId, chainId)
      return { code: postedReferralCode, status: true }
    } else {
      return { code: _referralCode, status: true }
    }
  }

  public async getInfo(
    account: string,
    policyId: BigNumber,
    chainId: number
  ): Promise<{
    earnedAmount: number
    referredCount: number
    appliedCode: string
    status: boolean
  }> {
    if (policyId.isZero() || !isAddress(account) || !isAddress(SOLACE_COVER_PRODUCT_V3_ADDRESS[chainId] ?? ""))
      return {
        earnedAmount: 0,
        referredCount: 0,
        appliedCode: "",
        status: false
      }
    const response: InfoResponse = await axios({
      url: "https://risk-data.solace.fi/rewards-info",
      method: "GET",
      params: {
        user: account
      }
    }).then((response: AxiosResponse<any, any>) => {
      return response.data
    })
    const _earnedAmount = response.result?.reward_accounting?.referred_earns ?? 0
    const _referredCount = response.result?.referred_users.length ?? 0
    const _appliedCode = response.result?.applied_referral_codes?.[0]?.referral_code ?? ""
    return { earnedAmount: _earnedAmount, referredCount: _referredCount, appliedCode: _appliedCode, status: true }
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

    const info = _info ?? (await this.getInfo(account, policy_id, chain_id))
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
      return response.data
    })
    const data = await response.json()
    const _appliedCode: string | undefined = data.result?.referral_code
    let message = "_appliedCode" ?? "code not found"
    if (!_appliedCode) message = "Failure"
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
    const data = (await response.json()) as InfoResponseArray
    const canBeUsed = data.result?.length > 0
    return canBeUsed
  }
}
