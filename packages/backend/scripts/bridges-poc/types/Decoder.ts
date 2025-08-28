import type { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import type { Log } from 'viem'
import type { UnmatchedMessage } from './UnmatchedMessage'
import type { UnmatchedTransfer } from './UnmatchedTransfer.'

export interface Decoder {
  topic: string
  decoder: (input: DecoderInput) => DecoderOutput | Promise<DecoderOutput>
}

export interface DecoderInput {
  chain: string
  log: Log
  blockNumber: number
  blockTimestamp: UnixTime
  transactionHash: string
  transactionLogs: Log[]
  transactionTo?: EthereumAddress
}

export interface DecoderOutput {
  transfer?: UnmatchedTransfer
  message?: UnmatchedMessage
}
