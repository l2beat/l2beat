import { Logger } from '@l2beat/backend-tools'
import { AmountRecord } from '@l2beat/database'
import { Bytes, EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { BigNumber, utils } from 'ethers'
import { MulticallClient } from '../../../peripherals/multicall/MulticallClient'
import { RpcClient } from '../../../peripherals/rpcclient/RpcClient'
import {
  AggLayerService,
  AggLayerServiceDependencies,
  BRIDGE_ADDRESS,
  Config,
  bridgeInterface,
  erc20Interface,
} from './AggLayerService'

const NOW = UnixTime.now()
const MOCK_ID1 = '1'
const MOCK_ID2 = '2'

describe.only(AggLayerService.name, () => {
  describe(AggLayerService.prototype.fetchAmounts.name, () => {
    it('fetch amounts for l2 tokens and native as undefined', async () => {
      const mockToken1 = agglayerL2Token({
        l1Address: EthereumAddress.random(),
      })
      const mockToken2 = agglayerL2Token({
        l1Address: EthereumAddress.random(),
      })

      const rpcClient = mockObject<RpcClient>({
        getBalance: mockFn(),
        call: mockFn(),
      })
      const mockAggLayerService = agglayerService({
        rpcClient,
      })

      mockAggLayerService.getL2TokensAmounts = mockFn().resolvesTo([
        amountRecord(MOCK_ID1, 400n),
        amountRecord(MOCK_ID2, 700n),
      ])

      const result = await mockAggLayerService.fetchAmounts(
        [mockToken1, mockToken2],
        undefined,
        0,
        NOW,
      )

      expect(result).toEqual([
        amountRecord(MOCK_ID1, 400n),
        amountRecord(MOCK_ID2, 700n),
      ])
      expect(rpcClient.getBalance).not.toHaveBeenCalled()
      expect(rpcClient.call).not.toHaveBeenCalled()
    })

    it('fetch amounts for l2 token and native ether preminted', async () => {
      const mockToken1 = agglayerL2Token({
        l1Address: EthereumAddress.random(),
      })

      const mockNativeToken = agglayerNativeEtherPreminted({
        l2BridgeAddress: EthereumAddress.random(),
        premintedAmount: 1000n,
        id: MOCK_ID2,
      })

      const rpcClient = mockObject<RpcClient>({
        getBalance: mockFn().resolvesTo(BigNumber.from(900)),
      })
      const mockAggLayerService = agglayerService({
        rpcClient,
      })

      mockAggLayerService.getL2TokensAmounts = mockFn().resolvesTo([
        amountRecord(MOCK_ID1, 400n),
      ])

      const result = await mockAggLayerService.fetchAmounts(
        [mockToken1],
        mockNativeToken,
        0,
        NOW,
      )

      expect(result).toEqual([
        amountRecord(MOCK_ID1, 400n),
        amountRecord(MOCK_ID2, 100n),
      ])
      expect(rpcClient.getBalance).toHaveBeenCalledWith(
        mockNativeToken.l2BridgeAddress,
        0,
      )
    })

    it('fetch amounts for l2 token and native ether wrapped', async () => {
      const mockToken1 = agglayerL2Token({
        l1Address: EthereumAddress.random(),
      })

      const mockWrapperEther = agglayerNativeEtherWrapped({
        wethAddress: EthereumAddress.random(),
        id: MOCK_ID2,
      })

      const rpcClient = mockObject<RpcClient>({
        call: mockFn().resolvesTo(
          erc20Interface.encodeFunctionResult('totalSupply', [300n]),
        ),
      })
      const mockAggLayerService = agglayerService({
        rpcClient,
      })

      mockAggLayerService.getL2TokensAmounts = mockFn().resolvesTo([
        amountRecord(MOCK_ID1, 400n),
      ])

      const result = await mockAggLayerService.fetchAmounts(
        [mockToken1],
        mockWrapperEther,
        0,
        NOW,
      )

      expect(result).toEqual([
        amountRecord(MOCK_ID1, 400n),
        amountRecord(MOCK_ID2, 300n),
      ])
      expect(rpcClient.call).toHaveBeenCalledWith(
        {
          to: mockWrapperEther.wethAddress,
          data: encodeTotalSupplyData(),
        },
        0,
      )
    })
  })

  describe(AggLayerService.prototype.getL2TokensAmounts.name, () => {
    it('should fetch L2 token addresses and total supplies', async () => {
      const mockToken = agglayerL2Token({
        l1Address: EthereumAddress.random(),
      })

      const mockL2Address = EthereumAddress.random()
      const mockTokenSupply = 1000n

      const rpcClient = mockObject<RpcClient>({})
      const multicallClient = mockObject<MulticallClient>({
        multicall: mockFn()
          .resolvesToOnce([
            {
              success: true,
              data: encodeTokenWrappedAddressResult(mockL2Address),
            },
          ])
          .resolvesToOnce([
            {
              success: true,
              data: encodeTotalSupplyResult(mockTokenSupply),
            },
          ]),
      })

      const aggLayerService = agglayerService({
        rpcClient,
        multicallClient,
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
            data: encodeTokenWrappedAddressData(mockToken.l1Address),
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
            data: encodeTotalSupplyData(),
          },
        ],
        123456,
      )
      expect(result).toEqual([amountRecord(MOCK_ID1, mockTokenSupply)])
    })
  })

  describe(AggLayerService.prototype.getL2TokensTotalSupply.name, () => {
    it('encodes, calls, decodes and returns AmountRecords with correct supply', async () => {
      const mockToken1 = mockObject<
        Config & { address: EthereumAddress; type: 'agglayerL2Token' }
      >({
        address: EthereumAddress.random(),
        id: MOCK_ID1,
      })
      const mockToken2 = mockObject<
        Config & { address: EthereumAddress; type: 'agglayerL2Token' }
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
            data: encodeTotalSupplyResult(mockToken1Supply),
          },
          {
            success: true,
            data: encodeTotalSupplyResult(mockToken2Supply),
          },
        ]),
      })

      const aggLayerService = agglayerService({
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
            data: encodeTotalSupplyData(),
          },
          {
            address: mockToken2.address,
            data: encodeTotalSupplyData(),
          },
        ],
        123456,
      )

      // decodes and returns
      expect(result).toEqual([
        amountRecord(mockToken1.id, mockToken1Supply),
        amountRecord(mockToken2.id, mockToken2Supply),
      ])
    })
  })

  describe(AggLayerService.prototype.getL2TokensAddresses.name, () => {
    it('encodes, calls, decodes and returns correct L2 token addresses', async () => {
      const mockToken1 = agglayerL2Token({
        l1Address: EthereumAddress.random(),
      })
      const mockToken2 = agglayerL2Token({
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
            data: encodeTokenWrappedAddressResult(mockL2Address1),
          },
          {
            success: true,
            data: encodeTokenWrappedAddressResult(mockL2Address2),
          },
        ]),
      })

      const aggLayerService = agglayerService({
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
            data: encodeTokenWrappedAddressData(mockToken1.l1Address),
          },
          {
            address: BRIDGE_ADDRESS,
            data: encodeTokenWrappedAddressData(mockToken2.l1Address),
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
      const mockToken = agglayerNativeEtherPreminted({
        l2BridgeAddress: EthereumAddress.random(),
        premintedAmount: 1000n,
      })

      const rpcClient = mockObject<RpcClient>({
        getBalance: mockFn().resolvesTo(BigNumber.from(900)),
      })
      const mockAggLayerService = agglayerService({
        rpcClient,
      })

      const result = await mockAggLayerService.getNativeEtherPremintedAmount(
        mockToken,
        0,
        NOW,
      )

      expect(result).toEqual(amountRecord(MOCK_ID1, 100n))
      expect(rpcClient.getBalance).toHaveBeenCalledWith(
        mockToken.l2BridgeAddress,
        0,
      )
    })
  })

  describe(AggLayerService.prototype.getNativeEtherWrappedAmount.name, () => {
    it('should return the correct totalSupply', async () => {
      const token = agglayerNativeEtherWrapped({
        wethAddress: EthereumAddress.random(),
      })

      const expectedSupply = 1000n

      const rpcClient = mockObject<RpcClient>({
        call: mockFn().resolvesTo(
          utils.defaultAbiCoder.encode(['uint256'], [expectedSupply]),
        ),
      })
      const mockAggLayerService = agglayerService({
        rpcClient,
      })

      const result = await mockAggLayerService.getNativeEtherWrappedAmount(
        token,
        0,
        NOW,
      )

      expect(result).toEqual(amountRecord(MOCK_ID1, expectedSupply))
      expect(rpcClient.call).toHaveBeenCalledWith(
        {
          to: token.wethAddress,
          data: encodeTotalSupplyData(),
        },
        0,
      )
    })
  })
})

function agglayerService(opts: Partial<AggLayerServiceDependencies>) {
  const { logger, multicallClient, rpcClient } = opts
  return new AggLayerService({
    logger: logger ?? Logger.SILENT,
    multicallClient: multicallClient ?? mockObject<MulticallClient>({}),
    rpcClient: rpcClient ?? mockObject<RpcClient>({}),
  })
}

function agglayerL2Token(opts: Partial<Config & { type: 'agglayerL2Token' }>) {
  return mockObject<Config & { type: 'agglayerL2Token' }>({
    id: MOCK_ID1,
    type: 'agglayerL2Token',
    ...opts,
  })
}

function agglayerNativeEtherPreminted(
  opts: Partial<Config & { type: 'agglayerNativeEtherPreminted' }> = {},
) {
  return mockObject<Config & { type: 'agglayerNativeEtherPreminted' }>({
    id: MOCK_ID1,
    type: 'agglayerNativeEtherPreminted',
    ...opts,
  })
}

function agglayerNativeEtherWrapped(
  opts: Partial<Config & { type: 'agglayerNativeEtherWrapped' }> = {},
) {
  return mockObject<Config & { type: 'agglayerNativeEtherWrapped' }>({
    id: MOCK_ID1,
    type: 'agglayerNativeEtherWrapped',
    ...opts,
  })
}

function encodeTotalSupplyData(): Bytes {
  return Bytes.fromHex(erc20Interface.encodeFunctionData('totalSupply', []))
}

function encodeTotalSupplyResult(totalSupply: bigint): Bytes {
  return Bytes.fromHex(
    erc20Interface.encodeFunctionResult('totalSupply', [totalSupply]),
  )
}

function encodeTokenWrappedAddressData(address: EthereumAddress): Bytes {
  return Bytes.fromHex(
    bridgeInterface.encodeFunctionData('getTokenWrappedAddress', [0, address]),
  )
}

function encodeTokenWrappedAddressResult(address: EthereumAddress): Bytes {
  return Bytes.fromHex(
    bridgeInterface.encodeFunctionResult('getTokenWrappedAddress', [
      address.toString(),
    ]),
  )
}

function amountRecord(
  configId: string,
  amount: bigint,
  timestamp: UnixTime = NOW,
): AmountRecord {
  return { configId, amount, timestamp }
}
