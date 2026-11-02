import type { L2SummaryEntry } from '~/server/features/layer2s/summary/getL2SummaryEntries'

export interface L2SummaryTableProps {
  entries: L2SummaryEntry[]
  isLoading: boolean
  skeletonCount: number
}
