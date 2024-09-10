import { Logger } from '@l2beat/backend-tools'
import {
  AggLayerL2Token,
  AggLayerNativeEtherPreminted,
  AggLayerNativeEtherWrapped,
  Bytes,
  EthereumAddress,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { BigNumber, utils } from 'ethers'
import { MulticallClient } from '../../../peripherals/multicall/MulticallClient'
import { RpcClient } from '../../../peripherals/rpcclient/RpcClient'
import {
  AggLayerService,
  BRIDGE_ADDRESS,
  bridgeInterface,
  erc20Interface,
} from './AggLayerService'

const NOW = UnixTime.now()
const MOCK_ID1 = '1'
const MOCK_ID2 = '2'

describe(AggLayerService.name, () => {
  describe(AggLayerService.prototype.getL2TokensAmounts.name, () => {
    it('should fetch L2 token addresses and total supplies', async () => {
      const mockToken = mockObject<AggLayerL2Token & { id: string }>({
        l1Address: EthereumAddress.random(),
        id: MOCK_ID1,
      })

      const mockL2Address = EthereumAddress.random()
      const mockTokenSupply = 1000n

      const rpcClient = mockObject<RpcClient>({})
      const multicallClient = mockObject<MulticallClient>({
        multicall: mockFn()
          .resolvesToOnce([
            {
              success: true,
              data: Bytes.fromHex(
                bridgeInterface.encodeFunctionResult('getTokenWrappedAddress', [
                  mockL2Address.toString(),
                ]),
              ),
            },
          ])
          .resolvesToOnce([
            {
              success: true,
              data: Bytes.fromHex(
                erc20Interface.encodeFunctionResult('totalSupply', [
                  mockTokenSupply,
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

      const result = await aggLayerService.getL2TokensAmounts(
        [mockToken],
        123456,
        NOW,
      )

      // get l2 token address call
      expect(multicallClient.multicall).toHaveBeenNthCalledWith(
        1,
        [
          {
            address: BRIDGE_ADDRESS,
            data: Bytes.fromHex(
              bridgeInterface.encodeFunctionData('getTokenWrappedAddress', [
                0,
                mockToken.l1Address,
              ]),
            ),
          },
        ],
        123456,
      )

      // get l2 token total supply call
      expect(multicallClient.multicall).toHaveBeenNthCalledWith(
        2,
        [
          {
            address: mockL2Address,
            data: Bytes.fromHex(
              erc20Interface.encodeFunctionData('totalSupply', []),
            ),
          },
        ],
        123456,
      )
      expect(result).toEqual([
        {
          configId: MOCK_ID1,
          amount: mockTokenSupply,
          timestamp: NOW,
        },
      ])
    })
  })

  describe(AggLayerService.prototype.getL2TokensTotalSupply.name, () => {
    it('encodes, calls, decodes and returns AmountRecords with correct supply', async () => {
      const mockToken1 = mockObject<
        AggLayerL2Token & { address: EthereumAddress; id: string }
      >({
        address: EthereumAddress.random(),
        id: MOCK_ID1,
      })
      const mockToken2 = mockObject<
        AggLayerL2Token & { address: EthereumAddress; id: string }
      >({
        address: EthereumAddress.random(),
        id: MOCK_ID2,
      })

      const mockToken1Supply = 1000n
      const mockToken2Supply = 2000n

      const rpcClient = mockObject<RpcClient>({})
      const multicallClient = mockObject<MulticallClient>({
        multicall: mockFn().resolvesTo([
          {
            success: true,
            data: Bytes.fromHex(
              erc20Interface.encodeFunctionResult('totalSupply', [
                mockToken1Supply,
              ]),
            ),
          },
          {
            success: true,
            data: Bytes.fromHex(
              erc20Interface.encodeFunctionResult('totalSupply', [
                mockToken2Supply,
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
      const result = await aggLayerService.getL2TokensTotalSupply(
        [mockToken1, mockToken2],
        123456,
        NOW,
      )

      // encodes and calls
      expect(multicallClient.multicall).toHaveBeenCalledWith(
        [
          {
            address: mockToken1.address,
            data: Bytes.fromHex(
              erc20Interface.encodeFunctionData('totalSupply', []),
            ),
          },
          {
            address: mockToken2.address,
            data: Bytes.fromHex(
              erc20Interface.encodeFunctionData('totalSupply', []),
            ),
          },
        ],
        123456,
      )

      // decodes and returns
      expect(result).toEqual([
        { configId: mockToken1.id, amount: mockToken1Supply, timestamp: NOW },
        { configId: mockToken2.id, amount: mockToken2Supply, timestamp: NOW },
      ])
    })
  })

  describe(AggLayerService.prototype.getL2TokensAddresses.name, () => {
    it('encodes, calls, decodes and returns correct L2 token addresses', async () => {
      const mockToken1 = mockObject<AggLayerL2Token & { id: string }>({
        l1Address: EthereumAddress.random(),
        id: MOCK_ID1,
      })
      const mockToken2 = mockObject<AggLayerL2Token & { id: string }>({
        l1Address: EthereumAddress.random(),
        id: MOCK_ID2,
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
            address: BRIDGE_ADDRESS,
            data: Bytes.fromHex(
              bridgeInterface.encodeFunctionData('getTokenWrappedAddress', [
                0,
                mockToken1.l1Address,
              ]),
            ),
          },
          {
            address: BRIDGE_ADDRESS,
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

  describe(AggLayerService.prototype.getNativeEtherPremintedAmount.name, () => {
    it('should fetch bridge balance and subtract it from premintedAmount', async () => {
      const mockL2BridgeAddress = EthereumAddress.random()
      const mockToken = mockObject<
        AggLayerNativeEtherPreminted & { id: string }
      >({
        l2BridgeAddress: mockL2BridgeAddress,
        premintedAmount: 1000n,
        id: MOCK_ID1,
      })

      const mockRpcClient = mockObject<RpcClient>({
        getBalance: mockFn().resolvesTo(BigNumber.from(900)),
      })
      const mockAggLayerService = new AggLayerService({
        logger: Logger.SILENT,
        multicallClient: mockObject<MulticallClient>({}),
        rpcClient: mockRpcClient,
      })

      const result = await mockAggLayerService.getNativeEtherPremintedAmount(
        mockToken,
        0,
        NOW,
      )

      expect(result).toEqual({
        configId: MOCK_ID1,
        amount: 100n,
        timestamp: NOW,
      })
      expect(mockRpcClient.getBalance).toHaveBeenCalledWith(
        mockToken.l2BridgeAddress,
        0,
      )
    })
  })

  describe(AggLayerService.prototype.getNativeEtherWrappedAmount.name, () => {
    it('should return the correct totalSupply', async () => {
      const mockWethAddress = EthereumAddress.random()
      const token = mockObject<AggLayerNativeEtherWrapped & { id: string }>({
        wethAddress: mockWethAddress,
        id: MOCK_ID1,
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

      const result = await mockAggLayerService.getNativeEtherWrappedAmount(
        token,
        0,
        NOW,
      )

      expect(result).toEqual({
        configId: MOCK_ID1,
        amount: expectedSupply,
        timestamp: NOW,
      })
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
