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
