import {
  AssetId,
  Bytes,
  ChainId,
  EthereumAddress,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'

import { MulticallClient } from '../../peripherals/ethereum/multicall/MulticallClient'
import {
  decodeErc20TotalSupplyQuery,
  encodeErc20TotalSupplyQuery,
  TotalSupplyProvider,
} from './TotalSupplyProvider'

describe(TotalSupplyProvider.name, () => {
  describe(TotalSupplyProvider.prototype.getTotalSupplies.name, () => {
    describe('if multicall can be used', () => {
      it('performs a multicall total supply queries', async () => {
        const CHAIN_ID = ChainId.ARBITRUM
        const QUERY_TIMESTAMP = UnixTime.now()

        const USDC_TOTAL_SUPPLY = 420n
        const USDC_TOTAL_SUPPLY_BYTES = Bytes.fromNumber(420).padStart(32)

        const multicallClient = mockObject<MulticallClient>({
          multicall: async () => [
            { success: true, data: USDC_TOTAL_SUPPLY_BYTES },
          ],
        })

        const totalSupplyProvider = new TotalSupplyProvider(
          multicallClient,
          ChainId.ARBITRUM,
        )

        const results = await totalSupplyProvider.getTotalSupplies(
          [{ assetId: AssetId.USDC, tokenAddress: EthereumAddress.random() }],
          QUERY_TIMESTAMP,
          1234,
        )

        expect(multicallClient.multicall).toHaveBeenCalledTimes(1)

        expect(results).toEqual([
          {
            timestamp: QUERY_TIMESTAMP,
            totalSupply: USDC_TOTAL_SUPPLY,
            chainId: CHAIN_ID,
            assetId: AssetId.USDC,
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
