import type { Block, Log } from '@l2beat/shared-pure'
import type { Log as ViemLog } from 'viem'
import { toInteropTransaction } from '../../dto/interopTransaction'
import type { LogToCapture, TxToCapture } from '../../plugins/types'

export interface ItemsToCapture {
  txsToCapture: TxToCapture[]
  logsToCapture: LogToCapture[]
}

// BlockIndexer passes the same block and logs objects to every block processor,
// and InteropSyncersManager passes them on to every cluster syncer. Preparing
// the items once per block and sharing them saves one full pass per consumer
// (18 on a chain with 17 clusters). Consumers must treat the items as
// read-only. The WeakMap lets the entry go away with the block itself.
const preparedBlocks = new WeakMap<
  Block,
  { chain: string; logs: Log[]; items: ItemsToCapture }
>()

export function getItemsToCapture(
  chain: string,
  block: Block,
  logs: Log[],
): ItemsToCapture {
  const prepared = preparedBlocks.get(block)
  if (prepared && prepared.chain === chain && prepared.logs === logs) {
    return prepared.items
  }
  const items = prepareItemsToCapture(chain, block, logs)
  preparedBlocks.set(block, { chain, logs, items })
  return items
}

function prepareItemsToCapture(
  chain: string,
  block: Block,
  logs: Log[],
): ItemsToCapture {
  const logsByTx = new Map<string, ViemLog[]>()
  for (const log of logs) {
    const viemLog = logToViemLog(log)
    const txLogs = logsByTx.get(log.transactionHash)
    if (txLogs) {
      txLogs.push(viemLog)
    } else {
      logsByTx.set(log.transactionHash, [viemLog])
    }
  }

  const txsToCapture: TxToCapture[] = []
  const logsToCapture: LogToCapture[] = []
  for (const tx of block.transactions) {
    if (!tx.hash) {
      continue // TODO: why can this be missing!?
    }
    const txToCapture: TxToCapture = {
      block,
      tx: toInteropTransaction(tx),
      chain,
      txLogs: logsByTx.get(tx.hash) ?? [],
    }
    txsToCapture.push(txToCapture)
    for (const log of txToCapture.txLogs) {
      logsToCapture.push({ log, ...txToCapture })
    }
  }
  return { txsToCapture, logsToCapture }
}

export function logToViemLog(log: Log): ViemLog {
  return {
    blockNumber: BigInt(log.blockNumber),
    blockHash: log.blockHash as `0x${string}`,
    transactionHash: log.transactionHash as `0x${string}`,
    address: log.address as `0x${string}`,
    topics: log.topics as [`0x${string}`, ...`0x${string}`[]] | [],
    data: log.data as `0x${string}`,
    logIndex: log.logIndex,

    // Unsupported values for now
    transactionIndex: -1,
    removed: false,
  }
}
