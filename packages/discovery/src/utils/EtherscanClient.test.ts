import { Logger } from '@l2beat/backend-tools'
import type { HttpClient } from '@l2beat/shared'
import { EthereumAddress, Hash256, UnixTime } from '@l2beat/shared-pure'
import { type InstalledClock, install } from '@sinonjs/fake-timers'
import { expect, mockFn, mockObject } from 'earl'
import { EtherscanClient } from './EtherscanClient'

describe(EtherscanClient.name, () => {
  const logger = Logger.SILENT
  let time: InstalledClock

  beforeEach(() => {
    time = install()
  })

  afterEach(() => {
    time.uninstall()
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

    const httpClient = mockObject<HttpClient>({
      fetch: mockFn().resolvesToOnce(response),
    })
    const client = new EtherscanClient(
      httpClient,
      logger,
      URL,
      API_KEY,
      MIN_TIMESTAMP,
    )

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
          txHash: 'GENESIS_0x9827589237982347535834795',
        },
      ],
    }
    const httpClient = mockObject<HttpClient>({
      fetch: mockFn().resolvesToOnce(response),
    })

    const client = new EtherscanClient(
      httpClient,
      logger,
      URL,
      API_KEY,
      MIN_TIMESTAMP,
    )

    const result = client.getContractDeploymentTx(ADDRESS)
    await time.runAllAsync()
    expect(await result).toEqual(Hash256.ZERO)
  })

  it('no creation record without retrying', async () => {
    const ADDRESS = EthereumAddress.random()
    const response = { status: '0', message: 'No data found', result: null }
    const httpClient = mockObject<HttpClient>({
      fetch: mockFn().resolvesToOnce(response),
    })

    const client = new EtherscanClient(
      httpClient,
      logger,
      URL,
      API_KEY,
      MIN_TIMESTAMP,
    )

    const result = client.getContractDeploymentTx(ADDRESS)
    await time.runAllAsync()
    expect(await result).toEqual(undefined)
    expect(httpClient.fetch).toHaveBeenCalledTimes(1)
  })

  it('retries no data response outside of contract creation', async () => {
    const noDataResponse = {
      status: '0',
      message: 'No data found',
      result: null,
    }
    const response = { message: 'OK', result: '1234' }
    const httpClient = mockObject<HttpClient>({
      fetch: mockFn().resolvesToOnce(noDataResponse).resolvesToOnce(response),
    })

    const client = new EtherscanClient(
      httpClient,
      logger,
      URL,
      API_KEY,
      MIN_TIMESTAMP,
    )

    const result = client.getBlockNumberAtOrBefore(UnixTime(1000))
    await time.runAllAsync()
    expect(await result).toEqual(1234)
    expect(httpClient.fetch).toHaveBeenCalledTimes(2)
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
      fetch: mockFn().resolvesToOnce('randomrandom').resolvesToOnce(response),
    })

    const client = new EtherscanClient(
      httpClient,
      logger,
      URL,
      API_KEY,
      MIN_TIMESTAMP,
    )

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
      fetch: mockFn().resolvesToOnce(nokResponse).resolvesToOnce(response),
    })

    const client = new EtherscanClient(
      httpClient,
      logger,
      URL,
      API_KEY,
      MIN_TIMESTAMP,
    )

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
        .rejectsWithOnce(new Error('error'))
        .resolvesToOnce('randomrandom')
        .resolvesToOnce(nokResponse)
        .resolvesToOnce(response),
    })

    const client = new EtherscanClient(
      httpClient,
      logger,
      URL,
      API_KEY,
      MIN_TIMESTAMP,
    )

    const result = client.getContractDeploymentTx(ADDRESS)
    await time.runAllAsync()
    expect(await result).toEqual(TX_HASH)
  })

  it('does not retry an HTTP 4xx that a retry cannot fix', async () => {
    const error = new Error('HTTP error: 403 Forbidden', {
      cause: { url: URL, status: 403 },
    })
    const httpClient = mockObject<HttpClient>({
      fetch: mockFn().rejectsWith(error),
    })
    const client = new EtherscanClient(
      httpClient,
      logger,
      URL,
      API_KEY,
      MIN_TIMESTAMP,
    )

    const result = client
      .getContractDeploymentTx(EthereumAddress.random())
      .catch((e: unknown) => e)
    await time.runAllAsync()

    expect(await result).toEqual(error)
    expect(httpClient.fetch).toHaveBeenCalledTimes(1)
  })

  it('retries a rate limit reported as NOTOK or as HTTP 429', async () => {
    const httpClient = mockObject<HttpClient>({
      fetch: mockFn()
        .resolvesToOnce({ message: 'NOTOK', result: 'Max rate limit reached' })
        .rejectsWithOnce(
          new Error('HTTP error: 429 Too Many Requests', {
            cause: { url: URL, status: 429 },
          }),
        )
        .resolvesToOnce({ message: 'OK', result: '1234' }),
    })
    const client = new EtherscanClient(
      httpClient,
      logger,
      URL,
      API_KEY,
      MIN_TIMESTAMP,
    )

    const result = client.getBlockNumberAtOrBefore(UnixTime(1000))
    await time.runAllAsync()

    expect(await result).toEqual(1234)
    expect(httpClient.fetch).toHaveBeenCalledTimes(3)
  })

  it('gives up on a failing explorer within the capped waits', async () => {
    const httpClient = mockObject<HttpClient>({
      fetch: mockFn().rejectsWith(new Error('socket hang up')),
    })
    const client = new EtherscanClient(
      httpClient,
      logger,
      URL,
      API_KEY,
      MIN_TIMESTAMP,
    )

    const startedAtMs = Date.now()
    const result = client
      .getContractDeploymentTx(EthereumAddress.random())
      .catch((e: unknown) => e)
    await time.runAllAsync()
    await result

    expect(httpClient.fetch).toHaveBeenCalledTimes(10)
    expect(Date.now() - startedAtMs <= 7 * 60_000).toEqual(true)
  })
})
