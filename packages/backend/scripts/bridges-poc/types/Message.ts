export interface Message {
  id: string
  messagingProtocol: string
  app: string

  originChain: string
  originTxHash: string
  originTimestamp: number
  originType: string

  destinationChain: string
  destinationTxHash: string
  destinationTimestamp: number
  destinationType: string
}
