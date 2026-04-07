export interface InteropTransferTypeStats {
  transferCount: number
  totalDurationSum: number
}

export type InteropTransferTypeStatsMap = Record<
  string,
  InteropTransferTypeStats
>
