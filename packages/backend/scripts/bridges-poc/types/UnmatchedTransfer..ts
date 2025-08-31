export type UnmatchedTransfer = Portal_Inbound

export type Portal_Inbound = BaseTransfer & {
  type: 'Portal_Inbound'
  destinationChain: string
  wormholeMessageId: string
}

type BaseTransfer = {
  id: string
  app: string
  txHash: string
  timestamp: number
  blockNumber: number
}
