import { Logger } from '@l2beat/backend-tools'
import type { EthereumDaTrackingConfig } from '@l2beat/config'
import type { BlobRecord, Database } from '@l2beat/database'
import { DISCORD_MAX_MESSAGE_LENGTH, type DiscordClient } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { mockDatabase } from '../../../test/database'
import type { IndexerService } from '../../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../../tools/uif/ids'
import { EthereumBlobNotifierIndexer } from './EthereumBlobNotifierIndexer'

describe(EthereumBlobNotifierIndexer.name, () => {
  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })

  describe(EthereumBlobNotifierIndexer.prototype.update.name, () => {
    it('skips when not 1 AM UTC', async () => {
      const blobsRepository = mockBlobsRepository([])
      const discordClient = mockDiscordClient()
      const indexer = createIndexer({ blobsRepository, discordClient })
      const midnight = UnixTime.toStartOf(UnixTime.now(), 'day')

      const result = await indexer.update(0, midnight)

      expect(result).toEqual(midnight)
      expect(blobsRepository.getByTimestampRange).not.toHaveBeenCalled()
      expect(discordClient.sendMessage).not.toHaveBeenCalled()
    })

    it('runs at 1 AM UTC and sends no notification when no unmatched pairs', async () => {
      const discordClient = mockDiscordClient()
      const indexer = createIndexer({
        blobsRepository: mockBlobsRepository([
          ...blobs('0xSeq', '0xInbox', 200),
        ]),
        discordClient,
        configurations: [config({ inbox: '0xInbox' })],
      })
      const oneAm =
        UnixTime.toStartOf(UnixTime.now(), 'day') + 1 * UnixTime.HOUR

      const result = await indexer.update(0, oneAm)

      expect(result).toEqual(oneAm)
      expect(discordClient.sendMessage).not.toHaveBeenCalled()
    })

    it('sends Discord notification for unmatched pairs', async () => {
      const discordClient = mockDiscordClient()
      const indexer = createIndexer({
        blobsRepository: mockBlobsRepository([
          ...blobs('0xUnknown', '0xUnknownInbox', 150),
        ]),
        discordClient,
        configurations: [config({ inbox: '0xOther' })],
      })
      const oneAm =
        UnixTime.toStartOf(UnixTime.now(), 'day') + 1 * UnixTime.HOUR

      const result = await indexer.update(0, oneAm)

      expect(result).toEqual(oneAm)
      expect(discordClient.sendMessage).toHaveBeenCalledTimes(1)
    })

    it('propagates error when Discord send fails', async () => {
      const discordClient = mockDiscordClient(new Error('Discord API error'))
      const indexer = createIndexer({
        blobsRepository: mockBlobsRepository([
          ...blobs('0xUnknown', '0xUnknownInbox', 150),
        ]),
        discordClient,
      })
      const oneAm =
        UnixTime.toStartOf(UnixTime.now(), 'day') + 1 * UnixTime.HOUR

      await expect(indexer.update(0, oneAm)).toBeRejectedWith(
        'Discord API error',
      )
    })
  })

  describe(EthereumBlobNotifierIndexer.prototype.getUnmatchedPairs.name, () => {
    it('filters pairs below 100 blobs', async () => {
      const blobsRepository = mockBlobsRepository([
        ...blobs('0xA', '0xB', 99),
        ...blobs('0xC', '0xD', 100),
      ])
      const indexer = createIndexer({ blobsRepository })
      const oneAm =
        UnixTime.toStartOf(UnixTime.now(), 'day') + 1 * UnixTime.HOUR

      const result = await indexer.getUnmatchedPairs(oneAm)

      expect(result).toEqual([{ from: '0xC', to: '0xD', count: 100 }])
    })

    it('excludes pairs that match a config by inbox', async () => {
      const blobsRepository = mockBlobsRepository([
        ...blobs('0xA', '0xMatchedInbox', 200),
        ...blobs('0xB', '0xUnmatched', 200),
      ])
      const indexer = createIndexer({
        blobsRepository,
        configurations: [config({ inbox: '0xMatchedInbox' })],
      })
      const oneAm =
        UnixTime.toStartOf(UnixTime.now(), 'day') + 1 * UnixTime.HOUR

      const result = await indexer.getUnmatchedPairs(oneAm)

      expect(result).toEqual([{ from: '0xB', to: '0xUnmatched', count: 200 }])
    })

    it('excludes pairs that match a config by inbox and sequencer', async () => {
      const blobsRepository = mockBlobsRepository([
        ...blobs('0xSeq1', '0xInbox', 200),
        ...blobs('0xSeq2', '0xInbox', 200),
      ])
      const indexer = createIndexer({
        blobsRepository,
        configurations: [config({ inbox: '0xInbox', sequencers: ['0xSeq1'] })],
      })
      const oneAm =
        UnixTime.toStartOf(UnixTime.now(), 'day') + 1 * UnixTime.HOUR

      const result = await indexer.getUnmatchedPairs(oneAm)

      expect(result).toEqual([{ from: '0xSeq2', to: '0xInbox', count: 200 }])
    })

    it('excludes blobs that match a config by event topic', async () => {
      const blobsRepository = mockBlobsRepository([
        ...blobs('0xProposer', '0xMulticall', 150, {
          topics: ['0xcheckpoint'],
        }),
        ...blobs('0xProposer', '0xProposer', 120),
      ])
      const indexer = createIndexer({
        blobsRepository,
        configurations: [
          config({ inbox: '0xRollup', topics: ['0xCHECKPOINT'] }),
        ],
      })
      const oneAm =
        UnixTime.toStartOf(UnixTime.now(), 'day') + 1 * UnixTime.HOUR

      const result = await indexer.getUnmatchedPairs(oneAm)

      expect(result).toEqual([
        { from: '0xProposer', to: '0xProposer', count: 120 },
      ])
    })

    it('only matches configs in force at the block of the blob', async () => {
      const blobsRepository = mockBlobsRepository([
        ...blobs('0xSeq', '0xInbox', 100, { blockNumber: 200 }),
        ...blobs('0xSeq', '0xInbox', 100, { blockNumber: 300 }),
      ])
      const indexer = createIndexer({
        blobsRepository,
        configurations: [config({ inbox: '0xInbox', untilBlock: 250 })],
      })
      const oneAm =
        UnixTime.toStartOf(UnixTime.now(), 'day') + 1 * UnixTime.HOUR

      const result = await indexer.getUnmatchedPairs(oneAm)

      expect(result).toEqual([{ from: '0xSeq', to: '0xInbox', count: 100 }])
    })

    it('returns empty when no pairs have 100+ blobs', async () => {
      const blobsRepository = mockBlobsRepository([
        ...blobs('0xA', '0xB', 50),
        ...blobs('0xC', '0xD', 99),
      ])
      const indexer = createIndexer({ blobsRepository })
      const oneAm =
        UnixTime.toStartOf(UnixTime.now(), 'day') + 1 * UnixTime.HOUR

      const result = await indexer.getUnmatchedPairs(oneAm)

      expect(result).toEqual([])
    })
  })

  describe(
    EthereumBlobNotifierIndexer.prototype.formatDiscordMessages.name,
    () => {
      const oneAm =
        UnixTime.toStartOf(UnixTime.now(), 'day') + 1 * UnixTime.HOUR

      it('returns single message for small payload', () => {
        const indexer = createIndexer()
        const pairs = [
          { from: '0xA', to: '0xB', count: 200 },
          { from: '0xC', to: '0xD', count: 150 },
        ]

        const messages = indexer.formatDiscordMessages(pairs, oneAm)

        expect(messages).toHaveLength(1)
        expect(messages[0]).toInclude('**Unmatched Ethereum Blob Pairs**')
        expect(messages[0]).toInclude('`0xA` → `0xB` — **200** blobs')
        expect(messages[0]).toInclude('`0xC` → `0xD` — **150** blobs')
      })

      it('splits messages when exceeding Discord limit', () => {
        const indexer = createIndexer()
        const pairs = Array.from({ length: 30 }, (_, i) => ({
          from: '0x' + 'A'.repeat(40),
          to: '0x' + 'B'.repeat(40),
          count: 1000 - i,
        }))

        const messages = indexer.formatDiscordMessages(pairs, oneAm)

        expect(messages.length).toBeGreaterThan(1)
        for (const msg of messages) {
          expect(msg.length).toBeLessThanOrEqual(DISCORD_MAX_MESSAGE_LENGTH)
        }
      })

      it('includes header only in first message', () => {
        const indexer = createIndexer()
        const pairs = Array.from({ length: 30 }, (_, i) => ({
          from: '0x' + 'A'.repeat(40),
          to: '0x' + 'B'.repeat(40),
          count: 1000 - i,
        }))

        const messages = indexer.formatDiscordMessages(pairs, oneAm)

        expect(messages[0]).toInclude('**Unmatched Ethereum Blob Pairs**')
        for (const msg of messages.slice(1)) {
          expect(msg).not.toInclude('**Unmatched Ethereum Blob Pairs**')
        }
      })
    },
  )
})

function config(
  overrides: Partial<EthereumDaTrackingConfig> &
    Pick<EthereumDaTrackingConfig, 'inbox'>,
): EthereumDaTrackingConfig {
  return {
    type: 'ethereum',
    daLayer: 'ethereum' as EthereumDaTrackingConfig['daLayer'],
    inbox: overrides.inbox,
    sequencers: overrides.sequencers,
    topics: overrides.topics,
    sinceBlock: overrides.sinceBlock ?? 0,
    untilBlock: overrides.untilBlock,
  }
}

function mockBlobsRepository(records: BlobRecord[]) {
  return mockObject<Database['blobs']>({
    getByTimestampRange: mockFn().resolvesTo(records),
  })
}

function blobs(
  from: string,
  to: string,
  count: number,
  opts: { blockNumber?: number; topics?: string[] } = {},
): BlobRecord[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    blockNumber: opts.blockNumber ?? 100,
    timestamp: UnixTime(0),
    daLayer: 'ethereum',
    from,
    to,
    topics: opts.topics ?? null,
    size: null,
  }))
}

function mockDiscordClient(sendError?: Error) {
  return mockObject<DiscordClient>({
    sendMessage: sendError
      ? mockFn().rejectsWith(sendError)
      : mockFn().resolvesTo('msg-id'),
  })
}

function createIndexer($?: {
  blobsRepository?: ReturnType<typeof mockBlobsRepository>
  discordClient?: ReturnType<typeof mockDiscordClient>
  configurations?: EthereumDaTrackingConfig[]
}) {
  return new EthereumBlobNotifierIndexer(
    {
      db: mockDatabase({
        blobs: $?.blobsRepository ?? mockBlobsRepository([]),
      }),
      configurations: $?.configurations ?? [],
      discordClient: $?.discordClient ?? mockDiscordClient(),
      parents: [],
      indexerService: mockObject<IndexerService>(),
      minHeight: 0,
    },
    Logger.SILENT,
  )
}
