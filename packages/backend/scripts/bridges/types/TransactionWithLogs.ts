import type { UnixTime } from '@l2beat/shared-pure'
import type { Log } from 'viem'

export type TransactionWithLogs = {
  hash: string
  blockNumber: number
  blockTimestamp: UnixTime
  logs: Log[]
}

export type DecoderInput = {
  log: Log
  blockNumber: number
  blockTimestamp: UnixTime
  transactionHash: string
  transactionLogs: Log[]
}
