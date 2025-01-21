import type { AmountRecord } from '@l2beat/database'
import type { RpcClient } from '@l2beat/shared'
import { Bytes, EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { BigNumber, utils } from 'ethers'
import type { MulticallClient } from '../../../peripherals/multicall/MulticallClient'
import {
  AggLayerService,
  type AggLayerServiceDependencies,
  type Config,
  bridgeInterface,
  erc20Interface,
} from './AggLayerService'

const NOW = UnixTime.now()
const MOCK_ID1 = '1'
const MOCK_ID2 = '2'
export const BRIDGE_ADDRESS = EthereumAddress.random()

describe(AggLayerService.name, () => {
  describe(AggLayerService.prototype.fetchAmounts.name, () => {
    it('fetch amounts for l2 tokens and native as undefined', async () => {
      const mockToken1 = aggLayerL2Token({
        l1Address: EthereumAddress.random(),
      })
      const mockToken2 = aggLayerL2Token({
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
        NOW,
        0,
        [mockToken1, mockToken2],
        undefined,
      )

      expect(result).toEqual([
        amountRecord(MOCK_ID1, 400n),
        amountRecord(MOCK_ID2, 700n),
      ])
      expect(rpcClient.getBalance).not.toHaveBeenCalled()
      expect(rpcClient.call).not.toHaveBeenCalled()
    })

    it('fetch amounts for l2 token and native ether preminted', async () => {
      const mockToken1 = aggLayerL2Token({
        l1Address: EthereumAddress.random(),
      })

      const mockNativeToken = aggLayerNativeEtherPreminted({
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
        NOW,
        0,
        [mockToken1],
        mockNativeToken,
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
      const mockToken1 = aggLayerL2Token({
        l1Address: EthereumAddress.random(),
      })

      const mockWrapperEther = aggLayerNativeEtherWrapped({
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
        NOW,
        0,
        [mockToken1],
        mockWrapperEther,
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
      const mockToken = aggLayerL2Token({
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

      const result = await aggLayerService.getL2TokensAmounts(NOW, 123456, [
        mockToken,
      ])

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
        Config<'aggLayerL2Token'> & { address: EthereumAddress }
      >({
        address: EthereumAddress.random(),
        id: MOCK_ID1,
      })
      const mockToken2 = mockObject<
        Config<'aggLayerL2Token'> & { address: EthereumAddress }
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
      const result = await aggLayerService.getL2TokensTotalSupply(NOW, 123456, [
        mockToken1,
        mockToken2,
      ])

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
      const mockToken1 = aggLayerL2Token({
        l1Address: EthereumAddress.random(),
      })
      const mockToken2 = aggLayerL2Token({
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

      const result = await aggLayerService.getL2TokensAddresses(123456, [
        mockToken1,
        mockToken2,
      ])

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
      const mockToken = aggLayerNativeEtherPreminted({
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
        NOW,
        0,
        mockToken,
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
      const token = aggLayerNativeEtherWrapped({
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
        NOW,
        0,
        token,
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
  const { multicallClient, rpcClient, bridgeAddress } = opts
  return new AggLayerService({
    bridgeAddress: bridgeAddress ?? BRIDGE_ADDRESS,
    multicallClient: multicallClient ?? mockObject<MulticallClient>({}),
    rpcClient: rpcClient ?? mockObject<RpcClient>({}),
  })
}

function aggLayerL2Token(opts: Partial<Config<'aggLayerL2Token'>>) {
  return mockObject<Config<'aggLayerL2Token'>>({
    id: MOCK_ID1,
    type: 'aggLayerL2Token',
    originNetwork: 0,
    ...opts,
  })
}

function aggLayerNativeEtherPreminted(
  opts: Partial<Config<'aggLayerNativeEtherPreminted'>> = {},
) {
  return mockObject<Config<'aggLayerNativeEtherPreminted'>>({
    id: MOCK_ID1,
    type: 'aggLayerNativeEtherPreminted',
    ...opts,
  })
}

function aggLayerNativeEtherWrapped(
  opts: Partial<Config<'aggLayerNativeEtherWrapped'>> = {},
) {
  return mockObject<Config<'aggLayerNativeEtherWrapped'>>({
    id: MOCK_ID1,
    type: 'aggLayerNativeEtherWrapped',
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
