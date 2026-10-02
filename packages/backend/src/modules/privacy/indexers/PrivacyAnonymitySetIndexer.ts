import type { Logger } from '@l2beat/backend-tools'
import type { Database, PrivacyAnonymitySetEventRecord } from '@l2beat/database'
import type {
  BlockProvider,
  BlockTimestampProvider,
  IRpcClient,
  LogsProvider,
} from '@l2beat/shared'
import { createPrivacyAnonymitySetConfigurationId } from '@l2beat/shared'
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
import type {
  PrivacyAnonymitySetIndexerConfig,
  PrivacyAnonymitySetIndexerConfigProperties,
} from '../types'
import {
  extractPrivacyAnonymitySetDeposit,
  type PrivacyAnonymitySetDeposit,
} from '../utils/extractPrivacyAnonymitySetDeposit'
import {
  buildPrivacyLogConfigMap,
  buildPrivacyLogFilter,
  getPrivacyLogKey,
} from '../utils/privacyLogIndexerUtils'
import { eventKey } from '../utils/zkMoneyEvents'
import { findZkMoneyDepositSenders } from '../utils/zkMoneyFunders'

const TRANSACTION_LOOKUP_BATCH_SIZE = 25
// Deposit addresses are swept soon after they are funded. Older funding is
// not worth scanning for on every update, and the deposit stays unattributed.
const ZK_MONEY_FUNDING_LOOKBACK = 30 * UnixTime.DAY

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

    const records = await this.fetchDepositsForConfigurations(
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

  private async fetchDepositsForConfigurations(
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

    // atOrBefore can make adjacent time ranges share boundary blocks. Filtering
    // by timestamp below keeps the exact range; repository upserts deduplicate
    // any boundary logs fetched again by the following update.
    const { addresses, events } = buildPrivacyLogFilter(configurations)
    const logs = await this.$.logsProvider.getLogs(
      blockFrom,
      blockTo,
      addresses,
      [events],
    )

    const configMap = buildPrivacyLogConfigMap(configurations)
    const rawRecords = extractRawRecords(logs, configMap)
    if (rawRecords.length === 0) return []

    const blockTimestamps = await this.$.blockProvider.getBlockTimestamps(
      unique(rawRecords.map((record) => record.log.blockNumber)),
    )
    const recordsInRange = rawRecords.flatMap((record) => {
      const timestamp = blockTimestamps.get(record.log.blockNumber)
      assert(
        timestamp !== undefined,
        `Missing block timestamp for block ${record.log.blockNumber}`,
      )

      if (timestamp < from || timestamp > to) return []

      return [{ ...record, timestamp }]
    })
    if (recordsInRange.length === 0) return []

    const transactionSenders = await this.getTransactionSenders(
      unique(
        recordsInRange
          .filter((record) => record.origin.type === 'transaction')
          .map((record) => record.log.transactionHash.toLowerCase()),
      ),
    )

    const zkMoneySenders = await this.getZkMoneySenders(
      configurations,
      recordsInRange,
      from,
    )

    return recordsInRange.flatMap((record) => {
      const config = record.configuration.properties
      const sender = this.resolveSender(
        record,
        transactionSenders,
        zkMoneySenders,
      )
      if (sender === undefined) return []

      return [
        {
          configurationId: record.configuration.id,
          projectId: config.projectId,
          bucketId: config.bucketId,
          chain: config.chain,
          timestamp: record.timestamp,
          blockNumber: record.log.blockNumber,
          txHash: record.log.transactionHash,
          logIndex: record.log.logIndex,
          sender,
          amount: record.amount,
        },
      ]
    })
  }

  private resolveSender(
    record: RawRecord,
    transactionSenders: Map<string, string>,
    zkMoneySenders: Map<string, string>,
  ): string | undefined {
    if (record.origin.type === 'event') {
      return record.origin.sender.toString()
    }
    if (record.origin.type === 'zkMoney') {
      return zkMoneySenders.get(senderKey(record))
    }

    const sender = transactionSenders.get(
      record.log.transactionHash.toLowerCase(),
    )
    assert(
      sender !== undefined,
      `Missing transaction sender for ${record.log.transactionHash}`,
    )
    return sender
  }

  private async getZkMoneySenders(
    configurations: Configuration<PrivacyAnonymitySetIndexerConfig>[],
    records: RawRecord[],
    from: number,
  ): Promise<Map<string, string>> {
    const result = new Map<string, string>()

    for (const configuration of configurations) {
      const source = configuration.properties
      if (source.extractor !== 'zkMoneyDeposit') continue

      const deposits = records.filter(
        (record) => record.configuration.id === configuration.id,
      )
      if (deposits.length === 0) continue

      const fundingFromBlock =
        await this.$.blockTimestampProvider.getBlockNumberAtOrBefore(
          UnixTime(from - ZK_MONEY_FUNDING_LOOKBACK),
          this.$.chain,
        )
      const senders = await findZkMoneyDepositSenders(
        deposits.map((record) => record.log),
        source.params,
        this.$,
        fundingFromBlock,
      )
      for (const record of deposits) {
        const sender = senders.get(eventKey(record.log))
        if (sender !== undefined) result.set(senderKey(record), sender)
      }
    }

    return result
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

  static idToConfigurationId(
    config: PrivacyAnonymitySetIndexerConfigProperties,
  ): string {
    return createPrivacyAnonymitySetConfigurationId({
      ...config,
      address: config.address.toString(),
    })
  }
}

interface RawRecord {
  configuration: Configuration<PrivacyAnonymitySetIndexerConfig>
  log: Log
  amount: bigint
  origin: PrivacyAnonymitySetDeposit['origin']
}

function senderKey(record: RawRecord): string {
  return `${record.configuration.id}:${eventKey(record.log)}`
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
