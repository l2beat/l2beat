import { expect } from 'chai'

import {
  JsonRpcClient,
  JsonRpcError,
} from '../../../src/services/jsonrpc/JsonRpcClient'
import {
  JsonRpcRequest,
  JsonRpcSuccessResponse,
} from '../../../src/services/jsonrpc/types'

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
    async function execute(request: JsonRpcRequest | JsonRpcRequest[]) {
      requests.push(request)
      if (Array.isArray(request)) {
        return request.map(toSuccess)
      } else {
        return toSuccess(request)
      }
    }
    const client = new JsonRpcClient(execute)

    await client.call('makeBed')
    await client.call('bakeCake', [5, 'big'])
    await client.call('goTo', { x: 1, y: 2 })

    await client.callBatch([
      { method: 'one' },
      { method: 'two', params: [2] },
      { method: 'three', params: { th: 3 } },
    ])

    expect(requests).to.deep.equal([
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
      const client = new JsonRpcClient(async () => {
        return { jsonrpc: '2.0', id: 1337, result: 'foo' }
      })
      const result = await client.call('doStuff')
      expect(result).to.equal('foo')
    })

    it('throws for malformed response', async () => {
      const client = new JsonRpcClient(async () => {
        return { foo: 'bar' }
      })
      await expect(client.call('doStuff')).to.be.rejectedWith(
        TypeError,
        'Invalid JSON-RPC response'
      )
    })

    it('throws for mismatched id', async () => {
      const client = new JsonRpcClient(async () => {
        return { jsonrpc: '2.0', id: -2, result: 'foo' }
      })
      await expect(client.call('doStuff')).to.be.rejectedWith(
        TypeError,
        'Id mismatched in JSON-RPC response'
      )
    })

    it('throws for array response', async () => {
      const client = new JsonRpcClient(async () => {
        return [{ jsonrpc: '2.0', id: 1337, result: 'foo' }]
      })
      await expect(client.call('doStuff')).to.be.rejectedWith(
        TypeError,
        'Unexpected array JSON-RPC response'
      )
    })

    it('throws JsonRpcError for rpc errors', async () => {
      const client = new JsonRpcClient(async () => {
        return {
          jsonrpc: '2.0',
          id: 1337,
          error: { code: 1234, message: 'oops', data: { x: 1, y: 2 } },
        }
      })
      await expect(client.call('doStuff')).to.be.rejectedWith(
        JsonRpcError,
        'oops'
      )
    })
  })
})
