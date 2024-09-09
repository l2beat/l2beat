import { Logger } from '@l2beat/backend-tools'
import {
  AggLayerNativeEtherPreminted,
  EthereumAddress,
} from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { BigNumber } from 'ethers'
import { MulticallClient } from '../../../peripherals/multicall/MulticallClient'
import { RpcClient } from '../../../peripherals/rpcclient/RpcClient'
import { AggLayerService } from './AggLayerService'

describe(AggLayerService.name, () => {
  describe(AggLayerService.prototype.getNativeEtherPreminted.name, () => {
    it('should return the correct balance', async () => {
      const mockToken: AggLayerNativeEtherPreminted =
        mockObject<AggLayerNativeEtherPreminted>({
          l2BridgeAddress: EthereumAddress.random(),
          premintedAmount: 1000n,
        })

      const mockAggLayerService = new AggLayerService({
        logger: Logger.SILENT,
        multicallClient: mockObject<MulticallClient>({}),
        rpcClient: mockObject<RpcClient>({
          getBalance: mockFn().resolvesTo(BigNumber.from(900)),
        }),
      })

      const result = await mockAggLayerService.getNativeEtherPreminted(
        mockToken,
        0,
      )

      expect(result).toEqual(100n)
    })
  })
})
