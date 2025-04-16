import type { UnixTime } from '@l2beat/shared-pure'

export type Address = `${string}:${string}`
export type Hash256 = `0x${string}`

export interface CrossChainTransfer {
  protocol: string
  source: {
    chain: string
    txHash: string
    timestamp: UnixTime
    sender: Address
    token: Address
    amount: bigint
  }
  destination: {
    chain: string
    txHash: string
    timestamp: UnixTime
    recipient: Address
    token: Address
    amount: bigint
  }
}

export type CrossChainMessage =
  | GnosisBridgeSend
  | GnosisBridgeReceive
  | PolygonPosSend

export interface CommonMessage {
  timestamp: UnixTime
  chain: string
  txHash: string
}

export interface GnosisBridgeSend extends CommonMessage {
  type: 'GnosisBridgeSend'
  messageId: Hash256
  sourceChain: string
  destinationChain: string
  sender: Address
  token: Address
  amount: bigint
}

export interface GnosisBridgeReceive extends CommonMessage {
  type: 'GnosisBridgeReceive'
  messageId: Hash256
  sourceChain: string
  destinationChain: string
  recipient: Address
  token: Address
  amount: bigint
}

export interface PolygonPosSend extends CommonMessage {
  type: 'PolygonPosSend'
  escrow: Address
  sourceChain: string
  destinationChain: string
  sender: Address
  recipient: Address
  token: Address
  amount: bigint
}
