import { type Abi, type Log, decodeEventLog } from 'viem'
import type { ChainInfo } from '../../config/chains'
import type { Address } from '../types'

export type LogWithTimestamp = Log & { timestamp: number }

export function address(
  chain: ChainInfo | string,
  unprefixed: `0x${string}`,
): Address {
  if (typeof chain === 'string') {
    return `${chain}:${unprefixed}`
  }
  return `${chain.addressPrefix}:${unprefixed}`
}

export function safeDecodeLog<A extends Abi>(abi: A, log: Log) {
  try {
    return decodeEventLog({ abi, ...log })
  } catch {
    return undefined
  }
}
