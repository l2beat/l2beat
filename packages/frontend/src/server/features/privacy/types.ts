import type {
  PrivacyAdversaryId,
  PrivacyAdversarySentiment,
  PrivacyExposure,
  PrivacyField,
  PrivacyPromise,
  Project,
  ProjectPrivacyAdversaries,
  ProjectZkCatalogInfo,
} from '@l2beat/config'

export type PrivacyProject = Project<
  'display' | 'privacyInfo' | 'statuses',
  | 'tvsConfig'
  | 'contracts'
  | 'permissions'
  | 'discoveryInfo'
  | 'discoveryUpdates'
  | 'zkCatalogInfo'
> & {
  /** Own zkCatalogInfo trusted setups, or those of privacyInfo.zkCatalogId. */
  trustedSetups: ProjectZkCatalogInfo['trustedSetups']
}
export interface PrivacyDepositedValueUsd {
  total: number
  last7d: number
  last30d: number
}

export interface PrivacyRelayerStat {
  /**
   * activeRelayers - unique relayer addresses seen in onchain withdrawals
   * over the last 30 days.
   * avgDailyRelayers - average count of unique relayers seen in daily
   * network observations over the last 30 days.
   */
  kind: 'activeRelayers' | 'avgDailyRelayers'
  value: number
}

export interface PrivacyBucket {
  id: string
  label: string
  type: 'pool' | 'denomination'
  denomination?: string
  totalAmount: number | null
  totalValueUsd: number | null
  deposits: {
    total: number
    last7d: number
    last30d: number
  }
  depositedValueUsd: PrivacyDepositedValueUsd
}

export interface PrivacyAsset {
  symbol: string
  iconUrl: string
  address?: string
  decimals: number
  bucketCount: number
  totalAmount: number
  totalValueUsd: number | null
  deposits: {
    total: number
    last7d: number
    last30d: number
  }
  depositedValueUsd: PrivacyDepositedValueUsd
  buckets: PrivacyBucket[]
}

/** One adversary cell, reduced to what tooltips and dots need. */
export interface PrivacyAdversarySummaryCell {
  id: PrivacyAdversaryId
  label: string
  value: string
  sentiment: PrivacyAdversarySentiment
  condition: string
  exposure: string
  /** Other fields leaking beyond the public observer, with their labels. */
  alsoExposed: {
    field: PrivacyField
    label: string
    exposure: PrivacyExposure
  }[]
}

export interface PrivacyAdversariesSummary {
  promise: PrivacyPromise
  /** Fields in display order, for legends. */
  fields: ProjectPrivacyAdversaries['fields']
  /** In spine order: public observer, chain analyst, network observer, insider, future. */
  cells: PrivacyAdversarySummaryCell[]
}

function interiorExposure(
  cell: ProjectPrivacyAdversaries['cells'][PrivacyAdversaryId],
  field: PrivacyField,
): PrivacyExposure {
  const leak = cell.interior?.[field]
  if (leak === undefined) return 'private'
  return typeof leak === 'string' ? leak : leak.verdict
}

export function toPrivacyAdversariesSummary(
  adversaries: ProjectPrivacyAdversaries,
): PrivacyAdversariesSummary {
  return {
    promise: adversaries.promise,
    fields: adversaries.fields,
    cells: adversaries.adversaries.map((adversary) => {
      const cell = adversaries.cells[adversary.id]
      return {
        id: adversary.id,
        label: adversary.label,
        value: cell.value,
        sentiment: cell.sentiment,
        condition: cell.condition,
        exposure: cell.exposure,
        alsoExposed: cell.alsoExposed.map((field) => ({
          field,
          label: adversaries.fields.find((f) => f.id === field)?.label ?? field,
          exposure: interiorExposure(cell, field),
        })),
      }
    }),
  }
}
