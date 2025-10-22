export interface InteropComparePlugin {
  name: string
  type: 'message' | 'transfer'
  getExternalItems: () => Promise<InteropExternalItem[]>
}

export interface InteropExternalItem {
  srcTxHash: string
  dstTxHash: string
}
