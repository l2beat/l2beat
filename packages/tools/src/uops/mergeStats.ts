import type { BlockRatio, SmartAccountUsage, StatsBatch } from './api'

const TOP_BLOCKS_COUNT = 10

export type AggregatedStats = Omit<StatsBatch, 'smartAccountUsage'> & {
  smartAccountUsage: SmartAccountUsage[]
}

export function mergeStats(
  previous: AggregatedStats | undefined,
  batch: StatsBatch,
): AggregatedStats {
  const usage = new Map<string, number>()
  for (const item of previous?.smartAccountUsage ?? []) {
    usage.set(item.signature, item.count)
  }
  for (const item of batch.smartAccountUsage ?? []) {
    usage.set(item.signature, (usage.get(item.signature) ?? 0) + item.count)
  }

  return {
    startBlock: batch.startBlock,
    endBlock: previous?.endBlock ?? batch.endBlock,
    dateStart: batch.dateStart,
    dateEnd: previous?.dateEnd ?? batch.dateEnd,
    numberOfBlocks: (previous?.numberOfBlocks ?? 0) + batch.numberOfBlocks,
    numberOfTransactions:
      (previous?.numberOfTransactions ?? 0) + batch.numberOfTransactions,
    numberOfOperations:
      (previous?.numberOfOperations ?? 0) + batch.numberOfOperations,
    topBlocks: batch.topBlocks
      .concat(previous?.topBlocks ?? [])
      .sort(rankBlocks)
      .slice(0, TOP_BLOCKS_COUNT),
    smartAccountUsage: Array.from(usage, ([signature, count]) => ({
      signature,
      count,
    })),
  }
}

function rankBlocks(a: BlockRatio, b: BlockRatio): number {
  if (a.includesUnknown !== b.includesUnknown) {
    return a.includesUnknown ? -1 : 1
  }
  if (a.includesBatch !== b.includesBatch) {
    return a.includesBatch ? -1 : 1
  }
  return b.ratio - a.ratio
}
