import { expect } from 'earljs'

import {
  JsonRpcClient,
  JsonRpcError,
  JsonRpcRequest,
  JsonRpcSuccessResponse,
} from '../../../src/peripherals/jsonrpc'

describe('JsonRpcClient', () => {
  function toSuccess(request: JsonRpcRequest): JsonRpcSuccessResponse {
    return {
      jsonrpc: '2.0',
      id: request.id ?? null,
      result: 'foo',
    }
  }

  it('constructs correct requests', async () => {
    const requests: (JsonRpcRequest | JsonRpcRequest[])[] = []
    class TestClient extends JsonRpcClient {
      async execute(request: JsonRpcRequest | JsonRpcRequest[]) {
        requests.push(request)
        if (Array.isArray(request)) {
          return request.map(toSuccess)
        } else {
          return toSuccess(request)
        }
      }
    }
    const client = new TestClient()

    await client.call('makeBed')
    await client.call('bakeCake', [5, 'big'])
    await client.call('goTo', { x: 1, y: 2 })

    await client.callBatch([
      { method: 'one' },
      { method: 'two', params: [2] },
      { method: 'three', params: { th: 3 } },
    ])

    expect(requests).toEqual([
      { jsonrpc: '2.0', id: 1337, method: 'makeBed' },
      { jsonrpc: '2.0', id: 1338, method: 'bakeCake', params: [5, 'big'] },
      { jsonrpc: '2.0', id: 1339, method: 'goTo', params: { x: 1, y: 2 } },
      [
        { jsonrpc: '2.0', id: 1340, method: 'one' },
        { jsonrpc: '2.0', id: 1341, method: 'two', params: [2] },
        { jsonrpc: '2.0', id: 1342, method: 'three', params: { th: 3 } },
      ],
    ])
  })

  describe('call', () => {
    it('returns result', async () => {
      class TestClient extends JsonRpcClient {
        async execute() {
          return { jsonrpc: '2.0' as const, id: 1337, result: 'foo' }
        }
      }
      const client = new TestClient()
      const result = await client.call('doStuff')
      expect(result).toEqual('foo')
    })

    it('throws for mismatched id', async () => {
      class TestClient extends JsonRpcClient {
        async execute() {
          return { jsonrpc: '2.0' as const, id: -2, result: 'foo' }
        }
      }
      const client = new TestClient()
      await expect(client.call('doStuff')).toBeRejected(
        TypeError,
        'Id mismatched in JSON-RPC response'
      )
    })

    it('throws for array response', async () => {
      class TestClient extends JsonRpcClient {
        async execute() {
          return [{ jsonrpc: '2.0' as const, id: 1337, result: 'foo' }]
        }
      }
      const client = new TestClient()
      await expect(client.call('doStuff')).toBeRejected(
        TypeError,
        'Unexpected array JSON-RPC response'
      )
    })

    it('throws JsonRpcError for rpc errors', async () => {
      class TestClient extends JsonRpcClient {
        async execute() {
          return {
            jsonrpc: '2.0' as const,
            id: 1337,
            error: { code: 1234, message: 'oops', data: { x: 1, y: 2 } },
          }
        }
      }
      const client = new TestClient()
      await expect(client.call('doStuff')).toBeRejected(JsonRpcError, 'oops')
    })
  })

  describe('batch', () => {
    it('returns results', async () => {
      class TestClient extends JsonRpcClient {
        async execute() {
          return [
            { jsonrpc: '2.0' as const, id: 1337, result: 'foo' },
            { jsonrpc: '2.0' as const, id: 1338, result: 'bar' },
          ]
        }
      }
      const client = new TestClient()
      const result = await client.callBatch([
        { method: 'makeBed' },
        { method: 'bakeCake' },
      ])
      expect(result).toEqual([{ result: 'foo' }, { result: 'bar' }])
    })

    it('skips execute when given an empty array', async () => {
      class TestClient extends JsonRpcClient {
        async execute(): Promise<never> {
          throw new Error('Oops')
        }
      }
      const client = new TestClient()
      const result = await client.callBatch([])
      expect(result).toEqual([])
    })

    it('ignores superfluous items results', async () => {
      class TestClient extends JsonRpcClient {
        async execute() {
          return [
            { jsonrpc: '2.0' as const, id: 1337, result: 'foo' },
            { jsonrpc: '2.0' as const, id: 1338, result: 'bar' },
            { jsonrpc: '2.0' as const, id: 2000, result: 'baz' },
          ]
        }
      }
      const client = new TestClient()
      const result = await client.callBatch([
        { method: 'makeBed' },
        { method: 'bakeCake' },
      ])
      expect(result).toEqual([{ result: 'foo' }, { result: 'bar' }])
    })

    it('throws for object response', async () => {
      class TestClient extends JsonRpcClient {
        async execute() {
          return { jsonrpc: '2.0' as const, id: 1337, result: 'foo' }
        }
      }
      const client = new TestClient()
      await expect(
        client.callBatch([{ method: 'makeBed' }, { method: 'bakeCake' }])
      ).toBeRejected(TypeError, 'Unexpected object JSON-RPC response')
    })

    it('handles individual request errors', async () => {
      class TestClient extends JsonRpcClient {
        async execute() {
          return [
            // 1337 missing
            {
              jsonrpc: '2.0' as const,
              id: 1338,
              error: { code: 1234, message: 'Oops', data: { x: 1 } },
            },
            { jsonrpc: '2.0' as const, id: 1339, result: 'baz' },
          ]
        }
      }
      const client = new TestClient()
      const result = await client.callBatch([
        { method: 'makeBed' },
        { method: 'bakeCake' },
        { method: 'goTo' },
      ])

      // We do it this way because chai cannot deep equal errors
      expect(result.length).toEqual(3)
      expect(result[0].result).toEqual(undefined)
      expect(result[0].error).toBeA(Error)
      expect(result[1].result).toEqual(undefined)
      expect(result[1].error).toBeA(JsonRpcError)
      expect(result[2].result).toEqual('baz')
      expect(result[2].error).toEqual(undefined)
    })
  })
})
