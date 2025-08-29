export interface Message {
  id: string
  messagingProtocol: string
  associated: {
    app: string
    transferId: string
  }[]

  originChain: string
  originTxHash: string
  originTimestamp: number
  originType: string

  destinationChain: string
  destinationTxHash: string
  destinationTimestamp: number
  destinationType: string
}
