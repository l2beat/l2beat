import { Logger } from '@l2beat/backend-tools'
import type { HttpClient } from '@l2beat/shared'
import { EthereumAddress, Hash256, UnixTime } from '@l2beat/shared-pure'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { EtherscanClient } from './EtherscanClient'

describe(EtherscanClient.name, () => {
  const logger = Logger.SILENT

  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  const URL = 'http://example.com'
  const API_KEY = '123'
  const MIN_TIMESTAMP = UnixTime(123)

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

    const httpClient = {
      fetch: vi.fn().mockResolvedValueOnce(response),
    } as unknown as HttpClient
    const client = new EtherscanClient(
      httpClient,
      logger,
      URL,
      API_KEY,
      MIN_TIMESTAMP,
    )

    const result = client.getContractDeploymentTx(ADDRESS)
    await vi.runAllTimersAsync()
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
          txHash: 'GENESIS_0x9827589237982347535834795',
        },
      ],
    }
    const httpClient = {
      fetch: vi.fn().mockResolvedValueOnce(response),
    } as unknown as HttpClient

    const client = new EtherscanClient(
      httpClient,
      logger,
      URL,
      API_KEY,
      MIN_TIMESTAMP,
    )

    const result = client.getContractDeploymentTx(ADDRESS)
    await vi.runAllTimersAsync()
    expect(await result).toEqual(Hash256.ZERO)
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

    const httpClient = {
      fetch: vi
        .fn()
        .mockResolvedValueOnce('randomrandom')
        .mockResolvedValueOnce(response),
    } as unknown as HttpClient

    const client = new EtherscanClient(
      httpClient,
      logger,
      URL,
      API_KEY,
      MIN_TIMESTAMP,
    )

    const result = client.getContractDeploymentTx(ADDRESS)
    await vi.runAllTimersAsync()
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

    const httpClient = {
      fetch: vi
        .fn()
        .mockResolvedValueOnce(nokResponse)
        .mockResolvedValueOnce(response),
    } as unknown as HttpClient

    const client = new EtherscanClient(
      httpClient,
      logger,
      URL,
      API_KEY,
      MIN_TIMESTAMP,
    )

    const result = client.getContractDeploymentTx(ADDRESS)
    await vi.runAllTimersAsync()
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

    const httpClient = {
      fetch: vi
        .fn()
        .mockRejectedValueOnce(new Error('error'))
        .mockResolvedValueOnce('randomrandom')
        .mockResolvedValueOnce(nokResponse)
        .mockResolvedValueOnce(response),
    } as unknown as HttpClient

    const client = new EtherscanClient(
      httpClient,
      logger,
      URL,
      API_KEY,
      MIN_TIMESTAMP,
    )

    const result = client.getContractDeploymentTx(ADDRESS)
    await vi.runAllTimersAsync()
    expect(await result).toEqual(TX_HASH)
  })
})
