import type { BlockIndexerClient, BlockProvider } from '@l2beat/shared'
import { expect, mockFn, mockObject } from 'earl'
import { BlockTimestampProvider } from './BlockTimestampProvider'

describe(BlockTimestampProvider.name, () => {
  describe(BlockTimestampProvider.prototype.getBlockNumberAtOrBefore
    .name, () => {
    it('fetches using provider if configured', async () => {
      const BLOCK_NUMBER = 1
      const explorerClient = mockObject<BlockIndexerClient>({
        getBlockNumberAtOrBefore: async () => BLOCK_NUMBER,
      })

      const service = new BlockTimestampProvider({
        indexerClients: [explorerClient],
        blockProvider: mockObject<BlockProvider>({}),
      })

      const blockNumber = await service.getBlockNumberAtOrBefore(0)

      expect(blockNumber).toEqual(BLOCK_NUMBER)
      expect(explorerClient.getBlockNumberAtOrBefore).toHaveBeenOnlyCalledWith(
        0,
      )
    })

    it('fetches using RPC if provider not defined', async () => {
      const BLOCK_NUMBER = 1

      const blockProvider = mockObject<BlockProvider>({
        getBlockNumberAtOrBefore: async () => BLOCK_NUMBER,
      })
      const service = new BlockTimestampProvider({
        indexerClients: [],
        blockProvider: blockProvider,
      })

      const blockNumber = await service.getBlockNumberAtOrBefore(0)

      expect(blockNumber).toEqual(BLOCK_NUMBER)
      expect(blockProvider.getBlockNumberAtOrBefore).toHaveBeenOnlyCalledWith(0)
    })

    it('fetches using RPC if there is an issue with provider', async () => {
      const BLOCK_NUMBER = 1

      const explorerClient = mockObject<BlockIndexerClient>({
        getBlockNumberAtOrBefore: mockFn().throwsOnce('ERROR'),
      })
      const blockProvider = mockObject<BlockProvider>({
        getBlockNumberAtOrBefore: async () => BLOCK_NUMBER,
      })
      const service = new BlockTimestampProvider({
        indexerClients: [explorerClient],
        blockProvider,
      })

      const blockNumber = await service.getBlockNumberAtOrBefore(0)

      expect(blockNumber).toEqual(BLOCK_NUMBER)
      expect(blockProvider.getBlockNumberAtOrBefore).toHaveBeenOnlyCalledWith(0)
    })
  })
})
