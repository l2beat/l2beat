import type { Logger } from '@l2beat/backend-tools'
import type {
  Database,
  PrivacyNoteRecord,
  PrivacyNoteStatusChangeRecord,
} from '@l2beat/database'
import type { BlockProvider, LogsProvider } from '@l2beat/shared'
import { createPrivacyNoteConfigurationId } from '@l2beat/shared'
import { assertUnreachable, UnixTime } from '@l2beat/shared-pure'
import { Indexer } from '@l2beat/uif'
import { INDEXER_NAMES } from '../../../tools/uif/indexerIdentity'
import { ManagedMultiIndexer } from '../../../tools/uif/multi/ManagedMultiIndexer'
import type {
  Configuration,
  ManagedMultiIndexerOptions,
  TrimRemovalConfiguration,
  WipeRemovalConfiguration,
} from '../../../tools/uif/multi/types'
import type {
  PrivacyNoteIndexerConfig,
  PrivacyNoteIndexerConfigProperties,
} from '../types'
import {
  extractPrivacyNoteEvent,
  getPrivacyNoteExtractor,
} from '../utils/extractPrivacyNoteEvent'
import { fetchPrivacyLogMatches } from '../utils/privacyLogIndexerUtils'

interface PrivacyNoteIndexerDeps
  extends Omit<
    ManagedMultiIndexerOptions<PrivacyNoteIndexerConfig>,
    'name' | 'logger'
  > {
  chain: string
  blockProvider: BlockProvider
  logsProvider: LogsProvider
  db: Database
}

interface PrivacyNoteRecords {
  notes: PrivacyNoteRecord[]
  statusChanges: PrivacyNoteStatusChangeRecord[]
}

export class PrivacyNoteIndexer extends ManagedMultiIndexer<PrivacyNoteIndexerConfig> {
  constructor(
    private readonly $: PrivacyNoteIndexerDeps,
    logger: Logger,
  ) {
    super(
      {
        ...$,
        name: INDEXER_NAMES.PRIVACY_NOTE,
        tags: {
          tag: $.chain,
          chain: $.chain,
        },
        updateRetryStrategy: Indexer.getInfiniteRetryStrategy(),
      },
      logger,
    )
  }

  override async multiUpdate(
    from: number,
    to: number,
    configurations: Configuration<PrivacyNoteIndexerConfig>[],
  ) {
    const adjustedTo = Math.min(UnixTime.toNext(from, 'day'), to)
    this.logger.info('Fetching privacy note logs', {
      from,
      to: adjustedTo,
      configurations: configurations.length,
    })

    const { notes, statusChanges } = await this.fetchRecords(
      configurations,
      from,
      adjustedTo,
    )

    this.logger.info('Fetched privacy note logs', {
      from,
      to: adjustedTo,
      notes: notes.length,
      statusChanges: statusChanges.length,
    })

    return async () => {
      await this.$.db.privacyNote.upsertMany(notes)
      await this.$.db.privacyNoteStatusChange.upsertMany(statusChanges)

      this.logger.info('Saved privacy notes into DB', {
        from,
        to: adjustedTo,
        notes: notes.length,
        statusChanges: statusChanges.length,
      })

      return adjustedTo
    }
  }

  override async wipeData(
    configurations: WipeRemovalConfiguration[],
  ): Promise<void> {
    const configurationIds = configurations.map((c) => c.id)
    const deletedNotes =
      await this.$.db.privacyNote.deleteByConfigIds(configurationIds)
    const deletedStatusChanges =
      await this.$.db.privacyNoteStatusChange.deleteByConfigIds(
        configurationIds,
      )

    if (deletedNotes > 0 || deletedStatusChanges > 0) {
      this.logger.info('Wiped privacy notes for configurations', {
        configurations: configurations.length,
        deletedNotes,
        deletedStatusChanges,
      })
    }
  }

  override async trimData(
    configurations: TrimRemovalConfiguration[],
  ): Promise<void> {
    for (const configuration of configurations) {
      const [from, to] = configuration.range
      const deletedNotes =
        await this.$.db.privacyNote.deleteByConfigInTimeRange(
          configuration.id,
          from,
          to,
        )
      const deletedStatusChanges =
        await this.$.db.privacyNoteStatusChange.deleteByConfigInTimeRange(
          configuration.id,
          from,
          to,
        )

      if (deletedNotes > 0 || deletedStatusChanges > 0) {
        this.logger.info('Trimmed privacy notes', {
          configurationId: configuration.id,
          from,
          to,
          deletedNotes,
          deletedStatusChanges,
        })
      }
    }
  }

  private async fetchRecords(
    configurations: Configuration<PrivacyNoteIndexerConfig>[],
    from: number,
    to: number,
  ): Promise<PrivacyNoteRecords> {
    const matches = await fetchPrivacyLogMatches(
      expandToLifecycleEvents(configurations),
      {
        chain: this.$.chain,
        from,
        to,
        privacyBlockTimestamp: this.$.db.privacyBlockTimestamp,
        logsProvider: this.$.logsProvider,
        blockProvider: this.$.blockProvider,
        logger: this.logger,
      },
    )

    const records: PrivacyNoteRecords = { notes: [], statusChanges: [] }
    for (const { log, timestamp, configuration } of matches) {
      const event = extractPrivacyNoteEvent(configuration.properties, log)
      const base = {
        configurationId: configuration.id,
        projectId: configuration.properties.projectId,
        noteId: event.noteId,
        timestamp,
        txHash: log.transactionHash,
      }
      switch (event.type) {
        case 'deposit':
          records.notes.push({
            ...base,
            amount: event.amount,
            expiresAt: event.expiresAt,
          })
          break
        case 'statusChange':
          records.statusChanges.push({
            ...base,
            blockNumber: log.blockNumber,
            logIndex: log.logIndex,
            active: event.active,
          })
          break
        default:
          assertUnreachable(event)
      }
    }
    return records
  }

  static idToConfigurationId(
    config: PrivacyNoteIndexerConfigProperties,
  ): string {
    return createPrivacyNoteConfigurationId({
      ...config,
      address: config.address.toString(),
    })
  }
}

// fetchPrivacyLogMatches matches one event per configuration, while a note
// source spans its whole lifecycle; the real id keeps every row on one config.
function expandToLifecycleEvents(
  configurations: Configuration<PrivacyNoteIndexerConfig>[],
): Configuration<PrivacyNoteIndexerConfig & { event: string }>[] {
  return configurations.flatMap((configuration) =>
    getPrivacyNoteExtractor(configuration.properties).events.map((event) => ({
      ...configuration,
      properties: { ...configuration.properties, event },
    })),
  )
}
