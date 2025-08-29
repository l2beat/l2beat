export type UnmatchedMessage = Wormhole_Outbound | Wormhole_Inbound

export type Wormhole_Outbound = BaseMessage & {
  type: 'Wormhole_Outbound'
  originChain: string
}

export type Wormhole_Inbound = BaseMessage & {
  type: 'L2BEAT_SYNTHETIC_Wormhole_Inbound'
  destinationChain: string
}

type BaseMessage = {
  id: string
  direction: 'outbound' | 'inbound'
  messagingProtocol: string
  txHash: string
  timestamp: number
}
