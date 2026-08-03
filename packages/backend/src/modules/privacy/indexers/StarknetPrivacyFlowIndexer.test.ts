import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import type {
  BlockProvider,
  StarknetClient,
  StarknetEvent,
} from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { mockDatabase } from '../../../test/database'
import type { IndexerService } from '../../../tools/uif/IndexerService'
import type { Configuration } from '../../../tools/uif/multi/types'
import type { StarknetPrivacyFlowIndexerConfig } from '../types'
import { StarknetPrivacyFlowIndexer } from './StarknetPrivacyFlowIndexer'

const POOL = '0xpool'
const TOKEN = '0x0123'
const DEPOSIT = '0xdeposit'
const WITHDRAWAL = '0xwithdrawal'

describe(StarknetPrivacyFlowIndexer.name, () => {
  describe(StarknetPrivacyFlowIndexer.prototype.multiUpdate.name, () => {
    it('fetches Starknet events, extracts flows, and saves valued records', async () => {
      const from = UnixTime.toStartOf(UnixTime(0), 'day')
      const to = from + UnixTime.HOUR
      const timestamp = from + UnixTime.HOUR
      const configurations = [
        config({
          id: 'deposit-config',
          direction: 'deposit',
          event: DEPOSIT,
          extractor: 'strk20Deposit',
        }),
        config({
          id: 'withdrawal-config',
          direction: 'withdrawal',
          event: WITHDRAWAL,
          extractor: 'strk20Withdrawal',
        }),
      ]

      const starknetClient = mockObject<StarknetClient>({
        getEvents: mockFn().returnsOnce([
          event({
            block_number: 100,
            transaction_hash: '0xdeposit-tx',
            event_index: 0,
            keys: [DEPOSIT, '0xuser', '0x123'],
            data: ['0x2625a00'],
          }),
          event({
            block_number: 101,
            transaction_hash: '0xwithdrawal-tx',
            event_index: 1,
            keys: [WITHDRAWAL, '0xrecipient', '0x123'],
            data: ['0xencrypted1', '0xencrypted2', '0xencrypted3', '0xf4240'],
          }),
          event({
            block_number: 102,
            transaction_hash: '0xother-token-tx',
            event_index: 0,
            keys: [DEPOSIT, '0xuser', '0x456'],
            data: ['0xf4240'],
          }),
        ]),
      })
      const blockProvider = mockObject<BlockProvider>({
        getBlockTimestamps: mockFn().returnsOnce(
          new Map([
            [100, timestamp],
            [101, timestamp],
            [102, timestamp],
          ]),
        ),
      })
      const privacyBlockTimestampRepo = mockObject<
        Database['privacyBlockTimestamp']
      >({
        findBlockNumberByChainAndTimestamp: mockFn()
          .returnsOnce(50)
          .returnsOnce(150),
      })
      const privacyPriceRepo = mockObject<Database['privacyPrice']>({
        getPricesByPriceIdsInRange: mockFn().returnsOnce([
          {
            priceId: 'usd-coin',
            timestamp: UnixTime.toStartOf(timestamp, 'hour'),
            priceUsd: 1.01,
            configurationId: 'price-config',
          },
        ]),
      })
      const privacyFlowEventRepo = mockObject<Database['privacyFlowEvent']>({
        upsertMany: mockFn().returnsOnce(undefined),
      })

      const indexer = new StarknetPrivacyFlowIndexer(
        {
          chain: 'starknet',
          configurations,
          blockProvider,
          starknetClient,
          db: mockDatabase({
            privacyBlockTimestamp: privacyBlockTimestampRepo,
            privacyPrice: privacyPriceRepo,
            privacyFlowEvent: privacyFlowEventRepo,
          }),
          parents: [],
          indexerService: mockObject<IndexerService>({}),
        },
        Logger.SILENT,
      )

      const update = await indexer.multiUpdate(from, to, configurations)
      const safeHeight = await update()

      expect(starknetClient.getEvents).toHaveBeenOnlyCalledWith(50, 150, POOL, [
        DEPOSIT,
        WITHDRAWAL,
      ])
      expect(blockProvider.getBlockTimestamps).toHaveBeenOnlyCalledWith([
        100, 101, 102,
      ])
      expect(privacyFlowEventRepo.upsertMany).toHaveBeenOnlyCalledWith([
        {
          configurationId: 'deposit-config',
          projectId: 'strk20',
          bucketId: 'strk20-USDC',
          chain: 'starknet',
          direction: 'deposit',
          timestamp,
          blockNumber: 100,
          txHash: '0xdeposit-tx',
          logIndex: 0,
          count: 1,
          amount: 40_000_000n,
          priceId: 'usd-coin',
          valueUsd: 40.4,
        },
        {
          configurationId: 'withdrawal-config',
          projectId: 'strk20',
          bucketId: 'strk20-USDC',
          chain: 'starknet',
          direction: 'withdrawal',
          timestamp,
          blockNumber: 101,
          txHash: '0xwithdrawal-tx',
          logIndex: 1,
          count: 1,
          amount: 1_000_000n,
          priceId: 'usd-coin',
          valueUsd: 1.01,
        },
      ])
      expect(safeHeight).toEqual(to)
    })
  })
})

function config(
  properties: Pick<
    StarknetPrivacyFlowIndexerConfig,
    'id' | 'direction' | 'event' | 'extractor'
  >,
): Configuration<StarknetPrivacyFlowIndexerConfig> {
  return {
    id: properties.id,
    minHeight: UnixTime(0),
    maxHeight: null,
    properties: {
      ...properties,
      projectId: 'strk20',
      bucketId: 'strk20-USDC',
      chain: 'starknet',
      address: POOL,
      sinceTimestamp: UnixTime(0),
      priceId: 'usd-coin',
      decimals: 6,
      params: { tokenAddress: TOKEN },
    },
  }
}

function event(event: StarknetEvent): StarknetEvent {
  return event
}
