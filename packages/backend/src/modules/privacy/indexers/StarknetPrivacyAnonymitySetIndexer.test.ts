import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import type {
  BlockProvider,
  StarknetClient,
  StarknetEvent,
} from '@l2beat/shared'
import { createPrivacyAnonymitySetConfigurationId } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { mockDatabase } from '../../../test/database'
import type { IndexerService } from '../../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../../tools/uif/ids'
import type { Configuration } from '../../../tools/uif/multi/types'
import type { StarknetPrivacyAnonymitySetIndexerConfig } from '../types'
import { StarknetPrivacyAnonymitySetIndexer } from './StarknetPrivacyAnonymitySetIndexer'

const POOL =
  '0x040337b1af3c663e86e333bab5a4b28da8d4652a15a69beee2b677776ffe812a'
const STRK = '0x0123'
const USDC = '0x0456'
const DEPOSIT =
  '0x09149d2123147c5f43d258257fef0b7b969db78269369ebcf5ebb9eef8592f2'
const ALICE = `0x${'0'.repeat(61)}abc`
const BOB = `0x${'bb'.repeat(32)}`

describe(StarknetPrivacyAnonymitySetIndexer.name, () => {
  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })

  describe(
    StarknetPrivacyAnonymitySetIndexer.prototype.multiUpdate.name,
    () => {
      it('fetches deposit events and saves attributed records in range', async () => {
        const from = UnixTime.toStartOf(UnixTime(1_700_000_000), 'day')
        const to = from + 3 * UnixTime.HOUR
        const timestamp = from + UnixTime.HOUR
        const configurations = [
          config({ id: 'strk-config', bucketId: 'strk20-STRK', token: STRK }),
          config({ id: 'usdc-config', bucketId: 'strk20-USDC', token: USDC }),
        ]

        const starknetClient = mockObject<StarknetClient>({
          getEvents: mockFn().resolvesToOnce([
            event({
              block_number: 100,
              transaction_hash: '0xstrk-tx',
              event_index: 0,
              // The RPC omits leading zeros from felts.
              keys: [
                '0x9149d2123147c5f43d258257fef0b7b969db78269369ebcf5ebb9eef8592f2',
                '0xabc',
                '0x123',
              ],
              data: ['0x10f0cf064dd59200000'],
            }),
            event({
              block_number: 101,
              transaction_hash: '0xusdc-tx',
              event_index: 2,
              keys: [DEPOSIT, BOB, USDC],
              data: ['0xbebc200'],
            }),
            event({
              block_number: 101,
              transaction_hash: '0xother-token-tx',
              event_index: 3,
              keys: [DEPOSIT, BOB, '0x789'],
              data: ['0xbebc200'],
            }),
            event({
              block_number: 101,
              transaction_hash: '0xzero-tx',
              event_index: 4,
              keys: [DEPOSIT, BOB, USDC],
              data: ['0x0'],
            }),
            event({
              block_number: 102,
              transaction_hash: '0xboundary-tx',
              event_index: 0,
              keys: [DEPOSIT, BOB, STRK],
              data: ['0x1'],
            }),
          ]),
        })
        const blockProvider = mockObject<BlockProvider>({
          getBlockTimestamps: mockFn().resolvesToOnce(
            new Map([
              [100, timestamp],
              [101, timestamp + UnixTime.HOUR],
              [102, to + 1],
            ]),
          ),
        })
        const privacyBlockTimestampRepo = mockObject<
          Database['privacyBlockTimestamp']
        >({
          findBlockNumberByChainAndTimestamp: mockFn()
            .resolvesToOnce(50)
            .resolvesToOnce(150),
        })
        const privacyAnonymitySetEventRepo = mockObject<
          Database['privacyAnonymitySetEvent']
        >({
          upsertMany: mockFn().resolvesToOnce(2),
        })

        const indexer = new StarknetPrivacyAnonymitySetIndexer(
          {
            chain: 'starknet',
            configurations,
            blockProvider,
            starknetClient,
            db: mockDatabase({
              privacyBlockTimestamp: privacyBlockTimestampRepo,
              privacyAnonymitySetEvent: privacyAnonymitySetEventRepo,
            }),
            parents: [],
            indexerService: mockObject<IndexerService>({}),
          },
          Logger.SILENT,
        )

        const save = await indexer.multiUpdate(from, to, configurations)
        const safeHeight = await save()

        expect(
          privacyBlockTimestampRepo.findBlockNumberByChainAndTimestamp,
        ).toHaveBeenCalledTimes(2)
        expect(
          privacyBlockTimestampRepo.findBlockNumberByChainAndTimestamp,
        ).toHaveBeenNthCalledWith(1, 'starknet', from)
        expect(
          privacyBlockTimestampRepo.findBlockNumberByChainAndTimestamp,
        ).toHaveBeenNthCalledWith(2, 'starknet', to)
        expect(starknetClient.getEvents).toHaveBeenOnlyCalledWith(
          50,
          150,
          POOL,
          [DEPOSIT],
        )
        expect(blockProvider.getBlockTimestamps).toHaveBeenOnlyCalledWith([
          100, 101, 102,
        ])
        expect(
          privacyAnonymitySetEventRepo.upsertMany,
        ).toHaveBeenOnlyCalledWith([
          {
            configurationId: 'strk-config',
            projectId: 'strk20',
            bucketId: 'strk20-STRK',
            chain: 'starknet',
            timestamp,
            blockNumber: 100,
            txHash: '0xstrk-tx',
            logIndex: 0,
            sender: ALICE,
            amount: 5_000_000_000_000_000_000_000n,
          },
          {
            configurationId: 'usdc-config',
            projectId: 'strk20',
            bucketId: 'strk20-USDC',
            chain: 'starknet',
            timestamp: timestamp + UnixTime.HOUR,
            blockNumber: 101,
            txHash: '0xusdc-tx',
            logIndex: 2,
            sender: BOB,
            amount: 200_000_000n,
          },
        ])
        expect(safeHeight).toEqual(to)
      })

      it('caps an update at the end of the day', async () => {
        const from = UnixTime.toStartOf(UnixTime(1_700_000_000), 'day')
        const to = from + 2 * UnixTime.DAY
        const configurations = [
          config({ id: 'strk-config', bucketId: 'strk20-STRK', token: STRK }),
        ]
        const starknetClient = mockObject<StarknetClient>({
          getEvents: mockFn().resolvesToOnce([]),
        })
        const privacyAnonymitySetEventRepo = mockObject<
          Database['privacyAnonymitySetEvent']
        >({
          upsertMany: mockFn().resolvesToOnce(0),
        })

        const indexer = new StarknetPrivacyAnonymitySetIndexer(
          {
            chain: 'starknet',
            configurations,
            blockProvider: mockObject<BlockProvider>({}),
            starknetClient,
            db: mockDatabase({
              privacyBlockTimestamp: mockObject<
                Database['privacyBlockTimestamp']
              >({
                findBlockNumberByChainAndTimestamp: mockFn()
                  .resolvesToOnce(50)
                  .resolvesToOnce(150),
              }),
              privacyAnonymitySetEvent: privacyAnonymitySetEventRepo,
            }),
            parents: [],
            indexerService: mockObject<IndexerService>({}),
          },
          Logger.SILENT,
        )

        const save = await indexer.multiUpdate(from, to, configurations)
        const safeHeight = await save()

        expect(
          privacyAnonymitySetEventRepo.upsertMany,
        ).toHaveBeenOnlyCalledWith([])
        expect(safeHeight).toEqual(from + UnixTime.DAY)
      })
    },
  )

  describe(StarknetPrivacyAnonymitySetIndexer.idToConfigurationId.name, () => {
    it('matches the id the frontend derives for the same bucket', () => {
      const properties = {
        projectId: 'strk20',
        bucketId: 'strk20-STRK',
        chain: 'starknet',
        address: POOL,
        event: DEPOSIT,
        sinceTimestamp: UnixTime(0),
        extractor: 'strk20Deposit' as const,
        params: { tokenAddress: STRK },
      }

      const id =
        StarknetPrivacyAnonymitySetIndexer.idToConfigurationId(properties)

      expect(id).toEqual(
        createPrivacyAnonymitySetConfigurationId({
          projectId: 'strk20',
          bucketId: 'strk20-STRK',
          chain: 'starknet',
          address: POOL,
          event: DEPOSIT,
          extractor: 'strk20Deposit',
          params: { tokenAddress: STRK },
        }),
      )
      expect(id).toEqual('4109972aa4ff')
    })
  })
})

function config({
  id,
  bucketId,
  token,
}: {
  id: string
  bucketId: string
  token: string
}): Configuration<StarknetPrivacyAnonymitySetIndexerConfig> {
  return {
    id,
    minHeight: UnixTime(0),
    maxHeight: null,
    properties: {
      id,
      projectId: 'strk20',
      bucketId,
      chain: 'starknet',
      address: POOL,
      event: DEPOSIT,
      sinceTimestamp: UnixTime(0),
      extractor: 'strk20Deposit',
      params: { tokenAddress: token },
    },
  }
}

function event(event: StarknetEvent): StarknetEvent {
  return event
}
