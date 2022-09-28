type Failure = { Message: string }

type Success = {
  user: string
  promo_code: string
  chain_id: number
  policy_id: number
}

export type ApplyPromoCodeResponse = Success | Failure

export interface InfoResponse {
  result: RewardsInfo
}

export interface InfoResponseArray {
  result: AppliedPromoCode[]
}

export interface RewardsInfo {
  referral_codes: ReferralCode[]
  applied_referral_codes: AppliedReferralCode[]
  applied_promo_codes: AppliedPromoCode[]
  reward_accounting: RewardAccounting
  referred_users: AppliedReferralCode[]
}

export interface ReferralCode {
  referral_code?: string
  user: string
  chain_id: number
  policy_id: number
  reward_amount: number
  created_time: string
  updated_time: string
}

export interface AppliedReferralCode {
  id?: number
  user: string
  referral_code?: string
  chain_id: number
  policy_id: number
  created_time: string
  updated_time: string
}

export interface AppliedPromoCode {
  id?: number
  user: string
  promo_code?: string
  chain_id: number
  policy_id: number
  created_time: string
  updated_time: string
}

export interface RewardAccounting {
  updated_time: string
  promo_rewards: number
  referred_count: number
  user: string
  used_rewards: number
  created_time: string
  referred_earns: number
}
