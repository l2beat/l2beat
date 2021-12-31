import { expect } from 'earljs'
import { Response } from 'node-fetch'

import { HttpClient } from '../../../src/peripherals/HttpClient'
import {
  JsonRpcError,
  JsonRpcHttpClient,
} from '../../../src/peripherals/jsonrpc'
import { Logger } from '../../../src/tools/Logger'
import { mock } from '../../mock'

describe('JsonRpcHttpClient', () => {
  it('correctly sets up a request', async () => {
    const httpClient = mock<HttpClient>({
      async fetch(url, init) {
        expect(url).toEqual('https://jsonrpc.test.url')
        expect(init?.method).toEqual('POST')
        expect(init?.headers).toEqual({
          'Content-Type': 'application/json',
        })
        return new Response(
          JSON.stringify({ jsonrpc: '2.0', id: 1337, result: 'ok' })
        )
      },
    })
    const client = new JsonRpcHttpClient(
      'https://jsonrpc.test.url',
      httpClient,
      Logger.SILENT
    )
    await client.call('foo')
  })

  it('correctly handles the response', async () => {
    const httpClient = mock<HttpClient>({
      async fetch() {
        return new Response(
          JSON.stringify({ jsonrpc: '2.0', id: 1337, result: 'ok' })
        )
      },
    })
    const client = new JsonRpcHttpClient(
      'https://jsonrpc.test.url',
      httpClient,
      Logger.SILENT
    )
    const result = await client.call('foo')
    expect(result).toEqual('ok')
  })

  it('throws for non-json response', async () => {
    const httpClient = mock<HttpClient>({
      async fetch() {
        return new Response('blah')
      },
    })
    const client = new JsonRpcHttpClient(
      'https://jsonrpc.test.url',
      httpClient,
      Logger.SILENT
    )
    await expect(client.call('foo')).toBeRejected(
      TypeError,
      'Invalid JSON-RPC response.'
    )
  })

  it('throws for non-2XX response', async () => {
    const httpClient = mock<HttpClient>({
      async fetch() {
        return new Response('foobar', { status: 400 })
      },
    })
    const client = new JsonRpcHttpClient(
      'https://jsonrpc.test.url',
      httpClient,
      Logger.SILENT
    )
    await expect(client.call('foo')).toBeRejected(
      Error,
      'Http error 400: foobar'
    )
  })

  it('throws JsonRpcError for JSON-RPC error response', async () => {
    const httpClient = mock<HttpClient>({
      async fetch() {
        return new Response(
          JSON.stringify({
            jsonrpc: '2.0',
            id: 1337,
            error: { code: 1234, message: 'boo' },
          }),
          { status: 400 }
        )
      },
    })
    const client = new JsonRpcHttpClient(
      'https://jsonrpc.test.url',
      httpClient,
      Logger.SILENT
    )
    await expect(client.call('foo')).toBeRejected(JsonRpcError)
  })
})
