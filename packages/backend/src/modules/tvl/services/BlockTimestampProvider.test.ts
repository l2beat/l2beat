import { Logger } from '@l2beat/backend-tools'
import { BlockIndexerClient } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { RpcClient } from '../../../peripherals/rpcclient/RpcClient'
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
        blockClients: [mockObject<RpcClient>({})],
        logger: Logger.SILENT,
      })

      const blockNumber = await service.getBlockNumberAtOrBefore(UnixTime.ZERO)

      expect(blockNumber).toEqual(BLOCK_NUMBER)
      expect(explorerClient.getBlockNumberAtOrBefore).toHaveBeenOnlyCalledWith(
        UnixTime.ZERO,
      )
    })

    it('fetches using RPC if provider not defined', async () => {
      const BLOCK_NUMBER = 1

      const rpc = mockObject<RpcClient>({
        getBlockNumberAtOrBefore: async () => BLOCK_NUMBER,
      })
      const service = new BlockTimestampProvider({
        indexerClients: [],
        blockClients: [rpc],
        logger: Logger.SILENT,
      })

      const blockNumber = await service.getBlockNumberAtOrBefore(UnixTime.ZERO)

      expect(blockNumber).toEqual(BLOCK_NUMBER)
      expect(rpc.getBlockNumberAtOrBefore).toHaveBeenOnlyCalledWith(
        UnixTime.ZERO,
      )
    })

    it('fetches using RPC if there is an issue with provider', async () => {
      const BLOCK_NUMBER = 1

      const explorerClient = mockObject<BlockIndexerClient>({
        getBlockNumberAtOrBefore: mockFn().throwsOnce('ERROR'),
      })
      const rpc = mockObject<RpcClient>({
        getBlockNumberAtOrBefore: async () => BLOCK_NUMBER,
      })
      const service = new BlockTimestampProvider({
        indexerClients: [explorerClient],
        blockClients: [rpc],
        logger: Logger.SILENT,
      })

      const blockNumber = await service.getBlockNumberAtOrBefore(UnixTime.ZERO)

      expect(blockNumber).toEqual(BLOCK_NUMBER)
      expect(rpc.getBlockNumberAtOrBefore).toHaveBeenOnlyCalledWith(
        UnixTime.ZERO,
      )
    })
  })
})
