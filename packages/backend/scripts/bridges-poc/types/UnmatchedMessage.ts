export interface UnmatchedMessage {
  id: string
  direction: 'outbound' | 'inbound'
  messagingProtocol: string
  txHash: string
  timestamp: number
  originChain?: string
  destinationChain?: string
  type: string
}
