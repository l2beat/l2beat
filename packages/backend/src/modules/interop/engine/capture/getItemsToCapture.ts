import type { Block, Log } from '@l2beat/shared-pure'
import type { Log as ViemLog } from 'viem'
import type { LogToCapture, TxToCapture } from '../../plugins/types'

export function getItemsToCapture(chain: string, block: Block, logs: Log[]) {
  const viemLogs = logs.map(logToViemLog)
  const logsToCapture: LogToCapture[] = []
  const txsToCapture = block.transactions
    .filter((x) => !!x.hash) // TODO: why can this be missing!?
    .map(
      (tx): TxToCapture => ({
        block,
        tx,
        chain,
        txLogs: viemLogs.filter((log) => log.transactionHash === tx.hash),
      }),
    )
  for (const tx of txsToCapture) {
    for (const log of tx.txLogs) {
      logsToCapture.push({ log, ...tx })
    }
  }
  return { txsToCapture, logsToCapture }
}

export function logToViemLog(log: Log): ViemLog {
  return {
    blockNumber: BigInt(log.blockNumber),
    transactionHash: log.transactionHash as `0x${string}`,
    address: log.address as `0x${string}`,
    topics: log.topics as [`0x${string}`, ...`0x${string}`[]] | [],
    data: log.data as `0x${string}`,
    logIndex: log.logIndex,

    // Unsupported values for now
    blockHash: 'UNSUPPORTED' as `0x${string}`,
    transactionIndex: -1,
    removed: false,
  }
}
