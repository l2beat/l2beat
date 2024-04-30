import { expect, mockFn, mockObject } from 'earl'

import { EthereumAddress } from './EthereumAddress'
import { EtherscanLikeClient } from './EtherscanLikeClient'
import { Hash256 } from './Hash256'
import { HttpClient } from './HttpClient'
import { UnixTime } from './UnixTime'

describe(EtherscanLikeClient.name, () => {
  const URL = 'http://example.com'
  const API_KEY = '123'
  const MIN_TIMESTAMP = new UnixTime(123)

  it('ethereum-like creation date', async () => {
    const ADDRESS = EthereumAddress.random()
    const TX_HASH = Hash256.random()
    const response = {
      message: 'OK',
      result: [
        {
          contractAddress: ADDRESS.toString(),
          contractCreator: EthereumAddress.random().toString(),
          txHash: TX_HASH.toString(),
        },
      ],
    }

    const httpClient = mockObject<HttpClient>({
      fetch: mockFn().resolvesToOnce({
        text: mockFn().returnsOnce(JSON.stringify(response)),
        ok: true,
      }),
    })
    const client = new EtherscanLikeClient(
      httpClient,
      URL,
      API_KEY,
      MIN_TIMESTAMP,
    )

    const result = await client.getContractDeploymentTx(ADDRESS)
    expect(result).toEqual(TX_HASH)
  })

  it('base-like creation date', async () => {
    const ADDRESS = EthereumAddress.random()
    const response = {
      message: 'OK',
      result: [
        {
          contractAddress: ADDRESS.toString(),
          contractCreator: 'GENESIS',
          txHash: `GENESIS_0x9827589237982347535834795`,
        },
      ],
    }
    const httpClient = mockObject<HttpClient>({
      fetch: mockFn().resolvesToOnce({
        text: mockFn().returnsOnce(JSON.stringify(response)),
        ok: true,
      }),
    })

    const client = new EtherscanLikeClient(
      httpClient,
      URL,
      API_KEY,
      MIN_TIMESTAMP,
    )

    const result = await client.getContractDeploymentTx(ADDRESS)
    expect(result).toEqual(Hash256.ZERO)
  })
})
