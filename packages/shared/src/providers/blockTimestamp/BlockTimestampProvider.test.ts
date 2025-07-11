import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { BlockIndexerClient } from '../../clients'
import type { BlockProvider } from '../block/BlockProvider'
import { BlockTimestampProvider } from './BlockTimestampProvider'

describe(BlockTimestampProvider.name, () => {
  const CHAIN = 'ethereum'
  const TIMESTAMP = UnixTime(1234567890)
  const BLOCK_NUMBER = 12345

  describe(
    BlockTimestampProvider.prototype.getBlockNumberAtOrBefore.name,
    () => {
      it('uses indexer client if available', async () => {
        const indexerClient = mockObject<BlockIndexerClient>({
          chain: CHAIN,
          getBlockNumberAtOrBefore: mockFn().resolvesToOnce(BLOCK_NUMBER),
        })

        const blockProvider = mockObject<BlockProvider>({
          chain: CHAIN,
          getBlockNumberAtOrBefore: mockFn(),
        })

        const provider = new BlockTimestampProvider({
          indexerClients: [indexerClient],
          blockProviders: [blockProvider],
        })

        const result = await provider.getBlockNumberAtOrBefore(TIMESTAMP, CHAIN)

        expect(indexerClient.getBlockNumberAtOrBefore).toHaveBeenOnlyCalledWith(
          TIMESTAMP,
        )
        expect(blockProvider.getBlockNumberAtOrBefore).not.toHaveBeenCalled()
        expect(result).toEqual(BLOCK_NUMBER)
      })

      it('falls back to block provider if indexer client fails', async () => {
        const indexerClient = mockObject<BlockIndexerClient>({
          chain: CHAIN,
          getBlockNumberAtOrBefore: mockFn().rejectsWithOnce(
            new Error('Indexer error'),
          ),
        })

        const blockProvider = mockObject<BlockProvider>({
          chain: CHAIN,
          getBlockNumberAtOrBefore: mockFn().resolvesToOnce(BLOCK_NUMBER),
        })

        const provider = new BlockTimestampProvider({
          indexerClients: [indexerClient],
          blockProviders: [blockProvider],
        })

        const result = await provider.getBlockNumberAtOrBefore(TIMESTAMP, CHAIN)

        expect(indexerClient.getBlockNumberAtOrBefore).toHaveBeenCalledTimes(1)
        expect(blockProvider.getBlockNumberAtOrBefore).toHaveBeenOnlyCalledWith(
          TIMESTAMP,
        )
        expect(result).toEqual(BLOCK_NUMBER)
      })

      it('uses block provider if no indexer client for chain', async () => {
        const otherChainIndexer = mockObject<BlockIndexerClient>({
          chain: 'other-chain',
          getBlockNumberAtOrBefore: mockFn(),
        })

        const blockProvider = mockObject<BlockProvider>({
          chain: CHAIN,
          getBlockNumberAtOrBefore: mockFn().resolvesToOnce(BLOCK_NUMBER),
        })

        const provider = new BlockTimestampProvider({
          indexerClients: [otherChainIndexer],
          blockProviders: [blockProvider],
        })

        const result = await provider.getBlockNumberAtOrBefore(TIMESTAMP, CHAIN)

        expect(
          otherChainIndexer.getBlockNumberAtOrBefore,
        ).not.toHaveBeenCalled()
        expect(blockProvider.getBlockNumberAtOrBefore).toHaveBeenOnlyCalledWith(
          TIMESTAMP,
        )
        expect(result).toEqual(BLOCK_NUMBER)
      })

      it('throws error if indexer fails and no block provider available', async () => {
        const indexerClient = mockObject<BlockIndexerClient>({
          chain: CHAIN,
          getBlockNumberAtOrBefore: mockFn().rejectsWithOnce(
            new Error('Indexer error'),
          ),
        })

        const otherChainProvider = mockObject<BlockProvider>({
          chain: 'other-chain',
          getBlockNumberAtOrBefore: mockFn(),
        })

        const provider = new BlockTimestampProvider({
          indexerClients: [indexerClient],
          blockProviders: [otherChainProvider],
        })

        await expect(
          provider.getBlockNumberAtOrBefore(TIMESTAMP, CHAIN),
        ).toBeRejectedWith('Indexer error')
      })

      it('throws error if no data sources available for chain', async () => {
        const otherChainIndexer = mockObject<BlockIndexerClient>({
          chain: 'other-chain',
          getBlockNumberAtOrBefore: mockFn(),
        })

        const otherChainProvider = mockObject<BlockProvider>({
          chain: 'other-chain',
          getBlockNumberAtOrBefore: mockFn(),
        })

        const provider = new BlockTimestampProvider({
          indexerClients: [otherChainIndexer],
          blockProviders: [otherChainProvider],
        })

        await expect(
          provider.getBlockNumberAtOrBefore(TIMESTAMP, CHAIN),
        ).toBeRejectedWith('Missing BlockTimestamp data sources')
      })
    },
  )
})
