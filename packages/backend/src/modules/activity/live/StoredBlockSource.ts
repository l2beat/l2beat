import type { Logger } from '@l2beat/backend-tools'
import type { Database, LiveActivityBlockRecord } from '@l2beat/database'
import type { ProjectId } from '@l2beat/shared-pure'
import type { ActivityBlockSource } from '../indexers/types'
import type { ActivityBlock } from '../services/txs/types'

export interface BlockHashSource {
  getBlockHash(number: number): Promise<string>
}

/**
 * Reads the blocks the head follower stored, counted already, and fetches only
 * the ones it has not: before it started, after a reorg it gave up on, or
 * once they are cleaned up
 */
export class StoredBlockSource implements ActivityBlockSource {
  constructor(
    private readonly $: {
      projectId: ProjectId
      db: Database
      fallback: ActivityBlockSource
      hashes: BlockHashSource
    },
    private readonly logger: Logger,
  ) {
    this.logger = logger.for(this).tag({ tag: $.projectId })
  }

  async getBlocks(from: number, to: number): Promise<ActivityBlock[]> {
    const stored = await this.$.db.liveActivityBlock.getByProjectNumberRange(
      this.$.projectId,
      from,
      to,
    )
    const onChain = await this.keepOnChain(stored)
    const missing = getMissingRanges(
      from,
      to,
      onChain.map((block) => block.number),
    )
    if (missing.length > 0) {
      this.logger.info('Fetching blocks the head follower did not store', {
        from,
        to,
        stored: stored.length,
        onChain: onChain.length,
      })
    }

    const fetched = await Promise.all(
      missing.map(([start, end]) => this.$.fallback.getBlocks(start, end)),
    )
    return [
      ...onChain.map((block) => ({
        number: block.number,
        timestamp: block.timestamp,
        txsCount: block.count,
        uopsCount: block.uopsCount,
      })),
      ...fetched.flat(),
    ].sort((a, b) => a.number - b.number)
  }

  /**
   * A reorg while the follower was down can leave stored blocks the chain no
   * longer has, and the follower finds them only on its next run. Each block
   * was stored as the child of the one before, so a run of them is still on
   * the chain when its newest block is. A run that cannot be checked is
   * fetched, as the fallback may reach other RPCs
   */
  private async keepOnChain(
    stored: LiveActivityBlockRecord[],
  ): Promise<LiveActivityBlockRecord[]> {
    const runs = toLinkedRuns(stored)
    const kept = await Promise.all(
      runs.map(async (run) => {
        const newest = run[run.length - 1]
        try {
          const hash = await this.$.hashes.getBlockHash(newest.number)
          return hash === newest.hash ? run : []
        } catch (error) {
          this.logger.warn('Cannot check stored blocks against the chain', {
            number: newest.number,
            error,
          })
          return []
        }
      }),
    )
    return kept.flat()
  }
}

/** Ascending blocks split where one is not the child of the one before */
function toLinkedRuns(
  blocks: LiveActivityBlockRecord[],
): LiveActivityBlockRecord[][] {
  const runs: LiveActivityBlockRecord[][] = []
  for (const block of blocks) {
    const run = runs.at(-1)
    const previous = run?.at(-1)
    if (
      run &&
      previous &&
      block.number === previous.number + 1 &&
      block.parentHash === previous.hash
    ) {
      run.push(block)
    } else {
      runs.push([block])
    }
  }
  return runs
}

/** The runs of numbers from `from` to `to` that are not in `numbers`, which ascend */
function getMissingRanges(
  from: number,
  to: number,
  numbers: number[],
): [number, number][] {
  const ranges: [number, number][] = []
  let next = from
  for (const number of [...numbers, to + 1]) {
    if (number > next) ranges.push([next, number - 1])
    next = number + 1
  }
  return ranges
}
