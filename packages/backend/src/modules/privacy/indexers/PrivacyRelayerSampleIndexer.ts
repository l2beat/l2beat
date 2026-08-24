import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { assert, UnixTime } from '@l2beat/shared-pure'
import { Indexer } from '@l2beat/uif'
import { createPrivacyConfigurationId } from '../../../config/features/privacy'
import { INDEXER_NAMES } from '../../../tools/uif/indexerIdentity'
import { ManagedMultiIndexer } from '../../../tools/uif/multi/ManagedMultiIndexer'
import type {
  Configuration,
  ManagedMultiIndexerOptions,
  TrimRemovalConfiguration,
  WipeRemovalConfiguration,
} from '../../../tools/uif/multi/types'
import type { RailgunBroadcasterProvider } from '../railgun/RailgunBroadcasterProvider'
import type { PrivacyRelayerSampleIndexerConfig } from '../types'

const OBSERVATION_DURATION_MS = 10 * 60 * 1000

interface PrivacyRelayerSampleIndexerDeps
  extends Omit<
    ManagedMultiIndexerOptions<PrivacyRelayerSampleIndexerConfig>,
    'name' | 'logger'
  > {
  provider: RailgunBroadcasterProvider
  db: Database
}

export class PrivacyRelayerSampleIndexer extends ManagedMultiIndexer<PrivacyRelayerSampleIndexerConfig> {
  constructor(
    private readonly $: PrivacyRelayerSampleIndexerDeps,
    logger: Logger,
  ) {
    super(
      {
        ...$,
        name: INDEXER_NAMES.PRIVACY_RELAYER_SAMPLE,
        updateRetryStrategy: Indexer.getInfiniteRetryStrategy(),
      },
      logger,
    )
  }

  override async multiUpdate(
    _from: number,
    to: number,
    configurations: Configuration<PrivacyRelayerSampleIndexerConfig>[],
  ) {
    // Observations measure the current network state - a sample can only be
    // taken for the present day, never backfilled or backdated.
    const day = UnixTime.toStartOf(to, 'day')
    const today = UnixTime.toStartOf(UnixTime.now(), 'day')
    if (day !== today) {
      return () => Promise.resolve(to)
    }

    const sampled = new Set(
      await this.$.db.privacyRelayerSample.getConfigurationIdsByTimestamp(
        configurations.map((c) => c.id),
        day,
      ),
    )
    const unsampled = configurations.filter(
      (configuration) => !sampled.has(configuration.id),
    )
    if (unsampled.length === 0) {
      return () => Promise.resolve(to)
    }

    const chainIds = Array.from(
      new Set(
        unsampled.map((configuration) => configuration.properties.chainId),
      ),
    )
    const observations = await this.$.provider.observe({
      chainIds,
      durationMs: OBSERVATION_DURATION_MS,
    })

    const records = unsampled.map((configuration) => {
      const { projectId, chain, chainId } = configuration.properties
      const observation = observations.get(chainId)
      assert(
        observation,
        `Missing Railgun observation result for chainId ${chainId}`,
      )

      assert(
        observation.messagesReceived > 0,
        `Railgun observation saw no fee messages for chainId ${chainId}`,
      )
      assert(
        observation.messagesParsed > 0,
        `Railgun observation parsed no fee messages for chainId ${chainId}`,
      )

      return {
        configurationId: configuration.id,
        projectId,
        chain,
        timestamp: day,
        relayerCount: observation.uniqueRelayers,
        messagesReceived: observation.messagesReceived,
        messagesParsed: observation.messagesParsed,
        messagesAccepted: observation.messagesAccepted,
      }
    })

    return async () => {
      await this.$.db.privacyRelayerSample.upsertMany(records)
      this.logger.info('Saved privacy relayer samples into DB', {
        day,
        samples: records.length,
        chainIds,
      })
      return to
    }
  }

  override async wipeData(
    configurations: WipeRemovalConfiguration[],
  ): Promise<void> {
    const deletedRecords =
      await this.$.db.privacyRelayerSample.deleteByConfigIds(
        configurations.map((c) => c.id),
      )

    if (deletedRecords > 0) {
      this.logger.info('Wiped privacy relayer samples for configurations', {
        configurations: configurations.length,
        deletedRecords,
      })
    }
  }

  override async trimData(
    configurations: TrimRemovalConfiguration[],
  ): Promise<void> {
    for (const configuration of configurations) {
      const [from, to] = configuration.range
      const deletedRecords =
        await this.$.db.privacyRelayerSample.deleteByConfigInTimeRange(
          configuration.id,
          from,
          to,
        )

      if (deletedRecords > 0) {
        this.logger.info('Trimmed privacy relayer samples', {
          configurationId: configuration.id,
          from,
          to,
          deletedRecords,
        })
      }
    }
  }

  static idToConfigurationId(
    config: Omit<PrivacyRelayerSampleIndexerConfig, 'id'>,
  ): string {
    return createPrivacyConfigurationId([
      'privacy-relayer-sample',
      config.projectId,
      config.chainId.toString(),
    ])
  }
}
