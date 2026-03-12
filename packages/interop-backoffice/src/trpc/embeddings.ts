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
