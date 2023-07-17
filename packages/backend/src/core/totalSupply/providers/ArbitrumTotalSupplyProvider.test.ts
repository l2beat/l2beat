import {
  AssetId,
  Bytes,
  ChainId,
  EthereumAddress,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'

import { ArbitrumMulticallClient } from '../../../peripherals/arbitrum/multicall/ArbitrumMulticall'
import { EthereumClient } from '../../../peripherals/ethereum/EthereumClient'
import {
  ArbitrumTotalSupplyProvider,
  decodeErc20TotalSupplyQuery,
  encodeErc20TotalSupplyQuery,
} from './ArbitrumTotalSupplyProvider'

describe(ArbitrumTotalSupplyProvider.name, () => {
  describe(ArbitrumTotalSupplyProvider.prototype.getTotalSupplies.name, () => {
    describe('if multicall can be used', () => {
      it('performs a multicall total supply queries', async () => {
        const ASSET_ID = AssetId.USDC
        const CHAIN_ID = ChainId.ARBITRUM
        const QUERY_TIMESTAMP = new UnixTime(1000)
        const MULTICALL_ADDRESS = EthereumAddress.random()
        const USDC_TOKEN_ADDRESS = EthereumAddress.random()
        const QUERY_BLOCK_NUMBER = 1234

        const USDC_TOTAL_SUPPLY = 420n
        const USDC_TOTAL_SUPPLY_BYTES = Bytes.fromNumber(420).padStart(32)

        const arbitrumClient = mockObject<EthereumClient>({
          call: async () => USDC_TOTAL_SUPPLY_BYTES,
        })

        const multicallClient = mockObject<ArbitrumMulticallClient>({
          getChainId: () => CHAIN_ID,
          canBeUsed: () => true,
          multicall: async () => [
            { success: true, data: USDC_TOTAL_SUPPLY_BYTES },
          ],
          getAddress: () => MULTICALL_ADDRESS,
        })

        const arbitrumTotalSupplyProvider = new ArbitrumTotalSupplyProvider(
          arbitrumClient,
          multicallClient,
        )

        const results = await arbitrumTotalSupplyProvider.getTotalSupplies(
          [{ assetId: ASSET_ID, tokenAddress: USDC_TOKEN_ADDRESS }],
          QUERY_TIMESTAMP,
          QUERY_BLOCK_NUMBER,
        )

        expect(multicallClient.canBeUsed).toHaveBeenCalledTimes(1)
        expect(multicallClient.multicall).toHaveBeenCalledTimes(1)
        expect(arbitrumClient.call).not.toHaveBeenCalled()

        expect(results).toEqual([
          {
            timestamp: QUERY_TIMESTAMP,
            totalSupply: USDC_TOTAL_SUPPLY,
            chainId: CHAIN_ID,
            assetId: ASSET_ID,
          },
        ])
      })
    })

    describe('if multicall cannot be used', () => {
      it('performs a plain total supply queries', async () => {
        const ASSET_ID = AssetId.USDC
        const CHAIN_ID = ChainId.ARBITRUM
        const QUERY_TIMESTAMP = new UnixTime(1000)
        const MULTICALL_ADDRESS = EthereumAddress.random()
        const USDC_TOKEN_ADDRESS = EthereumAddress.random()
        const QUERY_BLOCK_NUMBER = 1234

        const USDC_TOTAL_SUPPLY = 420n
        const USDC_TOTAL_SUPPLY_BYTES = Bytes.fromNumber(420).padStart(32)

        const arbitrumClient = mockObject<EthereumClient>({
          call: async () => USDC_TOTAL_SUPPLY_BYTES,
        })

        const multicallClient = mockObject<ArbitrumMulticallClient>({
          getChainId: () => CHAIN_ID,
          canBeUsed: () => false,
          multicall: async () => [],
          getAddress: () => MULTICALL_ADDRESS,
        })

        const arbitrumTotalSupplyProvider = new ArbitrumTotalSupplyProvider(
          arbitrumClient,
          multicallClient,
        )

        const results = await arbitrumTotalSupplyProvider.getTotalSupplies(
          [{ assetId: ASSET_ID, tokenAddress: USDC_TOKEN_ADDRESS }],
          QUERY_TIMESTAMP,
          QUERY_BLOCK_NUMBER,
        )

        expect(multicallClient.canBeUsed).toHaveBeenCalledTimes(1)
        expect(multicallClient.multicall).not.toHaveBeenCalled()
        expect(arbitrumClient.call).toHaveBeenCalledTimes(1) // For ERC20 totalSupply call

        expect(results).toEqual([
          {
            assetId: ASSET_ID,
            totalSupply: USDC_TOTAL_SUPPLY,
            timestamp: QUERY_TIMESTAMP,
            chainId: CHAIN_ID,
          },
        ])
      })
    })
  })
})

describe(encodeErc20TotalSupplyQuery.name, () => {
  it('should encode the ERC20 totalSupply query', () => {
    const tokenAddress = EthereumAddress.random()

    const result = encodeErc20TotalSupplyQuery(tokenAddress)

    expect(result.address.toString()).toEqual(tokenAddress.toString())
    // hashFunctionSelector("function totalSupply() view returns (uint256)") = 0x18160ddd
    expect(result.data.toString()).toEqual('0x18160ddd')
  })
})

describe(decodeErc20TotalSupplyQuery.name, () => {
  it('should decode ERC20 totalSupply query result into number', () => {
    // Example Arbitrum USDC total supply call response
    // 166330035479385 = 0x9746baae2359
    const totalSupplyResponse = Bytes.fromHex(
      '0x00000000000000000000000000000000000000000000000000009746baae2359',
    )

    const result = decodeErc20TotalSupplyQuery(totalSupplyResponse)

    expect(result).toEqual(166330035479385n)
  })
})
