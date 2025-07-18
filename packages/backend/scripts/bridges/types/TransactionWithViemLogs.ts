import type { EVMTransaction } from '@l2beat/shared'
import type { UnixTime } from '@l2beat/shared-pure'
import type { Log } from 'viem'

export type TransactionWithViemLogs = EVMTransaction & {
  blockNumber: number
  blockTimestamp: UnixTime
  logs: Log[]
}
