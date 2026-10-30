import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { BlockIndexerClient } from '../../clients'
import { TargetNotReadyError } from '../../tools/DataNotReadyError'
import type { BlockProvider } from '../block/BlockProvider'
import { BlockTimestampProvider } from './BlockTimestampProvider'

describe(BlockTimestampProvider.name, () => {
  const CHAIN = 'ethereum'
  const TIMESTAMP = UnixTime(1234567890)
  const BLOCK_NUMBER = 12345

  describe(
    BlockTimestampProvider.prototype.getBlockNumberAtOrBefore.name,
    () => {
      it('returns the explorer block when the next block is after the timestamp', async () => {
        const indexerClient = mockObject<BlockIndexerClient>({
          chain: CHAIN,
          getBlockNumberAtOrBefore: mockFn().resolvesToOnce(BLOCK_NUMBER),
        })
        const blockProvider = mockObject<BlockProvider>({
          chain: CHAIN,
          getBlockTimestamp: mockFn(async (n: number) =>
            n === BLOCK_NUMBER ? TIMESTAMP - 1 : TIMESTAMP + 12,
          ),
          getBlockNumberAtOrBefore: mockFn(),
        })

        const provider = new BlockTimestampProvider({
          indexerClients: [indexerClient],
          blockProviders: [blockProvider],
        })

        const result = await provider.getBlockNumberAtOrBefore(TIMESTAMP, CHAIN)

        expect(result).toEqual(BLOCK_NUMBER)
        expect(indexerClient.getBlockNumberAtOrBefore).toHaveBeenOnlyCalledWith(
          TIMESTAMP,
        )
        expect(blockProvider.getBlockTimestamp).toHaveBeenCalledWith(
          BLOCK_NUMBER,
        )
        expect(blockProvider.getBlockTimestamp).toHaveBeenCalledWith(
          BLOCK_NUMBER + 1,
        )
        expect(blockProvider.getBlockNumberAtOrBefore).not.toHaveBeenCalled()
      })

      it('searches the RPC when the explorer block is after the timestamp', async () => {
        // e.g. the explorer answered from a fork the RPC has reorged away
        const indexerClient = mockObject<BlockIndexerClient>({
          chain: CHAIN,
          getBlockNumberAtOrBefore: mockFn().resolvesToOnce(BLOCK_NUMBER),
        })
        const blockProvider = mockObject<BlockProvider>({
          chain: CHAIN,
          getBlockTimestamp: mockFn(async (n: number) =>
            n === BLOCK_NUMBER ? TIMESTAMP + 2 : TIMESTAMP + 4,
          ),
          getBlockNumberAtOrBefore: mockFn().resolvesToOnce(BLOCK_NUMBER - 1),
        })

        const provider = new BlockTimestampProvider({
          indexerClients: [indexerClient],
          blockProviders: [blockProvider],
        })

        const result = await provider.getBlockNumberAtOrBefore(TIMESTAMP, CHAIN)

        expect(result).toEqual(BLOCK_NUMBER - 1)
      })

      it('searches the RPC when the explorer block is not the last one at or before the timestamp', async () => {
        // e.g. the explorer has not indexed past the timestamp and stepped back
        const indexerClient = mockObject<BlockIndexerClient>({
          chain: CHAIN,
          getBlockNumberAtOrBefore: mockFn().resolvesToOnce(BLOCK_NUMBER - 100),
        })
        const blockProvider = mockObject<BlockProvider>({
          chain: CHAIN,
          getBlockTimestamp: mockFn().resolvesTo(TIMESTAMP - 60),
          getBlockNumberAtOrBefore: mockFn().resolvesToOnce(BLOCK_NUMBER),
        })

        const provider = new BlockTimestampProvider({
          indexerClients: [indexerClient],
          blockProviders: [blockProvider],
        })

        const result = await provider.getBlockNumberAtOrBefore(TIMESTAMP, CHAIN)

        expect(result).toEqual(BLOCK_NUMBER)
        expect(blockProvider.getBlockNumberAtOrBefore).toHaveBeenOnlyCalledWith(
          TIMESTAMP,
          undefined,
          { requireLaterBlock: true },
        )
      })

      it('is not ready when the explorer block is the chain tip', async () => {
        const indexerClient = mockObject<BlockIndexerClient>({
          chain: CHAIN,
          getBlockNumberAtOrBefore: mockFn().resolvesToOnce(BLOCK_NUMBER),
        })
        const blockProvider = mockObject<BlockProvider>({
          chain: CHAIN,
          getBlockTimestamp: mockFn(async (n: number) => {
            if (n === BLOCK_NUMBER) return TIMESTAMP - 30
            throw new Error('Block not found')
          }),
          getBlockNumberAtOrBefore: mockFn().rejectsWithOnce(
            new TargetNotReadyError(TIMESTAMP, BLOCK_NUMBER, TIMESTAMP - 30),
          ),
        })

        const provider = new BlockTimestampProvider({
          indexerClients: [indexerClient],
          blockProviders: [blockProvider],
        })

        await expect(
          provider.getBlockNumberAtOrBefore(TIMESTAMP, CHAIN),
        ).toBeRejectedWith(TargetNotReadyError)
      })

      it('searches the RPC if the explorer fails', async () => {
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

        expect(result).toEqual(BLOCK_NUMBER)
        expect(blockProvider.getBlockNumberAtOrBefore).toHaveBeenOnlyCalledWith(
          TIMESTAMP,
          undefined,
          { requireLaterBlock: true },
        )
      })

      it('searches the RPC with a required later block if there is no explorer', async () => {
        const blockProvider = mockObject<BlockProvider>({
          chain: CHAIN,
          getBlockNumberAtOrBefore: mockFn().resolvesToOnce(BLOCK_NUMBER),
        })

        const provider = new BlockTimestampProvider({
          indexerClients: [],
          blockProviders: [blockProvider],
        })

        const result = await provider.getBlockNumberAtOrBefore(TIMESTAMP, CHAIN)

        expect(result).toEqual(BLOCK_NUMBER)
        expect(blockProvider.getBlockNumberAtOrBefore).toHaveBeenOnlyCalledWith(
          TIMESTAMP,
          undefined,
          { requireLaterBlock: true },
        )
      })

      it('returns the explorer block unchecked if the chain has no other block data source', async () => {
        const indexerClient = mockObject<BlockIndexerClient>({
          chain: CHAIN,
          getBlockNumberAtOrBefore: mockFn().resolvesToOnce(BLOCK_NUMBER),
        })
        const otherChainProvider = mockObject<BlockProvider>({
          chain: 'other-chain',
          getBlockNumberAtOrBefore: mockFn(),
        })

        const provider = new BlockTimestampProvider({
          indexerClients: [indexerClient],
          blockProviders: [otherChainProvider],
        })

        const result = await provider.getBlockNumberAtOrBefore(TIMESTAMP, CHAIN)

        expect(result).toEqual(BLOCK_NUMBER)
        expect(
          otherChainProvider.getBlockNumberAtOrBefore,
        ).not.toHaveBeenCalled()
      })

      it('throws if the chain has no block data source', async () => {
        const provider = new BlockTimestampProvider({
          indexerClients: [],
          blockProviders: [],
        })

        await expect(
          provider.getBlockNumberAtOrBefore(TIMESTAMP, CHAIN),
        ).toBeRejectedWith('Missing block data source for chain')
      })
    },
  )
})
