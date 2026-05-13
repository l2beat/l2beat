import type { PrivacyFlowExtractor } from '../types'

export const fixedAmount: PrivacyFlowExtractor<'fixedAmount'> = ({
  params,
}) => ({
  count: 1,
  amount: BigInt(params.amount),
})
