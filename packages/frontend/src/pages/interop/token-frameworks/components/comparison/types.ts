import type { ComparisonSide } from '../../../components/comparison/types'
import type { InteropTokenFramework } from '../../getInteropTokenFrameworksData'

export type ComparableEntry = {
  volume: number
  transferCount: number
  averageDurationSeconds: number | null
  averageValue: number | null
}

export type Side = {
  framework: InteropTokenFramework
  entry: ComparableEntry
}

export function toComparisonSide(
  side: Side | undefined,
): ComparisonSide | undefined {
  return side
    ? { label: side.framework.label, color: side.framework.color }
    : undefined
}
