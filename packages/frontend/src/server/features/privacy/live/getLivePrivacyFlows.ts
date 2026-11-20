import type { Database } from '@l2beat/database'
import { getPrivacyBucketAddress } from '@l2beat/shared'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { ps } from '~/server/projects'
import {
  type LivePrivacyChain,
  type LivePrivacyState,
  overlayLivePrivacyFlows,
} from './overlayLivePrivacyFlows'

/** As the backend names its indexers of flows, hourly and at a chain's head, and the comparison of the two */
const HOURLY_INDEXER = 'privacy_flow_indexer'
const LIVE_INDEXER = 'live_privacy_flow'
const LIVE_CHECK = 'privacy.flow'
/** Blocks the usual gap between a chain's blocks is taken from */
const RECENT_BLOCKS = 64
/** Flows are returned one by one, so not from further back than a chart's last period can end */
const MAX_AGE = 3 * UnixTime.DAY

export const LivePrivacyFlowsParams = v.object({
  projectIds: v.array(v.string()),
  /**
   * Flows from this time on are returned. A page that puts them on top of a
   * chart passes the end of the chart's last period that every bucket has
   * fully indexed, and cuts the chart there
   */
  since: v.number(),
})

export type LivePrivacyFlowsParams = v.infer<typeof LivePrivacyFlowsParams>

export interface LivePrivacyFlow {
  projectId: string
  bucketId: string
  chain: string
  direction: 'deposit' | 'withdrawal'
  timestamp: number
  txHash: string
  count: number
  /** In the token's base units */
  amount: string
  /** Undefined for a flow whose hour is not sealed: an hour is priced once it has passed */
  valueUsd: number | undefined
}

export interface LivePrivacyFlowsResponse {
  /** The chains the projects have flows on, and whether their newest flows are in `live` */
  chains: LivePrivacyChain[]
  /**
   * Buckets on the chains shown that have no flows in `sealed` and `live`,
   * as not all would be there: their hourly data is being read again or is
   * still catching up
   */
  incompleteBuckets: string[]
  /** From the hourly data, from `since` on. Final */
  sealed: LivePrivacyFlow[]
  /**
   * Newer than the hourly data has. Provisional: a reorg can still take one
   * back. With `sealed` and a chart that ends at `since`, every flow is
   * there once, as all three were cut at the same blocks in one snapshot
   */
  live: LivePrivacyFlow[]
}

export async function getLivePrivacyFlows(
  params: LivePrivacyFlowsParams,
): Promise<LivePrivacyFlowsResponse> {
  if (params.projectIds.length === 0 || env.MOCK) {
    return { chains: [], incompleteBuckets: [], sealed: [], live: [] }
  }
  const now = UnixTime.now()
  if (params.since < now - MAX_AGE) {
    throw new Error('Flows asked for from too far back', {
      cause: { since: params.since },
    })
  }

  const projects = await ps.getProjects({
    ids: params.projectIds.map(ProjectId),
    select: ['privacyInfo'],
  })
  const chains = new Set(
    projects.flatMap((project) =>
      project.privacyInfo.tokens.flatMap((token) =>
        token.buckets.map(
          (bucket) => getPrivacyBucketAddress(bucket.address).chain,
        ),
      ),
    ),
  )

  const { state, sealed } = await loadLivePrivacyFlows(getDb(), {
    projectIds: params.projectIds,
    chains: [...chains],
    since: params.since,
  })
  const overlay = overlayLivePrivacyFlows(state, params.since, now)
  return {
    chains: overlay.chains,
    incompleteBuckets: overlay.leftOut,
    // a bucket that is left out is left out whole: its hourly flows from
    // `since` on are not all there either
    sealed: sealed
      .filter((flow) => !overlay.leftOut.includes(flow.bucketId))
      .map((flow) => toFlow(flow, flow.valueUsd)),
    live: overlay.flows.map((flow) => toFlow(flow, undefined)),
  }
}

/**
 * Reads the sealed flows, the flows stored at the head and everything that
 * says where one ends and the other begins, in one snapshot of the database
 */
export function loadLivePrivacyFlows(
  db: Database,
  params: { projectIds: string[]; chains: string[]; since: UnixTime },
) {
  return db.snapshot(async () => {
    const [stored, cursors, heads, newest, mismatched, flows, sealed] =
      await Promise.all([
        db.indexerConfiguration.getByIndexerIds(
          params.chains.map((chain) => `${HOURLY_INDEXER}::${chain}`),
        ),
        db.chainHeadCursor.getAll(),
        db.chainHead.getAll(),
        db.liveCheck.getNewestByChain(LIVE_CHECK),
        db.liveCheck.getChainsWith(LIVE_CHECK, 'mismatch'),
        db.livePrivacyFlowEvent.getByProjectIds(params.projectIds),
        db.privacyFlowEvent.getByProjectIdsSince(
          params.projectIds,
          params.since,
        ),
      ])

    const sealedBlocks = new Map<string, Promise<number | undefined>>()
    const getSealedBlock = (chain: string, sealedUntil: number | null) => {
      if (sealedUntil === null) return undefined
      // the block the hourly indexer reads an hour's flows up to
      const hour = UnixTime.toEndOf(sealedUntil, 'hour')
      const key = `${chain}:${hour}`
      const block =
        sealedBlocks.get(key) ??
        db.privacyBlockTimestamp.findBlockNumberByChainAndTimestamp(chain, hour)
      sealedBlocks.set(key, block)
      return block
    }
    const configurations = await Promise.all(
      stored
        .map((c) => ({ ...c, ...parseProperties(c.properties) }))
        .filter((c) => params.projectIds.includes(c.projectId))
        .map(async (c) => {
          const chain = c.indexerId.slice(`${HOURLY_INDEXER}::`.length)
          return {
            id: c.id,
            chain,
            bucketId: c.bucketId,
            sealedUntil: c.currentHeight ?? undefined,
            sealedBlock: await getSealedBlock(chain, c.currentHeight),
          }
        }),
    )

    const live = cursors.filter(
      (c) =>
        c.indexerId === `${LIVE_INDEXER}::${c.chain}` &&
        params.chains.includes(c.chain),
    )
    const recent = await Promise.all(
      live.map(async (cursor) => {
        const [[block], newest] = await Promise.all([
          db.chainBlock.getByNumberRange(
            cursor.chain,
            cursor.number,
            cursor.number,
          ),
          db.chainBlock.getNewest(cursor.chain, RECENT_BLOCKS),
        ])
        const [first, last] = [newest.at(0), newest.at(-1)]
        return {
          chain: cursor.chain,
          onHead: block?.hash === cursor.hash,
          gap:
            first && last && newest.length > 1
              ? (last.timestamp - first.timestamp) / (newest.length - 1)
              : undefined,
        }
      }),
    )

    const state: LivePrivacyState = {
      configurations,
      cursors: new Map(live.map((c) => [c.chain, c])),
      onHead: new Set(recent.filter((r) => r.onHead).map((r) => r.chain)),
      heads: new Map(heads.map((head) => [head.chain, head])),
      blockGaps: new Map(
        recent.flatMap((r) => (r.gap === undefined ? [] : [[r.chain, r.gap]])),
      ),
      // The newest hours matched, and so did hours with flows in them since
      // the live flows were last started: hours with no flows match whatever
      // is stored at the head
      matched: new Set(
        newest
          .filter((n) => {
            const started = live.find((c) => c.chain === n.chain)?.startedAt
            return (
              n.status === 'match' &&
              n.matchedRowsUntil !== undefined &&
              started !== undefined &&
              n.matchedRowsUntil >= started
            )
          })
          .map((n) => n.chain),
      ),
      mismatched: new Set(mismatched),
      flows,
    }
    return { state, sealed }
  })
}

const Properties = v.object({ projectId: v.string(), bucketId: v.string() })

/** A configuration is stored with its properties as JSON */
function parseProperties(properties: string) {
  return Properties.parse(JSON.parse(properties))
}

function toFlow(
  flow: {
    projectId: string
    bucketId: string
    chain: string
    direction: 'deposit' | 'withdrawal'
    timestamp: number
    txHash: string
    count: number
    amount: bigint
  },
  valueUsd: number | undefined,
): LivePrivacyFlow {
  return {
    projectId: flow.projectId,
    bucketId: flow.bucketId,
    chain: flow.chain,
    direction: flow.direction,
    timestamp: flow.timestamp,
    txHash: flow.txHash,
    count: flow.count,
    amount: flow.amount.toString(),
    valueUsd,
  }
}
