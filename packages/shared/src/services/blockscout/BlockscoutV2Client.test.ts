import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { Response } from 'node-fetch'
import { HttpClient } from '../HttpClient'
import { BlockscoutV2Client } from './BlockscoutV2Client'

const API_URL = 'https://example.com/api'
const NOW = UnixTime.now()

const responseMock = {
  items: [
    {
      block: 19917670,
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
      timestamp: NOW.toDate().toISOString(),
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
        fetch: mockFn().resolvesTo(
          new Response(JSON.stringify({ status: '1', message: 'OK' })),
        ),
      })

      const blockscoutClient = new BlockscoutV2Client(httpClient, API_URL)
      await blockscoutClient.call('mod', 'id', 'act', {
        foo: 'bar',
        baz: '123',
      })

      expect(httpClient.fetch).toHaveBeenCalledWith(
        'https://example.com/api/mod/id/act?foo=bar&baz=123',
        { timeout: 20000 },
      )
    })

    it('throws on non-2XX result', async () => {
      const httpClient = mockObject<HttpClient>({
        async fetch() {
          return new Response('', { status: 404 })
        },
      })

      const blockscoutClient = new BlockscoutV2Client(httpClient, API_URL)
      await expect(blockscoutClient.call('mod', 'id', 'act')).toBeRejectedWith(
        'Server responded with non-2XX result: 404 Not Found',
      )
    })

    it('throws on non-json response', async () => {
      const httpClient = mockObject<HttpClient>({
        async fetch() {
          return new Response('mytestresp')
        },
      })

      const blockscoutClient = new BlockscoutV2Client(httpClient, API_URL)
      await expect(blockscoutClient.call('mod', 'id', 'act')).toBeRejectedWith(
        `Unexpected token m in JSON at position 0`,
      )
    })

    it('returns a success response', async () => {
      const httpClient = mockObject<HttpClient>({
        async fetch() {
          return new Response(JSON.stringify(responseMock))
        },
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
      ).toBeRejectedWith(
        '[\n  {\n    "code": "invalid_type",\n    "expected": "array",\n    "received": "undefined",\n    "path": [\n      "items"\n    ],\n    "message": "Required"\n  },\n  {\n    "code": "invalid_type",\n    "expected": "object",\n    "received": "undefined",\n    "path": [\n      "next_page_params"\n    ],\n    "message": "Required"\n  }\n]',
      )
    })
  })
})
