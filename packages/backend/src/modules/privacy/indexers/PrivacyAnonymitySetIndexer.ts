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
import { utils } from 'ethers'
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
import { ERC20_TRANSFER_TOPIC, erc20Interface } from '../utils/erc20'
import {
  extractPrivacyAnonymitySetDeposit,
  type PrivacyAnonymitySetDeposit,
} from '../utils/extractPrivacyAnonymitySetDeposit'
import {
  getPrivacyTransactions,
  type PrivacyTransaction,
} from '../utils/getPrivacyTransactions'
import {
  buildPrivacyLogConfigMap,
  buildPrivacyLogFilter,
  getPrivacyLogKey,
  groupByTopics,
} from '../utils/privacyLogIndexerUtils'

/** How far before an update a deposit address may have been funded. */
const FUNDING_LOOKBACK = 30 * UnixTime.DAY
const FUNDING_TOPIC_BATCH_SIZE = 100

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
    // eth_getLogs ANDs topic positions, so configurations with different
    // indexed-arg filters cannot share a query.
    const rawRecords = (
      await Promise.all(
        groupByTopics(configurations).map(
          async ({ topics, configurations }) => {
            const { addresses, events } = buildPrivacyLogFilter(configurations)
            const logs = await this.$.logsProvider.getLogs(
              blockFrom,
              blockTo,
              addresses,
              [events, ...topics],
            )
            return extractRawRecords(
              logs,
              buildPrivacyLogConfigMap(configurations),
            )
          },
        ),
      )
    ).flat()
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

    const transactions = await getPrivacyTransactions(
      this.$.rpcClient,
      unique(
        recordsInRange
          .filter((record) => record.origin.type === 'transaction')
          .map((record) => record.log.transactionHash.toLowerCase()),
      ),
    )
    const withSenders = recordsInRange.map((record) => ({
      ...record,
      sender: resolveSender(record, transactions),
    }))
    const funders = await this.getDepositAddressFunders(
      withSenders.filter(
        (record) => record.configuration.properties.fundingTokens !== undefined,
      ),
      from,
      blockTo,
    )

    return withSenders.map((record) => {
      const config = record.configuration.properties
      return {
        configurationId: record.configuration.id,
        projectId: config.projectId,
        bucketId: config.bucketId,
        chain: config.chain,
        timestamp: record.timestamp,
        blockNumber: record.log.blockNumber,
        txHash: record.log.transactionHash,
        logIndex: record.log.logIndex,
        sender: funders.get(getRecordKey(record.log)) ?? record.sender,
        amount: record.amount,
      }
    })
  }

  /**
   * For deposits from one-time deposit addresses: the earliest funding
   * transfer into each address before its deposit, keyed by the deposit log.
   * Transfers inside the deposit transaction itself, such as swap output,
   * do not count. Without a funding transfer the deposit address stays the
   * depositor.
   */
  private async getDepositAddressFunders(
    records: (RawRecord & { sender: string })[],
    from: number,
    blockTo: number,
  ): Promise<Map<string, string>> {
    const funders = new Map<string, string>()
    if (records.length === 0) return funders

    const lookbackBlock =
      await this.$.blockTimestampProvider.getBlockNumberAtOrBefore(
        UnixTime(from - FUNDING_LOOKBACK),
        this.$.chain,
      )
    const tokens = unique(
      records.flatMap((record) =>
        (record.configuration.properties.fundingTokens ?? []).map((token) =>
          token.toString(),
        ),
      ),
    )
    const depositAddresses = unique(
      records.map((record) => record.sender.toLowerCase()),
    )
    const logs: Log[] = []
    for (
      let i = 0;
      i < depositAddresses.length;
      i += FUNDING_TOPIC_BATCH_SIZE
    ) {
      const batch = depositAddresses.slice(i, i + FUNDING_TOPIC_BATCH_SIZE)
      logs.push(
        ...(await this.$.logsProvider.getLogs(lookbackBlock, blockTo, tokens, [
          [ERC20_TRANSFER_TOPIC],
          null,
          batch.map((address) => utils.hexZeroPad(address, 32)),
        ])),
      )
    }
    const fundings = logs
      .map((log) => {
        const { from, to } = erc20Interface.parseLog(log).args
        return {
          log,
          from: EthereumAddress(from).toString(),
          to: String(to).toLowerCase(),
        }
      })
      .sort(
        (a, b) =>
          a.log.blockNumber - b.log.blockNumber ||
          a.log.logIndex - b.log.logIndex,
      )

    for (const record of records) {
      const funding = fundings.find(
        ({ log, to }) =>
          to === record.sender.toLowerCase() &&
          log.blockNumber <= record.log.blockNumber &&
          log.transactionHash.toLowerCase() !==
            record.log.transactionHash.toLowerCase(),
      )
      if (funding) funders.set(getRecordKey(record.log), funding.from)
    }
    return funders
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

function resolveSender(
  record: RawRecord,
  transactions: Map<string, PrivacyTransaction>,
): string {
  if (record.origin.type === 'event') {
    return record.origin.sender.toString()
  }

  const transaction = transactions.get(record.log.transactionHash.toLowerCase())
  assert(
    transaction !== undefined,
    `Missing transaction sender for ${record.log.transactionHash}`,
  )
  return transaction.from.toString()
}

function getRecordKey(log: Pick<Log, 'transactionHash' | 'logIndex'>): string {
  return `${log.transactionHash.toLowerCase()}:${log.logIndex}`
}
