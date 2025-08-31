import type { Hex } from 'viem'

export type UnmatchedMessage = Wormhole_Outbound

export type Wormhole_Outbound = BaseMessage & {
  type: 'Wormhole_Outbound'
  originChain: string
  sender: string
  payload: Hex
}

type BaseMessage = {
  id: string
  messagingProtocol: string
  txHash: string
  timestamp: number
  blockNumber: number
}
