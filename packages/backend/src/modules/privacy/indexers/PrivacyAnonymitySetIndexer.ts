import type { Logger } from '@l2beat/backend-tools'
import type { Database, PrivacyAnonymitySetEventRecord } from '@l2beat/database'
import type {
  BlockProvider,
  BlockTimestampProvider,
  IRpcClient,
  LogsProvider,
} from '@l2beat/shared'
import {
  assert,
  EthereumAddress,
  type Log,
  UnixTime,
  unique,
} from '@l2beat/shared-pure'
import { Indexer } from '@l2beat/uif'
import { INDEXER_NAMES } from '../../../tools/uif/indexerIdentity'
import { ManagedMultiIndexer } from '../../../tools/uif/multi/ManagedMultiIndexer'
import type {
  Configuration,
  ManagedMultiIndexerOptions,
  TrimRemovalConfiguration,
  WipeRemovalConfiguration,
} from '../../../tools/uif/multi/types'
import type { PrivacyAnonymitySetIndexerConfig } from '../types'
import {
  extractPrivacyAnonymitySetDeposit,
  type PrivacyAnonymitySetDeposit,
} from '../utils/extractPrivacyAnonymitySetDeposit'
import {
  buildPrivacyLogConfigurationMap,
  buildPrivacyLogFilter,
  getPrivacyLogKey,
} from '../utils/privacyLogConfiguration'

const TRANSACTION_LOOKUP_BATCH_SIZE = 25

interface PrivacyAnonymitySetIndexerDeps
  extends Omit<
    ManagedMultiIndexerOptions<PrivacyAnonymitySetIndexerConfig>,
    'name' | 'logger'
  > {
  chain: string
  blockProvider: BlockProvider
  blockTimestampProvider: BlockTimestampProvider
  logsProvider: LogsProvider
  rpcClient: IRpcClient
  db: Database
}

export class PrivacyAnonymitySetIndexer extends ManagedMultiIndexer<PrivacyAnonymitySetIndexerConfig> {
  constructor(
    private readonly $: PrivacyAnonymitySetIndexerDeps,
    logger: Logger,
  ) {
    super(
      {
        ...$,
        name: INDEXER_NAMES.PRIVACY_ANONYMITY_SET,
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
    configurations: Configuration<PrivacyAnonymitySetIndexerConfig>[],
  ) {
    const adjustedTo = Math.min(UnixTime.toNext(from, 'day'), to)
    this.logger.info('Fetching privacy anonymity set deposits', {
      from,
      to: adjustedTo,
      configurations: configurations.length,
    })

    const records = await this.fetchRecordsForGroup(
      configurations,
      from,
      adjustedTo,
    )

    this.logger.info('Fetched privacy anonymity set deposits', {
      from,
      to: adjustedTo,
      records: records.length,
    })

    return async () => {
      await this.$.db.privacyAnonymitySetEvent.upsertMany(records)

      this.logger.info('Saved privacy anonymity set deposits into DB', {
        from,
        to: adjustedTo,
        records: records.length,
      })

      return adjustedTo
    }
  }

  override async wipeData(
    configurations: WipeRemovalConfiguration[],
  ): Promise<void> {
    const deletedRecords =
      await this.$.db.privacyAnonymitySetEvent.deleteByConfigIds(
        configurations.map((c) => c.id),
      )

    if (deletedRecords > 0) {
      this.logger.info('Wiped privacy anonymity set deposits', {
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
        await this.$.db.privacyAnonymitySetEvent.deleteByConfigInTimeRange(
          configuration.id,
          from,
          to,
        )

      if (deletedRecords > 0) {
        this.logger.info('Trimmed privacy anonymity set deposits', {
          configurationId: configuration.id,
          from,
          to,
          deletedRecords,
        })
      }
    }
  }

  private async fetchRecordsForGroup(
    configurations: Configuration<PrivacyAnonymitySetIndexerConfig>[],
    from: number,
    to: number,
  ): Promise<PrivacyAnonymitySetEventRecord[]> {
    if (configurations.length === 0) return []

    const [blockFrom, blockTo] = await Promise.all([
      this.$.blockTimestampProvider.getBlockNumberAtOrBefore(
        UnixTime(from),
        this.$.chain,
      ),
      this.$.blockTimestampProvider.getBlockNumberAtOrBefore(
        UnixTime(to),
        this.$.chain,
      ),
    ])

    const { addresses, events } = buildPrivacyLogFilter(configurations)
    const logs = await this.$.logsProvider.getLogs(
      blockFrom,
      blockTo,
      addresses,
      events,
    )

    const configMap = buildPrivacyLogConfigurationMap(configurations)
    const rawRecords = extractRawRecords(logs, configMap)
    if (rawRecords.length === 0) return []

    const [blockTimestamps, transactionSenders] = await Promise.all([
      this.$.blockProvider.getBlockTimestamps(
        unique(rawRecords.map((record) => record.log.blockNumber)),
      ),
      this.getTransactionSenders(
        unique(
          rawRecords
            .filter((record) => record.origin.type === 'transaction')
            .map((record) => record.log.transactionHash.toLowerCase()),
        ),
      ),
    ])

    return rawRecords.flatMap((record) => {
      const timestamp = blockTimestamps.get(record.log.blockNumber)
      assert(
        timestamp !== undefined,
        `Missing block timestamp for block ${record.log.blockNumber}`,
      )

      if (timestamp < from || timestamp > to) return []

      const sender =
        record.origin.type === 'event'
          ? record.origin.sender.toString()
          : transactionSenders.get(record.log.transactionHash.toLowerCase())
      assert(
        sender !== undefined,
        `Missing transaction sender for ${record.log.transactionHash}`,
      )

      const config = record.configuration.properties
      return [
        {
          configurationId: record.configuration.id,
          projectId: config.projectId,
          bucketId: config.bucketId,
          chain: config.chain,
          timestamp,
          blockNumber: record.log.blockNumber,
          txHash: record.log.transactionHash,
          logIndex: record.log.logIndex,
          sender,
          amount: record.amount,
        },
      ]
    })
  }

  private async getTransactionSenders(
    transactionHashes: string[],
  ): Promise<Map<string, string>> {
    const result = new Map<string, string>()

    for (
      let start = 0;
      start < transactionHashes.length;
      start += TRANSACTION_LOOKUP_BATCH_SIZE
    ) {
      const batch = transactionHashes.slice(
        start,
        start + TRANSACTION_LOOKUP_BATCH_SIZE,
      )
      const transactions = await Promise.all(
        batch.map((hash) => this.$.rpcClient.getTransaction(hash)),
      )

      for (let i = 0; i < batch.length; i++) {
        const requestedHash = batch[i]
        const transaction = transactions[i]
        assert(requestedHash !== undefined && transaction !== undefined)
        assert(
          transaction.hash.toLowerCase() === requestedHash.toLowerCase(),
          `Transaction hash mismatch for ${requestedHash}`,
        )
        result.set(
          requestedHash.toLowerCase(),
          EthereumAddress(transaction.from).toString(),
        )
      }
    }

    return result
  }
}

interface RawRecord {
  configuration: Configuration<PrivacyAnonymitySetIndexerConfig>
  log: Log
  amount: bigint
  origin: PrivacyAnonymitySetDeposit['origin']
}

function extractRawRecords(
  logs: Log[],
  configMap: Map<string, Configuration<PrivacyAnonymitySetIndexerConfig>[]>,
): RawRecord[] {
  const records: RawRecord[] = []

  for (const log of logs) {
    const key = getPrivacyLogKey(log)
    const configurations = configMap.get(key) ?? []

    for (const configuration of configurations) {
      const result = extractPrivacyAnonymitySetDeposit(
        configuration.properties,
        log,
      )
      if (!result || result.amount === 0n) continue

      records.push({
        configuration,
        log,
        amount: result.amount,
        origin: result.origin,
      })
    }
  }

  return records
}
