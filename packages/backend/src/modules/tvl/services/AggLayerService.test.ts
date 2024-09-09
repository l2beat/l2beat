import { Logger } from '@l2beat/backend-tools'
import {
  AggLayerNativeEtherPreminted,
  AggLayerNativeEtherWrapped,
  Bytes,
  EthereumAddress,
} from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { BigNumber, utils } from 'ethers'
import { MulticallClient } from '../../../peripherals/multicall/MulticallClient'
import { RpcClient } from '../../../peripherals/rpcclient/RpcClient'
import { AggLayerService, erc20Interface } from './AggLayerService'

describe(AggLayerService.name, () => {
  describe(AggLayerService.prototype.getNativeEtherPreminted.name, () => {
    it('should fetch bridge balance and subtract it from premintedAmount', async () => {
      const mockToken: AggLayerNativeEtherPreminted =
        mockObject<AggLayerNativeEtherPreminted>({
          l2BridgeAddress: EthereumAddress.random(),
          premintedAmount: 1000n,
        })

      const mockRpcClient = mockObject<RpcClient>({
        getBalance: mockFn().resolvesTo(BigNumber.from(900)),
      })
      const mockAggLayerService = new AggLayerService({
        logger: Logger.SILENT,
        multicallClient: mockObject<MulticallClient>({}),
        rpcClient: mockRpcClient,
      })

      const result = await mockAggLayerService.getNativeEtherPreminted(
        mockToken,
        0,
      )

      expect(result).toEqual(100n)
      expect(mockRpcClient.getBalance).toHaveBeenCalledWith(
        mockToken.l2BridgeAddress,
        0,
      )
    })
  })

  describe(AggLayerService.prototype.getNativeEtherWrapped.name, () => {
    it('should return the correct totalSupply', async () => {
      const token: AggLayerNativeEtherWrapped =
        mockObject<AggLayerNativeEtherWrapped>({
          wethAddress: EthereumAddress.random(),
        })

      const expectedSupply = 1000n

      const mockRpcClient = mockObject<RpcClient>({
        call: mockFn().resolvesTo(
          utils.defaultAbiCoder.encode(['uint256'], [expectedSupply]),
        ),
      })
      const mockAggLayerService = new AggLayerService({
        logger: Logger.SILENT,
        multicallClient: mockObject<MulticallClient>({}),
        rpcClient: mockRpcClient,
      })

      const result = await mockAggLayerService.getNativeEtherWrapped(token, 0)

      expect(result).toEqual(expectedSupply)
      expect(mockRpcClient.call).toHaveBeenCalledWith(
        {
          to: token.wethAddress,
          data: Bytes.fromHex(
            erc20Interface.encodeFunctionData('totalSupply', []),
          ),
        },
        0,
      )
    })
  })
})
