import type {
  ChainHeadCursorRecord,
  ChainHeadRecord,
  LivePrivacyFlowEventRecord,
} from '@l2beat/database'
import type { UnixTime } from '@l2beat/shared-pure'
import {
  getLiveChainStatus,
  type LiveChainStatus,
} from '../../live/getLiveChainStatus'

export interface LivePrivacyChain extends LiveChainStatus {
  chain: string
}

/** A configuration of the hourly indexer: one direction of one bucket */
export interface LivePrivacyConfiguration {
  id: string
  chain: string
  bucketId: string
  /** The hourly data has the configuration's flows up to this time. Undefined before its first hours are stored */
  sealedUntil: UnixTime | undefined
  /** The last block whose flows the hourly data has for the configuration. Undefined when that is not known */
  sealedBlock: number | undefined
}

export interface LivePrivacyState {
  configurations: LivePrivacyConfiguration[]
  /** Of the indexers that store flows at the head, by chain */
  cursors: Map<string, ChainHeadCursorRecord>
  /** Chains whose head still has the block the cursor stopped at */
  onHead: Set<string>
  heads: Map<string, ChainHeadRecord>
  /** Seconds between a chain's newest blocks, on average */
  blockGaps: Map<string, number>
  /** Chains whose newest sealed hours matched what was stored at the head */
  matched: Set<string>
  /** Chains with an hour sealed differently from what was stored at the head */
  mismatched: Set<string>
  flows: LivePrivacyFlowEventRecord[]
}

/**
 * Picks the flows stored at the head that the hourly data does not have yet,
 * and says for each chain whether they can be shown on top of it. Everything
 * in `state` has to come from one snapshot of the database: the cursor is
 * what promises that the flows between two blocks are all there.
 *
 * A configuration's flows start right above the last block the hourly data
 * has for it, so a flow is never counted twice and none is left out in
 * between. The seam is per configuration and not per bucket: a bucket's
 * deposits and withdrawals are sealed on their own, and one can be behind.
 *
 * `since` is where whoever asks has the hourly data up to, as a chart does
 * up to its last full period. A configuration is left out, and its bucket
 * named in `leftOut`, when what is stored cannot stand for its flows from
 * there on: the hourly data ends below `since`, as while it is read again,
 * or the flows stored at the head start above where the hourly data ends,
 * as while a new configuration catches up. Its bucket is left out whole,
 * the other direction with it: a sum with a hole would read as a sum
 */
export function overlayLivePrivacyFlows(
  state: LivePrivacyState,
  since: UnixTime,
  now: UnixTime,
): {
  chains: LivePrivacyChain[]
  flows: LivePrivacyFlowEventRecord[]
  leftOut: string[]
} {
  const chains = [...new Set(state.configurations.map((c) => c.chain))]
    .sort()
    .map((chain) => ({
      chain,
      ...getLiveChainStatus(
        {
          cursor: state.cursors.get(chain),
          onHead: state.onHead.has(chain),
          heardAt: state.heads.get(chain)?.confirmedAt,
          blockGap: state.blockGaps.get(chain),
          matched: state.matched.has(chain),
          mismatched: state.mismatched.has(chain),
        },
        now,
      ),
    }))
  const shown = new Set(
    chains
      .filter((c) => c.status === 'live' || c.status === 'delayed')
      .map((c) => c.chain),
  )

  const onShown = state.configurations.filter((c) => shown.has(c.chain))
  /** By configuration: the last block the hourly data has */
  const seams = new Map<string, number>()
  const leftOut = new Set<string>()
  for (const configuration of onShown) {
    const { sealedUntil, sealedBlock } = configuration
    const storedFrom = state.cursors.get(configuration.chain)?.sinceNumber
    if (
      sealedUntil !== undefined &&
      sealedUntil >= since &&
      sealedBlock !== undefined &&
      storedFrom !== undefined &&
      storedFrom <= sealedBlock + 1
    ) {
      seams.set(configuration.id, sealedBlock)
    } else {
      leftOut.add(configuration.bucketId)
    }
  }

  const flows = state.flows.filter((flow) => {
    const seam = seams.get(flow.configurationId)
    return (
      shown.has(flow.chain) &&
      // half a bucket would read as the whole of it
      !leftOut.has(flow.bucketId) &&
      seam !== undefined &&
      flow.blockNumber > seam
    )
  })
  return { chains, flows, leftOut: [...leftOut].sort() }
}
