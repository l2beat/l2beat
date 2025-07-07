import type { EVMLog } from '@l2beat/shared'
import type { Hex, Log } from 'viem'

export function logToViemLog(log: EVMLog): Log {
  return {
    blockNumber: BigInt(log.blockNumber),
    transactionHash: log.transactionHash as Hex,
    address: log.address as Hex,
    topics: log.topics as [Hex, ...Hex[]] | [],
    data: log.data as Hex,

    // Unsupported values for now
    blockHash: 'UNSUPPORTED' as Hex,
    logIndex: -1,
    transactionIndex: -1,
    removed: false,
  }
}
