import type { PromotionRule, RuleViolation } from './types'

interface Lane {
  id: string
  bridgeType: string
  srcChain: string
  dstChain: string
}

/** Deterministic lane identity; must not include magnitudes or timestamps. */
export function laneScope(lane: Lane): string {
  return `${lane.id}|${lane.bridgeType}|${lane.srcChain}|${lane.dstChain}`
}

function laneValueUsd(transfer: {
  srcValueUsd?: number
  dstValueUsd?: number
}): number {
  // Matches the displayed volume: getInteropTransferValue = max(src, dst).
  return Math.max(transfer.srcValueUsd ?? 0, transfer.dstValueUsd ?? 0)
}

/**
 * Kick-off rule: blocks when ANY single lane's volume exceeds the ceiling.
 * Per-lane (no summation), so it needs no subgroup/aggregate de-duplication and
 * directly targets the failure mode of one bad price inflating a single lane.
 */
export function maxLaneVolumeRule(thresholdUsd: number): PromotionRule {
  return {
    name: 'maxLaneVolume',
    evaluate(ctx) {
      const violations: RuleViolation[] = []
      for (const transfer of ctx.transfers) {
        const value = laneValueUsd(transfer)
        if (value > thresholdUsd) {
          violations.push({
            rule: 'maxLaneVolume',
            scope: laneScope(transfer),
            value,
            threshold: thresholdUsd,
            message: `lane ${transfer.id} ${transfer.bridgeType} ${transfer.srcChain}->${transfer.dstChain} volume ${formatUsd(value)} exceeds ${formatUsd(thresholdUsd)}`,
          })
        }
      }
      return violations
    },
  }
}

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export function formatUsd(value: number): string {
  return usdFormatter.format(value)
}
