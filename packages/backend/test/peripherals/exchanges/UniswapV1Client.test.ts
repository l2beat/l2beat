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

  it('returns exchange addresses', async () => {
    const multicallClient = mock<MulticallClient>({
      async multicall(requests) {
        const prefix = '06f2bf62000000000000000000000000'
        expect(requests).to.deep.equal([
          {
            address: UNISWAP_V1_FACTORY,
            data: Bytes.fromHex(prefix + DAI.toString().substring(2)),
          },
          {
            address: UNISWAP_V1_FACTORY,
            data: Bytes.fromHex(prefix + MKR.toString().substring(2)),
          },
        ])
        return [
          {
            data: Bytes.fromHex('0'.repeat(24) + 'a'.repeat(40)),
            success: true,
          },
          { data: Bytes.EMPTY, success: false },
        ]
      },
    })
    const uniswapV1Client = new UniswapV1Client(multicallClient)
    const exchangeAddresses = await uniswapV1Client.getExchangeAddresses([
      DAI,
      MKR,
    ])
    expect(exchangeAddresses).to.deep.equal([
      new EthereumAddress('0x' + 'a'.repeat(40)),
      undefined,
    ])
  })
})
