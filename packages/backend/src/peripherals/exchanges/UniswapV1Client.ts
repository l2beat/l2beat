import { utils } from 'ethers'

import { Bytes, EthereumAddress } from '../../model'
import { MulticallClient, MulticallRequest } from '../ethereum/MulticallClient'

export const UNISWAP_V1_FACTORY = new EthereumAddress(
  '0xc0a47dFe034B400B47bDaD5FecDa2621de6c4d95'
)

const abi = new utils.Interface([
  'function getExchange(address token) view returns (address)',
])

export class UniswapV1Client {
  // maps token addresses to exchange addresses or latest checked block
  private cache = new Map<string, EthereumAddress | bigint>()

  constructor(private multicallClient: MulticallClient) {}

  async getExchangeAddresses(tokens: EthereumAddress[], blockNumber: bigint) {
    const unknown = tokens.filter((x) => !this.isCached(x, blockNumber))

    const requests: MulticallRequest[] = unknown.map((address) => {
      const encoded = abi.encodeFunctionData('getExchange', [
        address.toString(),
      ])
      return {
        address: UNISWAP_V1_FACTORY,
        data: Bytes.fromHex(encoded),
      }
    })
    const responses = await this.multicallClient.multicall(
      requests,
      blockNumber
    )
    for (const [i, response] of responses.entries()) {
      const token = unknown[i]
      if (!response.success) {
        this.setCached(token, undefined, blockNumber)
      } else {
        const decoded = abi.decodeFunctionResult(
          'getExchange',
          response.data.toString()
        )
        const exchange = new EthereumAddress(decoded[0])
        if (exchange.equals(EthereumAddress.ZERO)) {
          this.setCached(token, undefined, blockNumber)
        } else {
          this.setCached(token, exchange, blockNumber)
        }
      }
    }

    return tokens.map((x) => this.getCached(x))
  }

  private isCached(token: EthereumAddress, blockNumber: bigint) {
    const cached = this.cache.get(token.toString())
    return (
      cached !== undefined &&
      (typeof cached !== 'bigint' || cached >= blockNumber)
    )
  }

  private getCached(token: EthereumAddress) {
    const cached = this.cache.get(token.toString())
    if (cached instanceof EthereumAddress) {
      return cached
    }
  }

  private setCached(
    token: EthereumAddress,
    exchange: EthereumAddress | undefined,
    blockNumber: bigint
  ) {
    if (exchange) {
      this.cache.set(token.toString(), exchange)
    } else {
      const cached = this.cache.get(token.toString())
      if (cached === undefined) {
        this.cache.set(token.toString(), blockNumber)
      } else if (typeof cached === 'bigint') {
        if (cached < blockNumber) {
          this.cache.set(token.toString(), blockNumber)
        }
      }
    }
  }
}
