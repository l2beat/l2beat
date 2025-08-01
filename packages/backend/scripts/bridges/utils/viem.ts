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

export function extractAddressFromPadded(bytes32String: string): Hex {
  if (!bytes32String.startsWith('0x') || bytes32String.length !== 66) {
    throw new Error(
      `Invalid bytes32 string format. Expected '0x' prefix and 64 hex characters, but got: ${bytes32String}`,
    )
  }

  const addressPart = bytes32String.slice(-40)

  return `0x${addressPart}`
}
