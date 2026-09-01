import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { Response } from 'node-fetch'
import type { HttpClient } from '../../clients'
import { BlockscoutV2Client } from './BlockscoutV2Client'

const API_URL = 'https://example.com/api'
const NOW = UnixTime.now()

const responseMock = {
  items: [
    {
      block_number: 19917670,
      block_index: 260,
      created_contract: null,
      error: null,
      from: {
        ens_domain_name: null,
        hash: '0x32400084C286CF3E17e7B677ea9583e60a000324',
        implementation_name: null,
        is_contract: true,
        is_verified: true,
        metadata: null,
        name: 'DiamondProxy',
        private_tags: [],
        public_tags: [],
        watchlist_names: [],
      },
      gas_limit: '7538928',
      index: 3,
      success: true,
      timestamp: UnixTime.toDate(NOW).toISOString(),
      to: {
        ens_domain_name: null,
        hash: '0xdd9C826196cf3510B040A8784D85aE36674c7Ed2',
        implementation_name: null,
        is_contract: true,
        is_verified: false,
        metadata: null,
        name: null,
        private_tags: [],
        public_tags: [],
        watchlist_names: [],
      },
      transaction_hash:
        '0xaaa36103d52aa63e3699069672e6b3abc495a19c64e07ada3d07a820506c3c93',
      type: 'staticcall',
      value: '0',
    },
  ],
  next_page_params: {
    block_number: 19915826,
    index: 3,
    items_count: 50,
    transaction_index: 170,
  },
}

describe(BlockscoutV2Client.name, () => {
  describe(BlockscoutV2Client.prototype.call.name, () => {
    it('constructs a correct url', async () => {
      const httpClient = mockObject<HttpClient>({
        fetch: mockFn().resolvesTo({ status: '1', message: 'OK' }),
      })

      const blockscoutClient = new BlockscoutV2Client(httpClient, API_URL)
      await blockscoutClient.call('mod', 'id', 'act', {
        foo: 'bar',
        baz: '123',
      })

      expect(httpClient.fetch).toHaveBeenCalledWith(
        'https://example.com/api/mod/id/act?foo=bar&baz=123',
        { timeout: 10000 },
      )
    })

    it('returns a success response', async () => {
      const httpClient = mockObject<HttpClient>({
        fetch: async () => responseMock,
      })

      const blockscoutClient = new BlockscoutV2Client(httpClient, API_URL)
      const result = await blockscoutClient.call('mod', 'id', 'act')
      expect(result).toEqual(responseMock)
    })
  })

  describe(BlockscoutV2Client.prototype.getInternalTransactions.name, () => {
    it('correctly parser api response', async () => {
      const address = EthereumAddress.random()
      const callMock = mockFn().resolvesTo(responseMock)
      const blockscoutClient = new BlockscoutV2Client(
        mockObject<HttpClient>(),
        API_URL,
      )
      blockscoutClient.call = callMock

      const result = await blockscoutClient.getInternalTransactions(address)

      expect(callMock).toHaveBeenCalledWith(
        'addresses',
        address.toString(),
        'internal-transactions',
      )

      expect(result).toEqual([{ ...responseMock.items[0], timestamp: NOW }])
    })

    it('throws if schema is not correct', async () => {
      const address = EthereumAddress.random()
      const callMock = mockFn().resolvesTo({})
      const blockscoutClient = new BlockscoutV2Client(
        mockObject<HttpClient>(),
        API_URL,
      )
      blockscoutClient.call = callMock

      await expect(() =>
        blockscoutClient.getInternalTransactions(address),
      ).toBeRejectedWith('At .items: Expected array, got undefined.')
    })
  })

  describe(BlockscoutV2Client.prototype.getSmartContract.name, () => {
    it('fetches and parses smart contract metadata', async () => {
      const address = EthereumAddress.random()
      const response = {
        is_verified: true,
        name: 'Example',
        source_code: 'contract Example {}',
        file_path: 'Example.sol',
        optimization_runs: null,
      }
      const httpClient = mockObject<HttpClient>({
        fetchRaw: mockFn().resolvesTo(
          new Response(JSON.stringify(response), { status: 200 }),
        ),
      })
      const blockscoutClient = new BlockscoutV2Client(httpClient, API_URL)

      const result = await blockscoutClient.getSmartContract(address)

      expect(httpClient.fetchRaw).toHaveBeenCalledWith(
        `${API_URL}/smart-contracts/${address.toString()}`,
        { timeout: 10000 },
      )
      expect(result).toEqual(response)
    })

    it('returns undefined for a contract without source metadata', async () => {
      const httpClient = mockObject<HttpClient>({
        fetchRaw: mockFn().resolvesTo(new Response('', { status: 404 })),
      })
      const blockscoutClient = new BlockscoutV2Client(httpClient, API_URL)

      const result = await blockscoutClient.getSmartContract(
        EthereumAddress.random(),
      )

      expect(result).toEqual(undefined)
    })

    it('throws on an upstream error', async () => {
      const httpClient = mockObject<HttpClient>({
        fetchRaw: mockFn().resolvesTo(
          new Response('', { status: 500, statusText: 'Internal Error' }),
        ),
      })
      const blockscoutClient = new BlockscoutV2Client(httpClient, API_URL)

      await expect(
        blockscoutClient.getSmartContract(EthereumAddress.random()),
      ).toBeRejectedWith('HTTP error: 500 Internal Error')
    })
  })

  describe(BlockscoutV2Client.prototype.getAddress.name, () => {
    it('fetches and parses address information', async () => {
      const address = EthereumAddress.random()
      const creationTransactionHash =
        '0x8ee5e5adb4dafb1a30a367c780f7db156f933c8d453efb7736c6a0be22ce5ac1'
      const callMock = mockFn().resolvesTo({
        hash: address.toString(),
        creation_transaction_hash: creationTransactionHash,
      })
      const client = new BlockscoutV2Client(mockObject<HttpClient>(), API_URL)
      client.call = callMock

      const result = await client.getAddress(address)

      expect(callMock).toHaveBeenCalledWith('addresses', address.toString())
      expect(result).toEqual({
        creation_transaction_hash: creationTransactionHash,
      })
    })
  })
})
