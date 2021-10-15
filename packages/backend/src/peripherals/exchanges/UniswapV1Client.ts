import { utils } from 'ethers'

import { Bytes, EthereumAddress } from '../../model'
import { MulticallClient, MulticallRequest } from '../ethereum/MulticallClient'

export const UNISWAP_V1_FACTORY = new EthereumAddress(
  '0xc0a47dFe034B400B47bDaD5FecDa2621de6c4d95'
)

export const UNISWAP_V1_SNAPSHOT_BLOCK = 12_500_000n

const abi = new utils.Interface([
  'function getExchange(address token) view returns (address)',
])

export class UniswapV1Client {
  constructor(private multicallClient: MulticallClient) {}

  async getExchangeAddresses(tokens: EthereumAddress[]) {
    const requests: MulticallRequest[] = tokens.map((address) => {
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
      UNISWAP_V1_SNAPSHOT_BLOCK
    )
    return responses.map((response) => {
      if (!response.success) {
        return
      }
      const decoded = abi.decodeFunctionResult(
        'getExchange',
        response.data.toString()
      )
      return new EthereumAddress(decoded[0])
    })
  }
}
