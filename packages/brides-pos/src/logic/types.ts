import type { UnixTime } from '@l2beat/shared-pure'

export type Address = `${string}:${string}`
export type Hash256 = `0x${string}`

export interface CrossChainSend {
  timestamp: UnixTime
  protocol: string
  source: {
    chain: string
    txHash: string
    token: Address
    amount: bigint
    sender: Address
  }
  destination: {
    chain: string
    token: Address
    amount: bigint
    recipient: Address
  }
}

export interface CrossChainMessage {
  timestamp: UnixTime
  chain: string
  txHash: string
  payload: CrossChainPayload
}

export type CrossChainPayload = GnosisBridgeSend | GnosisBridgeReceive

export interface GnosisBridgeSend {
  messageId: Hash256
  sourceChain: string
  destinationChain: string
  sender: Address
  token: Address
  amount: bigint
}

export interface GnosisBridgeReceive {
  messageId: Hash256
  sourceChain: string
  destinationChain: string
  recipient: Address
  token: Address
  amount: bigint
}
