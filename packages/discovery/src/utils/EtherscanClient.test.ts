import { EthereumAddress, Hash256, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'

import { InstalledClock, install } from '@sinonjs/fake-timers'
import { EtherscanClient } from './EtherscanClient'
import { HttpClient } from './HttpClient'

describe(EtherscanClient.name, () => {
  let time: InstalledClock

  beforeEach(() => {
    time = install()
  })

  afterEach(() => {
    time.uninstall()
  })

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
    const client = new EtherscanClient(httpClient, URL, API_KEY, MIN_TIMESTAMP)

    const result = client.getContractDeploymentTx(ADDRESS)
    await time.runAllAsync()
    expect(await result).toEqual(TX_HASH)
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

    const client = new EtherscanClient(httpClient, URL, API_KEY, MIN_TIMESTAMP)

    const result = client.getContractDeploymentTx(ADDRESS)
    await time.runAllAsync()
    expect(await result).toEqual(Hash256.ZERO)
  })

  it('retries when no http answer', async () => {
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
      fetch: mockFn()
        .resolvesToOnce({
          error: new Error('no answer'),
        })
        .resolvesToOnce({
          text: mockFn().returnsOnce(JSON.stringify(response)),
          ok: true,
        }),
    })

    const client = new EtherscanClient(httpClient, URL, API_KEY, MIN_TIMESTAMP)

    const result = client.getContractDeploymentTx(ADDRESS)
    await time.runAllAsync()
    expect(await result).toEqual(TX_HASH)
  })

  it('retries when etherscan timeout', async () => {
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
      fetch: mockFn()
        .resolvesToOnce({
          text: mockFn().returnsOnce(''),
          ok: false,
          status: 408,
        })
        .resolvesToOnce({
          text: mockFn().returnsOnce(JSON.stringify(response)),
          ok: true,
        }),
    })

    const client = new EtherscanClient(httpClient, URL, API_KEY, MIN_TIMESTAMP)

    const result = client.getContractDeploymentTx(ADDRESS)
    await time.runAllAsync()
    expect(await result).toEqual(TX_HASH)
  })

  it('retries when etherscan response is unparseable', async () => {
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
      fetch: mockFn()
        .resolvesToOnce({
          text: mockFn().returnsOnce('randomrandom'),
          ok: true,
        })
        .resolvesToOnce({
          text: mockFn().returnsOnce(JSON.stringify(response)),
          ok: true,
        }),
    })

    const client = new EtherscanClient(httpClient, URL, API_KEY, MIN_TIMESTAMP)

    const result = client.getContractDeploymentTx(ADDRESS)
    await time.runAllAsync()
    expect(await result).toEqual(TX_HASH)
  })

  it('retries when etherscan response is NOK', async () => {
    const ADDRESS = EthereumAddress.random()
    const TX_HASH = Hash256.random()
    const nokResponse = { message: 'NOK' }
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
      fetch: mockFn()
        .resolvesToOnce({
          text: mockFn().returnsOnce(JSON.stringify(nokResponse)),
          ok: true,
        })
        .resolvesToOnce({
          text: mockFn().returnsOnce(JSON.stringify(response)),
          ok: true,
        }),
    })

    const client = new EtherscanClient(httpClient, URL, API_KEY, MIN_TIMESTAMP)

    const result = client.getContractDeploymentTx(ADDRESS)
    await time.runAllAsync()
    expect(await result).toEqual(TX_HASH)
  })

  it('retries when etherscan has all the issues', async () => {
    const ADDRESS = EthereumAddress.random()
    const TX_HASH = Hash256.random()
    const nokResponse = { message: 'NOK' }
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
      fetch: mockFn()
        .resolvesToOnce({
          error: new Error('no answer'),
        })
        .resolvesToOnce({
          text: mockFn().returnsOnce(''),
          ok: false,
          status: 408,
        })
        .resolvesToOnce({
          text: mockFn().returnsOnce('randomrandom'),
          ok: true,
        })
        .resolvesToOnce({
          text: mockFn().returnsOnce(JSON.stringify(nokResponse)),
          ok: true,
        })
        .resolvesToOnce({
          text: mockFn().returnsOnce(JSON.stringify(response)),
          ok: true,
        }),
    })

    const client = new EtherscanClient(httpClient, URL, API_KEY, MIN_TIMESTAMP)

    const result = client.getContractDeploymentTx(ADDRESS)
    await time.runAllAsync()
    expect(await result).toEqual(TX_HASH)
  })
})
