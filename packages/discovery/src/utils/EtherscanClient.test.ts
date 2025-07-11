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
})
