export interface UnmatchedTransfer {
  id: string
  app: string
  direction: 'outbound' | 'inbound'
  timestamp: number
  txHash: string

  originChain?: string
  originToken?: string
  originAmount?: bigint

  destinationChain?: string
  destinationToken?: string
  destinationAmount?: bigint

  type: string
}
