import { Logger } from '@l2beat/backend-tools'
import {
  AggLayerL2Token,
  AggLayerNativeEtherPreminted,
  AggLayerNativeEtherWrapped,
  Bytes,
  EthereumAddress,
} from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { BigNumber, utils } from 'ethers'
import { MulticallClient } from '../../../peripherals/multicall/MulticallClient'
import { RpcClient } from '../../../peripherals/rpcclient/RpcClient'
import {
  AggLayerService,
  bridgeInterface,
  erc20Interface,
} from './AggLayerService'

describe(AggLayerService.name, () => {
  describe(AggLayerService.prototype.getL2TokensAddresses.name, () => {
    it('encodes, calls, decodes and returns correct L2 token addresses', async () => {
      const mockToken1 = mockObject<AggLayerL2Token>({
        l1Address: EthereumAddress.random(),
      })
      const mockToken2 = mockObject<AggLayerL2Token>({
        l1Address: EthereumAddress.random(),
      })

      const mockL2Address1 = EthereumAddress.random()
      const mockL2Address2 = EthereumAddress.random()

      const rpcClient = mockObject<RpcClient>({})
      const multicallClient = mockObject<MulticallClient>({
        multicall: mockFn().resolvesTo([
          {
            success: true,
            data: Bytes.fromHex(
              bridgeInterface.encodeFunctionResult('getTokenWrappedAddress', [
                mockL2Address1.toString(),
              ]),
            ),
          },
          {
            success: true,
            data: Bytes.fromHex(
              bridgeInterface.encodeFunctionResult('getTokenWrappedAddress', [
                mockL2Address2.toString(),
              ]),
            ),
          },
        ]),
      })

      const aggLayerService = new AggLayerService({
        logger: Logger.SILENT,
        multicallClient,
        rpcClient,
      })

      const result = await aggLayerService.getL2TokensAddresses(
        [mockToken1, mockToken2],
        123456,
      )

      // encodes and calls
      expect(multicallClient.multicall).toHaveBeenCalledWith(
        [
          {
            address: EthereumAddress(
              '0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe',
            ),
            data: Bytes.fromHex(
              bridgeInterface.encodeFunctionData('getTokenWrappedAddress', [
                0,
                mockToken1.l1Address,
              ]),
            ),
          },
          {
            address: EthereumAddress(
              '0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe',
            ),
            data: Bytes.fromHex(
              bridgeInterface.encodeFunctionData('getTokenWrappedAddress', [
                0,
                mockToken2.l1Address,
              ]),
            ),
          },
        ],
        123456,
      )

      // decodes and returns
      expect(result).toEqual([
        { ...mockToken1, address: mockL2Address1 },
        { ...mockToken2, address: mockL2Address2 },
      ])
    })
  })

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
