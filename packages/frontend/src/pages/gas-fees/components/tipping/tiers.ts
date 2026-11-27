import type { GasFeesTier } from '@l2beat/shared-pure'

export const TIER_LABELS: Record<
  GasFeesTier,
  { name: string; promise: string }
> = {
  slow: { name: 'Slow', promise: '95% within 1 minute' },
  medium: { name: 'Medium', promise: '95% within 2 blocks' },
  fast: { name: 'Fast', promise: '95% next block' },
}
