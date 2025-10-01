export interface BridgeComparePlugin {
  name: string
  type: 'message' | 'transfer'
  getExternalItems: () => Promise<BridgeExternalItem[]>
}

export interface BridgeExternalItem {
  srcChain: string
  srcTxHash: string
  srcSymbol?: string
  srcAmount?: number
  dstChain: string
  dstTxHash: string
  dstSymbol?: string
  dstAmount?: number
}
