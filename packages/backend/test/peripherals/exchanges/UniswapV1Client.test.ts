import { expect } from 'earljs'

import { Bytes, EthereumAddress } from '../../../src/model'
import { MulticallClient } from '../../../src/peripherals/ethereum/MulticallClient'
import { DAI, WETH } from '../../../src/peripherals/exchanges/queries/constants'
import {
  UNISWAP_V1_FACTORY,
  UniswapV1Client,
} from '../../../src/peripherals/exchanges/UniswapV1Client'
import { mock } from '../../mock'

describe(UniswapV1Client.name, () => {
  const toRequest = (address: EthereumAddress) => ({
    address: UNISWAP_V1_FACTORY,
    data: Bytes.fromHex(
      '06f2bf62000000000000000000000000' + address.toString().substring(2)
    ),
  })

  const toResponse = (address: EthereumAddress) => ({
    data: Bytes.fromHex('0'.repeat(24) + address.toString().substring(2)),
    success: true,
  })

  it('returns exchange addresses', async () => {
    const multicallClient = mock<MulticallClient>({
      async multicall(requests, blockNumber) {
        expect(requests).toEqual([toRequest(DAI), toRequest(WETH)])
        expect(blockNumber).toEqual(12345n)
        return [
          toResponse(EthereumAddress('0x' + 'a'.repeat(40))),
          toResponse(EthereumAddress.ZERO),
        ]
      },
    })
    const uniswapV1Client = new UniswapV1Client(multicallClient)
    const exchangeAddresses = await uniswapV1Client.getExchangeAddresses(
      [DAI, WETH],
      12345n
    )
    expect(exchangeAddresses).toEqual([
      EthereumAddress('0x' + 'a'.repeat(40)),
      undefined,
    ])
  })

  it('has a built in cache', async () => {
    const multicallClient = mock<MulticallClient>()
    const uniswapV1Client = new UniswapV1Client(multicallClient)

    multicallClient.multicall = async (requests) => {
      // Nothing in cache
      expect(requests).toEqual([toRequest(DAI), toRequest(WETH)])
      return [
        toResponse(EthereumAddress('0x' + 'a'.repeat(40))),
        toResponse(EthereumAddress.ZERO),
      ]
    }
    await uniswapV1Client.getExchangeAddresses([DAI, WETH], 12345n)

    multicallClient.multicall = async (requests) => {
      // Lower block number - both in cache
      expect(requests).toEqual([])
      return []
    }
    await uniswapV1Client.getExchangeAddresses([DAI, WETH], 10000n)

    multicallClient.multicall = async (requests) => {
      // Higher block number - only DAI cached
      expect(requests).toEqual([toRequest(WETH)])
      return [toResponse(EthereumAddress('0x' + 'b'.repeat(40)))]
    }
    const result = await uniswapV1Client.getExchangeAddresses(
      [DAI, WETH],
      20000n
    )

    expect(result).toEqual([
      EthereumAddress('0x' + 'a'.repeat(40)),
      EthereumAddress('0x' + 'b'.repeat(40)),
    ])
  })
})
