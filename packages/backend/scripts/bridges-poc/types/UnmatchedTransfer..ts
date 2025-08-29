export type UnmatchedTransfer = Portal_Outbound | Portal_Inbound

export type Portal_Outbound = BaseTransfer & {
  type: 'Portal_Outbound'
  originAmount: bigint
  originChain: string
  destinationToken: string
  destinationAmount: bigint
  wormholeMessageId: string
}

export type Portal_Inbound = BaseTransfer & {
  type: 'Portal_Inbound'
  destinationChain: string
  wormholeMessageId: string
}

type BaseTransfer = {
  id: string
  app: string
  direction: 'outbound' | 'inbound'
  timestamp: number
  txHash: string
}
