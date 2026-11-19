import type { Logger } from '@l2beat/backend-tools'
import type {
  Database,
  LiveCheckStatus,
  PrivacyFlowEventRecord,
} from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import {
  createIndexerId,
  INDEXER_NAMES,
} from '../../../tools/uif/indexerIdentity'
import { resolvePrivacyBlockRange } from '../utils/privacyLogIndexerUtils'
import { LIVE_PRIVACY_FLOWS_KEPT_FOR } from './LivePrivacyFlowIndexer'

/** The name privacy flows go by in the stored results */
export const PRIVACY_FLOW_CHECK = 'privacy.flow'

type Flow = Pick<
  PrivacyFlowEventRecord,
  | 'configurationId'
  | 'txHash'
  | 'logIndex'
  | 'blockNumber'
  | 'timestamp'
  | 'count'
  | 'amount'
>

/**
 * Compares the flows the hourly indexer is about to store with the ones
 * stored block by block for the same blocks. The two read the chain on their
 * own, an hour or more apart, so a difference means the live flows cannot be
 * shown on top of the hourly ones as they are. Each result is stored: whoever
 * reads the live flows leaves out a chain that has a mismatch
 */
export class LivePrivacyFlowCheck {
  constructor(
    private readonly $: { chain: string; db: Database },
    private readonly logger: Logger,
  ) {
    this.logger = logger.for(this).tag({ tag: $.chain, chain: $.chain })
  }

  /**
   * `sealed` are all the flows of these configurations in the hours, both
   * ends as the hourly indexer takes them. Never fails: the hours are stored
   * whatever the newest blocks say. Run it outside a transaction, or the
   * live rows are not read in one snapshot
   */
  async run(
    configurationIds: string[],
    from: number,
    to: number,
    sealed: Flow[],
  ): Promise<void> {
    try {
      const live = await this.getLive(configurationIds, from, to)
      const range = {
        from,
        to,
        blockFrom: live.blockFrom,
        blockTo: live.blockTo,
      }
      if (live.flows === undefined) {
        this.logger.info('Live flows do not cover the hours', {
          ...range,
          liveFrom: live.cursor?.sinceNumber,
          liveTo: live.cursor?.number,
        })
        await this.storeUncovered(from, to)
        return
      }

      const difference = compare(sealed, live.flows)
      await this.store(
        from,
        to,
        difference.total === 0 ? 'match' : 'mismatch',
        { ...difference, compared: sealed.length },
      )
      if (difference.total === 0) {
        this.logger.info('Live flows match the hourly ones', {
          ...range,
          flows: sealed.length,
        })
      } else {
        this.logger.error('Live flows differ from the hourly ones', {
          ...range,
          ...difference,
        })
      }
    } catch (error) {
      this.logger.warn('Live flows could not be compared', { from, to, error })
      // or an older match would go on standing for the chain's newest hours
      await this.storeUncovered(from, to).catch(() => {})
    }
  }

  /**
   * Stored, so that the hours compared can be told from the hours skipped.
   * Not for hours older than live flows are kept, as when a new configuration
   * catches up: they could never have been covered
   */
  private async storeUncovered(from: number, to: number) {
    if (to >= UnixTime.now() - LIVE_PRIVACY_FLOWS_KEPT_FOR) {
      await this.store(from, to, 'uncovered')
    }
  }

  private async store(
    from: number,
    to: number,
    status: LiveCheckStatus,
    difference = { compared: 0, missing: 0, extra: 0, changed: 0 },
  ) {
    await this.$.db.liveCheck.upsert({
      feature: PRIVACY_FLOW_CHECK,
      chain: this.$.chain,
      from,
      to,
      status,
      compared: difference.compared,
      missing: difference.missing,
      extra: difference.extra,
      changed: difference.changed,
      checkedAt: UnixTime.now(),
    })
  }

  /**
   * Without flows when the newest blocks stored do not cover every block of
   * the hours, or the head no longer has the block they were read up to
   */
  private async getLive(configurationIds: string[], from: number, to: number) {
    const { blockFrom, blockTo } = await resolvePrivacyBlockRange(
      this.$.db.privacyBlockTimestamp,
      this.$.chain,
      from,
      to,
    )
    // one snapshot, or the cursor could promise blocks whose flows the
    // second query no longer finds
    return await this.$.db.snapshot(async () => {
      const cursor = await this.$.db.chainHeadCursor.findByIndexerId(
        createIndexerId(INDEXER_NAMES.LIVE_PRIVACY_FLOW, this.$.chain),
      )
      if (
        cursor === undefined ||
        cursor.sinceNumber > blockFrom ||
        cursor.number < blockTo
      ) {
        return { blockFrom, blockTo, cursor, flows: undefined }
      }
      // between the head dropping blocks and the live indexer hearing of it,
      // the live flows are of blocks the chain no longer has
      const [block] = await this.$.db.chainBlock.getByNumberRange(
        this.$.chain,
        cursor.number,
        cursor.number,
      )
      if (block?.hash !== cursor.hash) {
        return { blockFrom, blockTo, cursor, flows: undefined }
      }
      const ids = new Set(configurationIds)
      const flows = await this.$.db.livePrivacyFlowEvent.getByChainInBlockRange(
        this.$.chain,
        blockFrom,
        blockTo,
      )
      return {
        blockFrom,
        blockTo,
        cursor,
        flows: flows.filter((flow) => ids.has(flow.configurationId)),
      }
    })
  }
}

function compare(sealed: Flow[], live: Flow[]) {
  const liveByKey = new Map(live.map((flow) => [key(flow), flow]))
  const sealedKeys = new Set(sealed.map(key))

  const missing = sealed.filter((flow) => !liveByKey.has(key(flow)))
  const extra = live.filter((flow) => !sealedKeys.has(key(flow)))
  const changed = sealed.filter((flow) => {
    const other = liveByKey.get(key(flow))
    return (
      other !== undefined &&
      (other.blockNumber !== flow.blockNumber ||
        other.timestamp !== flow.timestamp ||
        other.count !== flow.count ||
        other.amount !== flow.amount)
    )
  })

  return {
    total: missing.length + extra.length + changed.length,
    /** Stored for the hours, not for the newest blocks */
    missing: missing.length,
    /** Stored for the newest blocks, not for the hours */
    extra: extra.length,
    /** Stored by both, in another block or with another time, count or amount */
    changed: changed.length,
    examples: [...missing, ...extra, ...changed].slice(0, 5).map(key),
  }
}

function key(flow: Flow) {
  return `${flow.configurationId}:${flow.txHash}:${flow.logIndex}`
}
