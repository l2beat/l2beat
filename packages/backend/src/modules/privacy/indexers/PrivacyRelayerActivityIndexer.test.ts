import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import type { BlockProvider, IRpcClient, LogsProvider } from '@l2beat/shared'
import { EthereumAddress, type Log, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { utils } from 'ethers'
import { mockDatabase } from '../../../test/database'
import type { IndexerService } from '../../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../../tools/uif/ids'
import type { Configuration } from '../../../tools/uif/multi/types'
import type {
  PrivacyRelayerActivityIndexerConfig,
  PrivacyRelayerActivityIndexerConfigProperties,
} from '../types'
import { getPrivacyRelayerExtractor } from '../utils/extractPrivacyRelayerActivity'
import { WITHDRAWAL_TOPIC } from '../zkmoney/abi'
import {
  ALICE,
  BOB,
  mockZkMoneyRpc,
  PORTAL,
  SIPA,
  transfer,
  WITHDRAWAL_EXECUTOR,
  WITHDRAWAL_RELAYER_PARAMS,
  withdrawal,
} from '../zkmoney/test/fixtures'
import { PrivacyRelayerActivityIndexer } from './PrivacyRelayerActivityIndexer'

const CONTRACT = EthereumAddress('0x1111111111111111111111111111111111111111')
const RELAYER = EthereumAddress('0x2222222222222222222222222222222222222222')
const RECIPIENT = EthereumAddress('0x3333333333333333333333333333333333333333')
const ASSET = EthereumAddress('0x4444444444444444444444444444444444444444')
const EVENT =
  '0xe9b67844a7bb6e6ac95e8a0de02e4448dbb0c9460be9194348e4bbac6d13c2cf'

const privacyPoolsInterface = new utils.Interface([
  'event WithdrawalRelayed(address indexed _relayer, address indexed _recipient, address indexed _asset, uint256 _amount, uint256 _feeAmount)',
])

describe(PrivacyRelayerActivityIndexer.name, () => {
  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })

  it('fetches, extracts, and saves relayer activity', async () => {
    const from = UnixTime.toStartOf(UnixTime(0), 'day')
    const to = from + 5 * UnixTime.HOUR
    const blockTimestamp = from + UnixTime.HOUR
    const configurations = [configuration()]

    const encoded = privacyPoolsInterface.encodeEventLog('WithdrawalRelayed', [
      RELAYER,
      RECIPIENT,
      ASSET,
      1_000n,
      10n,
    ])
    const log: Log = {
      address: CONTRACT.toString(),
      topics: encoded.topics,
      data: encoded.data,
      blockNumber: 100,
      blockHash: '0xblock',
      transactionHash: '0xtx',
      logIndex: 4,
      blockTimestamp,
    }

    const logsProvider = mockObject<LogsProvider>({
      getLogs: mockFn().returnsOnce([log]),
    })
    const blockProvider = mockObject<BlockProvider>({
      getBlockTimestamps: mockFn(),
    })
    const privacyBlockTimestamp = mockObject<Database['privacyBlockTimestamp']>(
      {
        findBlockNumberByChainAndTimestamp: mockFn()
          .returnsOnce(50)
          .returnsOnce(150),
      },
    )
    const privacyRelayerActivity = mockObject<
      Database['privacyRelayerActivity']
    >({
      upsertMany: mockFn().returnsOnce(undefined),
    })

    const indexer = new PrivacyRelayerActivityIndexer(
      {
        chain: 'ethereum',
        rpcClient: mockObject<IRpcClient>({}),
        configurations,
        blockProvider,
        logsProvider,
        db: mockDatabase({
          privacyBlockTimestamp,
          privacyRelayerActivity,
        }),
        parents: [],
        indexerService: mockObject<IndexerService>({}),
      },
      Logger.SILENT,
    )

    const save = await indexer.multiUpdate(from, to, configurations)
    const safeHeight = await save()

    expect(logsProvider.getLogs).toHaveBeenOnlyCalledWith(
      50,
      150,
      [CONTRACT.toString()],
      [[EVENT]],
    )
    expect(blockProvider.getBlockTimestamps).not.toHaveBeenCalled()
    expect(privacyRelayerActivity.upsertMany).toHaveBeenOnlyCalledWith([
      {
        configurationId: 'config-1',
        projectId: 'privacy-pools',
        chain: 'ethereum',
        timestamp: blockTimestamp,
        blockNumber: 100,
        txHash: '0xtx',
        logIndex: 4,
        relayerAddress: RELAYER,
      },
    ])
    expect(safeHeight).toEqual(to)
  })

  // The portal event alone does not name the finalizer: the indexer must pass
  // the receipt (served by the RPC mock) to the zk.money extractor.
  it('saves only qualifying zk.money withdrawals without blacklisting an address', async () => {
    const from = UnixTime.toStartOf(UnixTime(0), 'day')
    const to = from + 5 * UnixTime.HOUR
    const blockTimestamp = from + UnixTime.HOUR
    const portalEvent = {
      ...withdrawal(1, { logIndex: 3, blockNumber: 100 }),
      blockTimestamp,
    }
    const zeroTipEvent = {
      ...withdrawal(2, { logIndex: 5, blockNumber: 100 }),
      blockTimestamp,
    }
    const unsupportedEvent = {
      ...withdrawal(3, { logIndex: 6, blockNumber: 100 }, SIPA),
      blockTimestamp,
    }
    const properties: PrivacyRelayerActivityIndexerConfig = {
      id: 'config-zk',
      projectId: 'zkmoney',
      chain: 'ethereum',
      address: PORTAL,
      sinceTimestamp: UnixTime(0),
      event: WITHDRAWAL_TOPIC,
      extractor: 'zkMoneyWithdrawalRelayer',
      params: WITHDRAWAL_RELAYER_PARAMS,
    }
    const configurations = [
      { id: properties.id, minHeight: 0, maxHeight: null, properties },
    ]
    const rpcClient = mockZkMoneyRpc({
      receipt: [
        transfer(WITHDRAWAL_EXECUTOR, BOB, 90n, { logIndex: 1 }),
        transfer(WITHDRAWAL_EXECUTOR, BOB, 10n, { logIndex: 2 }),
        portalEvent,
        transfer(WITHDRAWAL_EXECUTOR, ALICE, 100n, { logIndex: 4 }),
        zeroTipEvent,
        unsupportedEvent,
      ],
    })
    const privacyRelayerActivity = mockObject<
      Database['privacyRelayerActivity']
    >({
      upsertMany: mockFn().returnsOnce(undefined),
    })
    const indexer = new PrivacyRelayerActivityIndexer(
      {
        chain: 'ethereum',
        rpcClient,
        configurations,
        blockProvider: mockObject<BlockProvider>({}),
        logsProvider: mockObject<LogsProvider>({
          getLogs: mockFn().returnsOnce([
            portalEvent,
            zeroTipEvent,
            unsupportedEvent,
          ]),
        }),
        db: mockDatabase({
          privacyBlockTimestamp: mockObject<Database['privacyBlockTimestamp']>({
            findBlockNumberByChainAndTimestamp: mockFn()
              .returnsOnce(50)
              .returnsOnce(150),
          }),
          privacyRelayerActivity,
        }),
        parents: [],
        indexerService: mockObject<IndexerService>({}),
      },
      Logger.SILENT,
    )

    const save = await indexer.multiUpdate(from, to, configurations)
    await save()

    expect(rpcClient.getTransactionReceipt).toHaveBeenOnlyCalledWith(
      portalEvent.transactionHash,
    )
    expect(rpcClient.getTransaction).toHaveBeenOnlyCalledWith(
      portalEvent.transactionHash,
    )
    expect(privacyRelayerActivity.upsertMany).toHaveBeenOnlyCalledWith([
      {
        configurationId: 'config-zk',
        projectId: 'zkmoney',
        chain: 'ethereum',
        timestamp: blockTimestamp,
        blockNumber: 100,
        txHash: zeroTipEvent.transactionHash,
        logIndex: 5,
        relayerAddress: BOB,
      },
    ])
  })

  describe(PrivacyRelayerActivityIndexer.idToConfigurationId.name, () => {
    // A changed id wipes and re-syncs the configuration's data.
    it('keeps the existing id for extractors without params', () => {
      expect(
        PrivacyRelayerActivityIndexer.idToConfigurationId(relayerProperties()),
      ).toEqual('0a13c1d85c91')
    })

    it('is deterministic for the same input', () => {
      const properties = relayerProperties()

      expect(
        PrivacyRelayerActivityIndexer.idToConfigurationId(properties),
      ).toEqual(PrivacyRelayerActivityIndexer.idToConfigurationId(properties))
    })

    it('differs by extractor', () => {
      const properties = relayerProperties()

      expect(
        PrivacyRelayerActivityIndexer.idToConfigurationId(properties),
      ).not.toEqual(
        PrivacyRelayerActivityIndexer.idToConfigurationId({
          ...properties,
          event: getPrivacyRelayerExtractor({
            extractor: 'tornadoCashWithdrawal',
          }).event,
          extractor: 'tornadoCashWithdrawal',
        }),
      )
    })
  })
})

function relayerProperties(): PrivacyRelayerActivityIndexerConfigProperties {
  return {
    projectId: 'privacy-pools',
    chain: 'ethereum',
    address: CONTRACT,
    sinceTimestamp: UnixTime(0),
    event: EVENT,
    extractor: 'privacyPoolsWithdrawalRelayed',
  }
}

function configuration(): Configuration<PrivacyRelayerActivityIndexerConfig> {
  const properties: PrivacyRelayerActivityIndexerConfig = {
    id: 'config-1',
    projectId: 'privacy-pools',
    chain: 'ethereum',
    address: CONTRACT,
    sinceTimestamp: UnixTime(0),
    event: EVENT,
    extractor: 'privacyPoolsWithdrawalRelayed',
  }

  return {
    id: properties.id,
    minHeight: properties.sinceTimestamp,
    maxHeight: null,
    properties,
  }
}
