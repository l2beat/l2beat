import type { Block, Log } from '@l2beat/shared-pure'
import {
  computeLogsBloom,
  EMPTY_LOGS_BLOOM,
  mergeLogsBlooms,
} from './logsBloom'

export interface ConsistentBlock {
  block: Block
  logs: Log[]
}

export interface ConsistencyInput {
  /** Consecutive blocks of one batch. */
  blocks: Block[]
  /** Every log from `logsFromBlock` up to the last block. */
  logs: Log[]
  logsFromBlock: number
  /** Last resort for a block that has transactions but no logs. */
  confirmNoLogs: (block: Block) => Promise<boolean>
}

/**
 * Returns the longest prefix of the blocks whose logs are known to be
 * complete.
 *
 * Logs can disagree with blocks in two ways: a reorg between the two requests,
 * so the logs carry other block hashes, or a node that already serves a header
 * but not yet its logs, so nothing comes back for a block that does have
 * logs. Logs matched by block hash are trusted. A block without logs needs
 * proof that it really has none:
 *
 * - Where blocks are executed as they are produced, the header bloom is that
 *   proof: it is empty exactly when the block has no logs.
 * - Where execution is asynchronous (Avalanche C-Chain since Helicon,
 *   ACP-194) a header carries `settledHeight`, and its bloom covers the
 *   receipts of the blocks it settles, `(parent.settledHeight, settledHeight]`,
 *   rather than its own. Rebuilding that bloom from the fetched logs and
 *   matching it exactly proves the logs of every block in the range complete.
 *   Blocks not settled within the batch yet are confirmed through their
 *   receipts instead.
 */
export async function onlyConsistent(
  input: ConsistencyInput,
): Promise<ConsistentBlock[]> {
  const logsByHash = groupBy(input.logs, (log) => log.blockHash)
  const provenComplete = blocksProvenBySettlement(input)

  const result: ConsistentBlock[] = []
  for (const block of input.blocks) {
    const blockLogs = logsByHash.get(block.hash) ?? []
    const complete = await hasCompleteLogs(
      block,
      blockLogs,
      provenComplete,
      input.confirmNoLogs,
    )
    if (!complete) {
      break
    }
    result.push({ block, logs: blockLogs })
  }
  return result
}

async function hasCompleteLogs(
  block: Block,
  blockLogs: Log[],
  provenComplete: Set<number>,
  confirmNoLogs: (block: Block) => Promise<boolean>,
): Promise<boolean> {
  if (blockLogs.length > 0) {
    // https://polygonscan.com/block/79061984 has an empty bloom despite ten
    // logs, so logs matched by hash win over whatever the bloom says.
    return true
  }
  if (block.settledHeight === undefined) {
    return block.logsBloom === EMPTY_LOGS_BLOOM
  }
  if (block.transactions.length === 0 || provenComplete.has(block.number)) {
    return true
  }
  return await confirmNoLogs(block)
}

/**
 * Numbers of the blocks whose logs are proven complete by a settled range,
 * see `onlyConsistent`. A range reaching before the fetched logs cannot be
 * rebuilt and proves nothing.
 */
function blocksProvenBySettlement(input: ConsistencyInput): Set<number> {
  const { blocks, logsFromBlock } = input
  const logsByNumber = groupBy(input.logs, (log) => log.blockNumber)
  const bloomOf = (number: number) =>
    computeLogsBloom(logsByNumber.get(number) ?? [])

  const proven = new Set<number>()
  for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i]
    const parent = blocks[i - 1]
    if (
      block.settledHeight === undefined ||
      parent.settledHeight === undefined ||
      parent.number !== block.number - 1
    ) {
      continue
    }

    const settled = numbersBetween(
      parent.settledHeight + 1,
      block.settledHeight,
    )
    if (settled.length === 0 || settled[0] < logsFromBlock) {
      continue
    }
    if (mergeLogsBlooms(settled.map(bloomOf)) === block.logsBloom) {
      for (const number of settled) {
        proven.add(number)
      }
    }
  }
  return proven
}

function numbersBetween(from: number, to: number): number[] {
  const numbers: number[] = []
  for (let number = from; number <= to; number++) {
    numbers.push(number)
  }
  return numbers
}

function groupBy<T, K>(items: T[], key: (item: T) => K): Map<K, T[]> {
  const groups = new Map<K, T[]>()
  for (const item of items) {
    const group = groups.get(key(item))
    if (group) {
      group.push(item)
    } else {
      groups.set(key(item), [item])
    }
  }
  return groups
}
