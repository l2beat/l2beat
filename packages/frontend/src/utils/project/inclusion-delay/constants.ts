import type { DelayThreshold } from './types'

export const ETHEREUM_COMPARISON_SLOT_SECONDS = 12

export const INCLUSION_DELAY_THRESHOLDS: readonly DelayThreshold[] = [
  { label: '1h', seconds: 60 * 60 },
  { label: '1d', seconds: 86_400 },
  { label: '7d', seconds: 7 * 86_400 },
  { label: '30d', seconds: 30 * 86_400 },
]
