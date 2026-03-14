export type PluginStatus = {
  pluginName: string
  chain: string
  syncMode?: string
  toBlock?: string
  toTimestamp?: number
  lastError?: string
  resyncRequestedFrom?: number
}

export type ProcessorStatus = {
  chain: string
  block: number
  timestamp: number
}

export type InteropEventStats = {
  type: string
  direction?: string
  count: number
  matched: number
  unmatched: number
  oldUnmatched: number
  unsupported: number
}

export type InteropEventKind =
  | 'all'
  | 'matched'
  | 'unmatched'
  | 'old-unmatched'
  | 'unsupported'

export type InteropEventDetails = {
  plugin: string
  type: string
  direction?: string
  timestamp: number
  chain: string
  txHash: string
  logIndex: number
  srcChain?: string
  dstChain?: string
  args: string
}

export type InteropChainMetadata = {
  id: string
  display: string
  explorerUrl?: string
}

export type InteropMessageChainStats = {
  srcChain: string
  dstChain: string
  count: number
  avgDuration: number
}

export type InteropMessageStats = {
  plugin: string
  type: string
  count: number
  avgDuration: number
  knownAppCount: number
  chains: InteropMessageChainStats[]
}

export type InteropMessageDetails = {
  plugin: string
  type: string
  messageId: string
  app: string
  duration?: number
  timestamp: number
  srcChain?: string
  srcTxHash?: string
  srcLogIndex?: number
  dstChain?: string
  dstTxHash?: string
  dstLogIndex?: number
}

export type InteropTransferChainStats = {
  srcChain: string
  dstChain: string
  count: number
  avgDuration: number
  srcValueSum: number
  dstValueSum: number
}

export type InteropTransferStats = {
  plugin: string
  type: string
  count: number
  avgDuration: number
  srcValueSum: number
  dstValueSum: number
  chains: InteropTransferChainStats[]
}

export type InteropTransferDetails = {
  plugin: string
  type: string
  transferId: string
  bridgeType?: string
  duration: number
  timestamp: number
  srcChain: string
  srcTxHash: string
  srcLogIndex: number
  srcTokenAddress?: string
  srcAbstractTokenId?: string
  srcSymbol?: string
  srcAmount?: number
  srcValueUsd?: number
  srcWasBurned?: boolean
  dstChain: string
  dstTxHash: string
  dstLogIndex: number
  dstTokenAddress?: string
  dstAbstractTokenId?: string
  dstSymbol?: string
  dstAmount?: number
  dstValueUsd?: number
  dstWasMinted?: boolean
}

export type InteropMissingTokenInfo = {
  chain: string
  tokenAddress: string
  count: number
  plugins: string[]
}

export type InteropKnownAppsPerPlugin = {
  plugin: string
  apps: string[]
}

export type InteropAggregateNotIncludedByPlugin = {
  plugin: string
  bridgeType: string
  count: number
  totalValueUsd: number
}

export type InteropAggregateDurationSplitCoverage = {
  projectId: string
  projectName: string
  bridgeType: string
  observedTransferTypes: string[]
  includedSplits: {
    label: string
    transferTypes: string[]
  }[]
  notIncludedTransferTypes: string[]
}

export type InteropAggregates = {
  fromTimestamp: number
  toTimestamp: number
  configCount: number
  latestTransfersCount: number
  unconsumedTransfers: InteropTransferDetails[]
  notIncludedByPlugin: InteropAggregateNotIncludedByPlugin[]
  durationSplitCoverage: InteropAggregateDurationSplitCoverage[]
}

export type InteropCoveragePieSlice = {
  label: string
  rawChains: string[]
  isSupported: boolean
  count: number
  pctOfTotal: number
  color: string
}

export type InteropCoveragePieChart = {
  id: string
  title: string
  centerLabel: string
  totalCount: number
  supportedCount: number
  unsupportedCount: number
  supportedPct: number
  unsupportedPct: number
  slices: InteropCoveragePieSlice[]
}

export type InteropCoveragePies = {
  collapseThresholdPct: number
  generatedAt: string
  charts: InteropCoveragePieChart[]
}

export type InteropAnomalyZScore = {
  robust: number | null
  classic: number | null
}

export type InteropAnomalyCountStats = {
  last: number
  prevDay: number | null
  prev7d: number | null
  z: InteropAnomalyZScore
  isFlatLine: boolean
  isRatioDrop: boolean
  isRatioSpike: boolean
}

export type InteropAnomalyVolumeStats = {
  valueUsd: {
    last: number
    prevDay: number | null
    prev7d: number | null
  }
  avgValuePerTransfer: {
    last: number | null
    prevDay: number | null
    prev7d: number | null
  }
  z: InteropAnomalyZScore
  isRatioDrop: boolean
  isRatioSpike: boolean
}

export type InteropAnomalySrcDstDiffStats = {
  lastPercent: number | null
  prevDayPercent: number | null
  prev7dPercent: number | null
  isHigh: boolean
}

export type InteropAnomalyDataPoint = {
  day: string
  transferCount: number
  totalSrcValueUsd: number
  totalDstValueUsd: number
}

export type InteropAnomalyRow = {
  id: string
  timestamp: string
  interpretation: string
  counts: InteropAnomalyCountStats
  srcVolume: InteropAnomalyVolumeStats
  dstVolume: InteropAnomalyVolumeStats
  srcDstDiff: InteropAnomalySrcDstDiffStats
  rawDataPoints: InteropAnomalyDataPoint[]
  dataPoints: InteropAnomalyDataPoint[]
}

export type InteropAnomalySuspiciousTransfer = {
  plugin: string
  transferId: string
  type: string
  timestamp: number
  srcChain: string
  dstChain: string
  srcTokenAddress?: string
  dstTokenAddress?: string
  srcSymbol?: string
  dstSymbol?: string
  srcValueUsd?: number
  dstValueUsd?: number
  srcTxHash: string
  dstTxHash: string
  valueDifferencePercent: number
}

export type InteropAnomaliesOverview = {
  stats: InteropAnomalyRow[]
  suspiciousTransfers: InteropAnomalySuspiciousTransfer[]
  valueDiffThresholdPercent: number
  minimumSideValueUsdThreshold: number
}

export type InteropAnomalySeriesPoint = {
  timestamp: number
  transferCount: number
  totalDurationSum: number
  totalSrcValueUsd: number
  totalDstValueUsd: number
}

export type InteropAnomalySeries = {
  id: string
  points: InteropAnomalySeriesPoint[]
}
