import type { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import type { Log } from 'viem'

export type DecoderInput = {
  log: Log
  blockNumber: number
  blockTimestamp: UnixTime
  transactionHash: string
  transactionLogs: Log[]
  transactionTo: EthereumAddress
}
