import type { ChainInfo } from '../../config/chains'
import type { CrossChainMessage } from '../types'
import type { LogWithTimestamp } from './common'
import { decodeGnosisBridge } from './gnosis'
import { decodePolygonPosBridge } from './polygon'

const decoders = [decodeGnosisBridge, decodePolygonPosBridge]

export function analyzeLogs(
  logs: LogWithTimestamp[],
  chain: ChainInfo,
): CrossChainMessage[] {
  const txs: CrossChainMessage[] = []
  for (const log of logs) {
    if (!log.transactionHash || log.removed) {
      continue
    }
    let message: CrossChainMessage | undefined
    for (const decoder of decoders) {
      message = decoder(log, chain)
      if (message) {
        break
      }
    }
    if (!message) {
      continue
    }
    txs.push(message)
  }
  return txs
}
