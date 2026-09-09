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
  'tvsConfig' | 'contracts' | 'permissions' | 'discoveryInfo' | 'zkCatalogInfo'
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
  /** Worst identity verdict of the cell; shown as a badge when not private. */
  identity: PrivacyExposure
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

const SEVERITY: Record<PrivacyExposure, number> = {
  private: 0,
  unverifiable: 1,
  atRisk: 2,
  exposed: 3,
}

function worstFieldExposure(
  cell: ProjectPrivacyAdversaries['cells'][PrivacyAdversaryId],
  field: PrivacyField,
): PrivacyExposure {
  let result: PrivacyExposure = 'private'
  for (const map of [cell.boundary, cell.interior]) {
    if (!map) continue
    const leak = map[field]
    const exposure = typeof leak === 'string' ? leak : leak.verdict
    if (SEVERITY[exposure] > SEVERITY[result]) result = exposure
  }
  return result
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
        identity: cell.identity,
        alsoExposed: cell.alsoExposed.map((field) => ({
          field,
          label: adversaries.fields.find((f) => f.id === field)?.label ?? field,
          exposure: worstFieldExposure(cell, field),
        })),
      }
    }),
  }
}
