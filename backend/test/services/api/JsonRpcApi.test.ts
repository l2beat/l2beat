import { expect } from 'chai'
import { JsonRpcApi } from '../../../src/api/JsonRpcApi'

describe('JsonRpcApi', () => {
  let response: any = undefined
  class MockApi extends JsonRpcApi {
    constructor() {
      super('')
      this['jsonRequest'] = () => Promise.resolve(response)
    }
  }

  it('returns successful result', async () => {
    const api = new MockApi()
    response = {
      jsonrpc: '2.0',
      id: 1,
      result: 'foo',
    }
    const result = await api.call('x', ['y'])
    expect(result).to.equal('foo')
  })

  it('checks id', async () => {
    const api = new MockApi()
    response = {
      jsonrpc: '2.0',
      id: 2,
      result: 'foo',
    }
    const error: any = await api.call('x', ['y']).catch((x) => x)
    expect(error.message).to.equal('JSON-RPC 2.0 Protocol failure')
  })

  it('disallows both result and error', async () => {
    const api = new MockApi()
    response = {
      jsonrpc: '2.0',
      id: 1,
      result: 'foo',
      error: {
        code: 1,
        message: 'xd',
      },
    }
    const error: any = await api.call('x', ['y']).catch((x) => x)
    expect(error.message).to.equal('JSON-RPC 2.0 Protocol failure')
  })

  it('disallows lack of result or error', async () => {
    const api = new MockApi()
    response = {
      jsonrpc: '2.0',
      id: 1,
    }
    const error: any = await api.call('x', ['y']).catch((x) => x)
    expect(error.message).to.equal('JSON-RPC 2.0 Protocol failure')
  })

  it('disallows malformed data', async () => {
    const api = new MockApi()
    response = {
      foo: 'bar',
    }
    const error: any = await api.call('x', ['y']).catch((x) => x)
    expect(error.message).to.equal('JSON-RPC 2.0 Protocol failure')
  })

  it('throws proper errors', async () => {
    const api = new MockApi()
    response = {
      jsonrpc: '2.0',
      id: 1,
      error: {
        code: 123,
        message: 'xd',
        data: false,
      },
    }
    const error: any = await api.call('x', ['y']).catch((x) => x)
    expect(error.message).to.equal('xd')
    expect(error.code).to.equal(123)
    expect(error.data).to.equal(false)
  })
})
