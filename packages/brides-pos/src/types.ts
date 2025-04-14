import type { UnixTime } from '@l2beat/shared-pure'

export type Address = `${string}:${string}`

export interface CrossChainSend {
  timestamp: UnixTime
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

export interface ChainInfo {
  name: string
  addressPrefix: string
  chainId: number
}
