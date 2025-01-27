import type { AmountRecord } from '@l2beat/database'
import type { RpcClient } from '@l2beat/shared'
import { Bytes, EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { utils } from 'ethers'
import type { MulticallClient } from '../../../peripherals/multicall/MulticallClient'
import {
  type Config,
  ElasticChainService,
  type ElasticChainServiceDependencies,
  bridgeInterface,
  erc20Interface,
} from './ElasticChainService'

const NOW = UnixTime.now()
const MOCK_ID1 = '1'
const MOCK_ID2 = '2'
const MOCK_ID3 = '3'
export const BRIDGE_ADDRESS = EthereumAddress.random()

describe(ElasticChainService.name, () => {
  describe(ElasticChainService.prototype.fetchAmounts.name, () => {
    it('fetch amounts for l2 tokens and ether', async () => {
      const mockToken1 = elasticChainL2Token({
        l1Address: EthereumAddress.random(),
      })
      const mockToken2 = elasticChainL2Token({
        l1Address: EthereumAddress.random(),
      })
      const mockEther = elasticChainEther({
        address: EthereumAddress.random(),
      })

      const rpcClient = mockObject<RpcClient>({
        getBalance: mockFn(),
        call: mockFn(),
      })
      const service = elasticChainService({
        rpcClient,
      })

      service.getL2TokensAmounts = mockFn().resolvesTo([
        amountRecord(MOCK_ID1, 400n),
        amountRecord(MOCK_ID2, 700n),
      ])
      service.getEtherAmount = mockFn().resolvesTo(
        amountRecord(MOCK_ID3, 1000n),
      )

      const result = await service.fetchAmounts(NOW, 0, [
        mockToken1,
        mockToken2,
        mockEther,
      ])

      expect(result).toEqual([
        amountRecord(MOCK_ID3, 1000n),
        amountRecord(MOCK_ID1, 400n),
        amountRecord(MOCK_ID2, 700n),
      ])
      expect(rpcClient.getBalance).not.toHaveBeenCalled()
      expect(rpcClient.call).not.toHaveBeenCalled()
    })

    it('fetch amounts for l2 tokens and ether as undefined', async () => {
      const mockToken1 = elasticChainL2Token({
        l1Address: EthereumAddress.random(),
      })
      const mockToken2 = elasticChainL2Token({
        l1Address: EthereumAddress.random(),
      })

      const rpcClient = mockObject<RpcClient>({
        getBalance: mockFn(),
        call: mockFn(),
      })
      const service = elasticChainService({
        rpcClient,
      })

      service.getL2TokensAmounts = mockFn().resolvesTo([
        amountRecord(MOCK_ID1, 400n),
        amountRecord(MOCK_ID2, 700n),
      ])
      service.getEtherAmount = mockFn().resolvesTo(
        amountRecord(MOCK_ID3, 1000n),
      )

      const result = await service.fetchAmounts(NOW, 0, [
        mockToken1,
        mockToken2,
      ])

      expect(result).toEqual([
        amountRecord(MOCK_ID1, 400n),
        amountRecord(MOCK_ID2, 700n),
      ])
      expect(rpcClient.getBalance).not.toHaveBeenCalled()
      expect(rpcClient.call).not.toHaveBeenCalled()
    })
  })

  describe(ElasticChainService.prototype.getEtherAmount.name, () => {
    it('should return the correct totalSupply', async () => {
      const token = elasticChainEther({
        address: EthereumAddress.random(),
      })

      const expectedSupply = 1000n

      const rpcClient = mockObject<RpcClient>({
        call: mockFn().resolvesTo(
          utils.defaultAbiCoder.encode(['uint256'], [expectedSupply]),
        ),
      })
      const mockAggLayerService = elasticChainService({
        rpcClient,
      })

      const result = await mockAggLayerService.getEtherAmount(NOW, 0, token)

      expect(result).toEqual(amountRecord(MOCK_ID1, expectedSupply))
      expect(rpcClient.call).toHaveBeenCalledWith(
        {
          to: token.address,
          data: encodeTotalSupplyData(),
        },
        0,
      )
    })
  })

  describe(ElasticChainService.prototype.getL2TokensAmounts.name, () => {
    it('should fetch L2 token addresses and total supplies', async () => {
      const mockToken = elasticChainL2Token({
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
              data: encodeL2TokenAddressResult(mockL2Address),
            },
          ])
          .resolvesToOnce([
            {
              success: true,
              data: encodeTotalSupplyResult(mockTokenSupply),
            },
          ]),
      })

      const service = elasticChainService({
        rpcClient,
        multicallClient,
      })

      const result = await service.getL2TokensAmounts(NOW, 123456, [mockToken])

      // get l2 token address call
      expect(multicallClient.multicall).toHaveBeenNthCalledWith(
        1,
        [
          {
            address: BRIDGE_ADDRESS,
            data: encodeL2TokenAddressData(mockToken.l1Address),
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

  describe(ElasticChainService.prototype.getL2TokensTotalSupply.name, () => {
    it('encodes, calls, decodes and returns AmountRecords with correct supply', async () => {
      const mockToken1 = mockObject<
        Config<'elasticChainL2Token'> & { address: EthereumAddress }
      >({
        address: EthereumAddress.random(),
        id: MOCK_ID1,
      })
      const mockToken2 = mockObject<
        Config<'elasticChainL2Token'> & { address: EthereumAddress }
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

      const service = elasticChainService({
        multicallClient,
        rpcClient,
      })
      const result = await service.getL2TokensTotalSupply(NOW, 123456, [
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

  describe(ElasticChainService.prototype.getL2TokensAddresses.name, () => {
    it('encodes, calls, decodes and returns correct L2 token addresses', async () => {
      const mockToken1 = elasticChainL2Token({
        l1Address: EthereumAddress.random(),
      })
      const mockToken2 = elasticChainL2Token({
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
            data: encodeL2TokenAddressResult(mockL2Address1),
          },
          {
            success: true,
            data: encodeL2TokenAddressResult(mockL2Address2),
          },
        ]),
      })

      const service = elasticChainService({
        multicallClient,
        rpcClient,
      })

      const result = await service.getL2TokensAddresses(123456, [
        mockToken1,
        mockToken2,
      ])

      // encodes and calls
      expect(multicallClient.multicall).toHaveBeenCalledWith(
        [
          {
            address: BRIDGE_ADDRESS,
            data: encodeL2TokenAddressData(mockToken1.l1Address),
          },
          {
            address: BRIDGE_ADDRESS,
            data: encodeL2TokenAddressData(mockToken2.l1Address),
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
})

function elasticChainService(opts: Partial<ElasticChainServiceDependencies>) {
  const { multicallClient, rpcClient, bridgeAddress } = opts
  return new ElasticChainService({
    bridgeAddress: bridgeAddress ?? BRIDGE_ADDRESS,
    multicallClient: multicallClient ?? mockObject<MulticallClient>({}),
    rpcClient: rpcClient ?? mockObject<RpcClient>({}),
  })
}

function elasticChainL2Token(opts: Partial<Config<'elasticChainL2Token'>>) {
  return mockObject<Config<'elasticChainL2Token'>>({
    id: MOCK_ID1,
    type: 'elasticChainL2Token',
    ...opts,
  })
}

function elasticChainEther(opts: Partial<Config<'elasticChainEther'>>) {
  return mockObject<Config<'elasticChainEther'>>({
    id: MOCK_ID1,
    type: 'elasticChainEther',
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

function encodeL2TokenAddressData(address: EthereumAddress): Bytes {
  return Bytes.fromHex(
    bridgeInterface.encodeFunctionData('l2TokenAddress', [address]),
  )
}

function encodeL2TokenAddressResult(address: EthereumAddress): Bytes {
  return Bytes.fromHex(
    bridgeInterface.encodeFunctionResult('l2TokenAddress', [
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
