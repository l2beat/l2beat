import type { OssificationValueSource } from '~/server/features/projects/ossification/getOssificationSeries'

export const OSSIFICATION_VALUE_LABELS = {
  tvs: { short: 'TVS', long: 'TVS' },
  defillama: { short: 'TVL', long: 'TVL (source: DefiLlama)' },
} satisfies Record<OssificationValueSource, { short: string; long: string }>
