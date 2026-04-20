import type { InteropDurationSplit } from '@l2beat/config'
import type { InteropTransferRecord } from '@l2beat/database'
import { InteropTransferClassifier } from '@l2beat/shared'
import {
  getInteropTransferValue,
  type InteropBridgeType,
  type KnownInteropBridgeType,
} from '@l2beat/shared-pure'
import type { InteropAggregationConfig } from '../../../../../config/features/interop'

export interface NotIncludedInAggregatesRow {
  plugin: string
  bridgeType: InteropBridgeType
  count: number
  totalValueUsd: number
}

export interface DurationSplitCoverageRow {
  projectId: string
  projectName: string
  bridgeType: KnownInteropBridgeType
  observedTransferTypes: string[]
  includedSplits: {
    label: string
    transferTypes: string[]
  }[]
  notIncludedTransferTypes: string[]
}

export function buildNotIncludedInAggregatesRows(
  transfers: InteropTransferRecord[],
): NotIncludedInAggregatesRow[] {
  const grouped = new Map<string, { count: number; totalValueUsd: number }>()

  for (const transfer of transfers) {
    const bridgeType =
      transfer.bridgeType ?? InteropTransferClassifier.inferBridgeType(transfer)
    const key = `${transfer.plugin}:${bridgeType}`
    const valueUsd = getInteropTransferValue(transfer) ?? 0

    const existing = grouped.get(key)
    if (existing) {
      existing.count += 1
      existing.totalValueUsd += valueUsd
    } else {
      grouped.set(key, { count: 1, totalValueUsd: valueUsd })
    }
  }

  return Array.from(grouped.entries())
    .map(([key, { count, totalValueUsd }]) => {
      const [plugin, bridgeType] = key.split(':') as [string, InteropBridgeType]

      return { plugin, bridgeType, count, totalValueUsd }
    })
    .sort((a, b) => b.totalValueUsd - a.totalValueUsd)
}

export function buildDurationSplitCoverageRows(
  transfers: InteropTransferRecord[],
  configs: InteropAggregationConfig[],
): DurationSplitCoverageRow[] {
  const classifier = new InteropTransferClassifier()
  const rows: DurationSplitCoverageRow[] = []

  for (const config of configs) {
    if (!config.durationSplit) continue

    const classifiedTransfers = classifier.classifyTransfers(
      transfers,
      config.plugins,
    )

    for (const [bridgeType, durationSplit] of Object.entries(
      config.durationSplit,
    ) as [KnownInteropBridgeType, InteropDurationSplit][]) {
      const includedSplits = durationSplit.map((split) => ({
        label: split.label,
        transferTypes: [...new Set(split.transferTypes)].sort(),
      }))
      const includedTransferTypes = new Set(
        includedSplits.flatMap((split) => split.transferTypes),
      )
      const observedTransferTypes = [
        ...new Set(
          classifiedTransfers[bridgeType].map((transfer) => transfer.type),
        ),
      ].sort()

      rows.push({
        projectId: config.id,
        projectName: config.shortName ?? config.name ?? config.id,
        bridgeType,
        observedTransferTypes,
        includedSplits,
        notIncludedTransferTypes: observedTransferTypes.filter(
          (transferType) => !includedTransferTypes.has(transferType),
        ),
      })
    }
  }

  return [...rows].sort(
    (a, b) =>
      b.notIncludedTransferTypes.length - a.notIncludedTransferTypes.length ||
      a.projectName.localeCompare(b.projectName) ||
      a.bridgeType.localeCompare(b.bridgeType),
  )
}
