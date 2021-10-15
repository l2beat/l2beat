import { expect } from 'chai'

import { Bytes, EthereumAddress } from '../../../src/model'
import { MulticallClient } from '../../../src/peripherals/ethereum/MulticallClient'
import {
  UNISWAP_V1_FACTORY,
  UniswapV1Client,
} from '../../../src/peripherals/exchanges/UniswapV1Client'
import { mock } from '../../mock'

describe('UniswapV1Client', () => {
  const DAI = new EthereumAddress('0x6B175474E89094C44Da98b954EedeAC495271d0F')
  const MKR = new EthereumAddress('0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2')

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
        expect(requests).to.deep.equal([toRequest(DAI), toRequest(MKR)])
        expect(blockNumber).to.equal(12345n)
        return [
          toResponse(new EthereumAddress('0x' + 'a'.repeat(40))),
          toResponse(EthereumAddress.ZERO),
        ]
      },
    })
    const uniswapV1Client = new UniswapV1Client(multicallClient)
    const exchangeAddresses = await uniswapV1Client.getExchangeAddresses(
      [DAI, MKR],
      12345n
    )
    expect(exchangeAddresses).to.deep.equal([
      new EthereumAddress('0x' + 'a'.repeat(40)),
      undefined,
    ])
  })

  it('has a built in cache', async () => {
    const multicallClient = mock<MulticallClient>()
    const uniswapV1Client = new UniswapV1Client(multicallClient)

    multicallClient.multicall = async (requests) => {
      // Nothing in cache
      expect(requests).to.deep.equal([toRequest(DAI), toRequest(MKR)])
      return [
        toResponse(new EthereumAddress('0x' + 'a'.repeat(40))),
        toResponse(EthereumAddress.ZERO),
      ]
    }
    await uniswapV1Client.getExchangeAddresses([DAI, MKR], 12345n)

    multicallClient.multicall = async (requests) => {
      // Lower block number - both in cache
      expect(requests).to.deep.equal([])
      return []
    }
    await uniswapV1Client.getExchangeAddresses([DAI, MKR], 10000n)

    multicallClient.multicall = async (requests) => {
      // Higher block number - only DAI cached
      expect(requests).to.deep.equal([toRequest(MKR)])
      return [toResponse(new EthereumAddress('0x' + 'b'.repeat(40)))]
    }
    const result = await uniswapV1Client.getExchangeAddresses(
      [DAI, MKR],
      20000n
    )

    expect(result).to.deep.equal([
      new EthereumAddress('0x' + 'a'.repeat(40)),
      new EthereumAddress('0x' + 'b'.repeat(40)),
    ])
  })
})
