import type { Logger } from '@l2beat/backend-tools'
import type {
  Database,
  InteropChainCutoff,
  InteropEventTx,
  InteropPluginSyncStateRecord,
} from '@l2beat/database'
import type { UnixTime } from '@l2beat/shared-pure'
import { TimeLoop } from '../../../../tools/TimeLoop'
import type { InteropEventStore } from '../capture/InteropEventStore'
import type {
  InteropEventSyncer,
  ResyncablePluginCluster,
} from './InteropEventSyncer'

export class InteropDataCleaner extends TimeLoop {
  constructor(
    private readonly cluster: ResyncablePluginCluster,
    private readonly syncers: InteropEventSyncer[],
    private readonly store: InteropEventStore,
    private readonly db: Database,
    protected logger: Logger,
    intervalMs = 10000,
  ) {
    super({ intervalMs })
    this.logger = logger.for(this)
  }

  async run() {
    if (this.syncers.length === 0) {
      return
    }

    const syncStates = await this.db.interopPluginSyncState.findByPluginName(
      this.cluster.name,
    )
    if (syncStates.length === 0) {
      return
    }

    const statesByChain = new Map(
      syncStates.map((state) => [state.chain, state]),
    )

    const allWaitingForWipe = this.syncers.every(
      (syncer) => syncer.waitingForWipe,
    )
    const allWipeRequired = this.syncers.every(
      (syncer) => statesByChain.get(syncer.chain)?.wipeRequired === true,
    )

    if (!allWaitingForWipe || !allWipeRequired) {
      return
    }

    const isRestartFromNow = this.syncers.every(
      (syncer) => statesByChain.get(syncer.chain)?.resyncRequestedFrom === null,
    )

    await this.db.transaction(async () => {
      // First, so the wipe's memory updates are the last step before commit.
      await this.db.interopPluginSyncState.updateByPluginName(
        this.cluster.name,
        {
          wipeRequired: false,
        },
      )
      if (isRestartFromNow) {
        await this.wipeClusterData()
        await this.db.interopPluginSyncedRange.deleteByPluginName(
          this.cluster.name,
        )
      } else {
        await this.wipeResyncedData(getCutoffs(this.syncers, statesByChain))
      }
    })

    this.logger.info(
      isRestartFromNow
        ? 'Cluster data wiped for restart from now'
        : 'Cluster data wiped for resync',
      { pluginName: this.cluster.name },
    )
  }

  private async wipeClusterData() {
    for (const plugin of this.cluster.plugins) {
      await this.db.interopMessage.deleteForPlugin(plugin.name)
      await this.db.interopTransfer.deleteForPlugin(plugin.name)
      await this.store.deleteAllForPlugin(plugin.name)
    }
  }

  /**
   * Deletes only what the resync captures again: events after each chain's
   * cutoff, and every message and transfer with a side after it. Matching
   * rebuilds those from the recaptured events, so their events from before
   * the cutoff are made matchable again. That is done per tx, because a
   * match also consumes events its records don't name, like the
   * MessagePassed next to an OP stack bridge withdrawal.
   */
  private async wipeResyncedData(cutoffs: InteropChainCutoff[]) {
    const plugins = this.cluster.plugins.map((plugin) => plugin.name)
    await this.store.deleteForPluginsAfter(plugins, cutoffs)
    const deletedMatches = [
      ...(await this.db.interopMessage.deleteForPluginsAfter(plugins, cutoffs)),
      ...(await this.db.interopTransfer.deleteForPluginsAfter(
        plugins,
        cutoffs,
      )),
    ]
    await this.store.resetMatchedInTxs(
      plugins,
      getTxsBeforeCutoffs(deletedMatches, cutoffs),
    )
  }
}

interface MatchSides {
  srcChain: string | undefined
  srcTime: UnixTime | undefined
  srcTxHash: string | undefined
  dstChain: string | undefined
  dstTime: UnixTime | undefined
  dstTxHash: string | undefined
}

/**
 * A chain without a resync timestamp continues from its synced range, so
 * nothing is recaptured there and it gets no cutoff.
 */
function getCutoffs(
  syncers: InteropEventSyncer[],
  statesByChain: Map<string, InteropPluginSyncStateRecord>,
): InteropChainCutoff[] {
  const cutoffs: InteropChainCutoff[] = []
  for (const syncer of syncers) {
    const timestamp = statesByChain.get(syncer.chain)?.resyncRequestedFrom
    if (timestamp !== null && timestamp !== undefined) {
      cutoffs.push({ chain: syncer.chain, timestamp })
    }
  }
  return cutoffs
}

export function getTxsBeforeCutoffs(
  matches: MatchSides[],
  cutoffs: InteropChainCutoff[],
): InteropEventTx[] {
  const cutoffByChain = new Map(cutoffs.map((c) => [c.chain, c.timestamp]))
  const txs = new Map<string, InteropEventTx>()
  const add = (
    chain: string | undefined,
    txHash: string | undefined,
    timestamp: UnixTime | undefined,
  ) => {
    if (chain === undefined || !txHash || timestamp === undefined) {
      return
    }
    const cutoff = cutoffByChain.get(chain)
    if (cutoff !== undefined && timestamp > cutoff) {
      return
    }
    txs.set(`${chain}:${txHash.toLowerCase()}`, { chain, txHash, timestamp })
  }
  for (const match of matches) {
    add(match.srcChain, match.srcTxHash, match.srcTime)
    add(match.dstChain, match.dstTxHash, match.dstTime)
  }
  return Array.from(txs.values())
}
