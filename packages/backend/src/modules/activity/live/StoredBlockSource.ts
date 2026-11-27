import type { Logger } from '@l2beat/backend-tools'
import type { Database, LiveActivityBlockRecord } from '@l2beat/database'
import { type ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ActivityBlockSource } from '../indexers/types'
import type { ActivityBlock } from '../services/txs/types'

export interface BlockHashSource {
  getBlockHash(number: number): Promise<string>
}

/** The name stored blocks go by in the results of comparing them with a fresh count */
export const ACTIVITY_CHECK = 'activity'

/**
 * Reads the blocks the live indexer stored, counted already, and fetches only
 * the ones it has not: before it started, after a reorg past every block the
 * chain head remembered, or once they are cleaned up. Stored counts keep the adjustment of when they
 * were stored, so recounting a project also means deleting its stored blocks.
 *
 * The hours sealed from stored blocks are only as right as the live count.
 * So one stored block of every read is counted afresh, and the result
 * stored in `LiveCheck` under the project's id, a row a day. A count that
 * differs is not sealed: the read and every one after it is fetched, until a
 * person has looked and deleted the row
 */
export class StoredBlockSource implements ActivityBlockSource {
  /**
   * A stored count differed from a fresh one, with the result still stored.
   * Read on the first call, and again on every call while it is so, to see
   * the row deleted
   */
  private mismatched: boolean | undefined

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
    const kept = await this.keepOnChain(stored)
    const onChain = (await this.countsAgree(kept)) ? kept : []
    const missing = getMissingRanges(
      from,
      to,
      onChain.map((block) => block.number),
    )
    if (missing.length > 0) {
      this.logger.info('Fetching blocks the live indexer did not store', {
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
   * Counts the newest of the stored blocks afresh and stores how it compares.
   * False when it differs, or did on an earlier read with the result still
   * stored: the stored blocks are then not to be sealed
   */
  private async countsAgree(
    blocks: LiveActivityBlockRecord[],
  ): Promise<boolean> {
    if (this.mismatched !== false) {
      this.mismatched = (
        await this.$.db.liveCheck.getChainsWith(ACTIVITY_CHECK, 'mismatch')
      ).includes(this.$.projectId)
    }
    if (this.mismatched) return false

    const sample = blocks.at(-1)
    if (sample === undefined) return true
    let fresh: ActivityBlock | undefined
    try {
      ;[fresh] = await this.$.fallback.getBlocks(sample.number, sample.number)
    } catch (error) {
      // the read goes on from the stored blocks, as it did before this check
      this.logger.warn('Cannot count a stored block afresh', {
        number: sample.number,
        error,
      })
      return true
    }

    const agree =
      fresh !== undefined &&
      fresh.txsCount === sample.count &&
      fresh.uopsCount === sample.uopsCount
    const day = UnixTime.toStartOf(sample.timestamp, 'day')
    await this.$.db.liveCheck.upsert({
      feature: ACTIVITY_CHECK,
      chain: this.$.projectId,
      from: day,
      to: day + UnixTime.DAY,
      status: agree ? 'match' : 'mismatch',
      compared: 1,
      missing: 0,
      extra: 0,
      changed: agree ? 0 : 1,
      checkedAt: UnixTime.now(),
    })
    if (!agree) {
      this.mismatched = true
      this.logger.error('Stored block counted differently afresh', {
        number: sample.number,
        stored: { txsCount: sample.count, uopsCount: sample.uopsCount },
        fresh: fresh && {
          txsCount: fresh.txsCount,
          uopsCount: fresh.uopsCount,
        },
      })
    }
    return agree
  }

  /**
   * A reorg while the chain head was down can leave stored blocks the chain no
   * longer has, and the head finds them only on its next tick. Each block
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
