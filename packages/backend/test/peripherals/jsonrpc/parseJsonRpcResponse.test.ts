import { expect } from 'chai'

import { parseJsonRpcResponse } from '../../../src/peripherals/jsonrpc/parseJsonRpcResponse'

describe('parseJsonRpcResponse', () => {
  const testCases = [
    {
      name: 'valid success response',
      value: {
        jsonrpc: '2.0',
        id: 1,
        result: 'foo',
      },
    },
    {
      name: 'valid success response structured result',
      value: {
        jsonrpc: '2.0',
        id: 1,
        result: ['foo', { x: 1 }],
      },
    },
    {
      name: 'valid error response',
      value: {
        jsonrpc: '2.0',
        id: 1,
        error: {
          code: -32700,
          message: 'Parse error',
        },
      },
    },
    {
      name: 'valid error response with data',
      value: {
        jsonrpc: '2.0',
        id: 1,
        error: {
          code: -32700,
          message: 'Parse error',
          data: { line: 3, unexpected: '[' },
        },
      },
    },
    {
      name: 'valid success response string id',
      value: {
        jsonrpc: '2.0',
        id: 'string',
        result: 'foo',
      },
    },
    {
      name: 'valid success response null id',
      value: {
        jsonrpc: '2.0',
        id: null,
        result: 'foo',
      },
    },
    {
      name: 'invalid response jsonrpc value not 2.0',
      value: {
        jsonrpc: '2.1',
        id: 1,
        result: 'foo',
      },
    },
    {
      name: 'invalid response jsonrpc missing',
      value: {
        id: 1,
        result: 'foo',
      },
    },
    {
      name: 'invalid response invalid id type',
      value: {
        jsonrpc: '2.0',
        id: true,
        result: 'foo',
      },
    },
    {
      name: 'invalid response id missing',
      value: {
        jsonrpc: '2.0',
        result: 'foo',
      },
    },
    {
      name: 'invalid response result and error missing',
      value: {
        jsonrpc: '2.0',
        id: 1,
      },
    },
    {
      name: 'invalid response result and error present',
      value: {
        jsonrpc: '2.0',
        id: 1,
        result: 'foo',
        error: {
          code: -32700,
          message: 'Parse error',
        },
      },
    },
    {
      name: 'invalid response error code not integer',
      value: {
        jsonrpc: '2.0',
        id: 1,
        error: {
          code: 32.5,
          message: 'Parse error',
        },
      },
    },
    {
      name: 'invalid response error code missing',
      value: {
        jsonrpc: '2.0',
        id: 1,
        error: {
          message: 'Parse error',
        },
      },
    },
    {
      name: 'invalid response error message not string',
      value: {
        jsonrpc: '2.0',
        id: 1,
        error: {
          code: -32700,
          message: 2,
        },
      },
    },
    {
      name: 'invalid response error message missing',
      value: {
        jsonrpc: '2.0',
        id: 1,
        error: {
          code: -32700,
        },
      },
    },
    {
      name: 'valid multiple responses',
      value: [
        {
          jsonrpc: '2.0',
          id: 1,
          result: 'foo',
        },
        {
          jsonrpc: '2.0',
          id: 2,
          error: {
            code: -32700,
            message: 'Parse error',
          },
        },
      ],
    },
    {
      name: 'invalid one of multiple responses',
      value: [
        {
          jsonrpc: '2.0',
          id: 1,
          result: 'foo',
        },
        {
          foo: 'bar',
        },
      ],
    },
    {
      name: 'invalid empty array response',
      value: [],
    },
  ]

  it('rejects invalid json strings', () => {
    expect(() => parseJsonRpcResponse('not json')).to.throw(
      TypeError,
      'Invalid JSON-RPC response'
    )
  })

  for (const testCase of testCases) {
    it(testCase.name, () => {
      const str = JSON.stringify(testCase.value)
      if (testCase.name.startsWith('valid')) {
        const parsed = parseJsonRpcResponse(str)
        expect(parsed).to.deep.equal(testCase.value)
      } else {
        expect(() => parseJsonRpcResponse(str)).to.throw(
          TypeError,
          'Invalid JSON-RPC response'
        )
      }
    })
  }
})
