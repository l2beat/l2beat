export interface BridgeComparePlugin {
  name: string
  type: 'message' | 'transfer'
  getExternalItems: () => Promise<BridgeExternalItem[]>
}

export interface BridgeExternalItem {
  srcTxHash: string
  dstTxHash: string
}
