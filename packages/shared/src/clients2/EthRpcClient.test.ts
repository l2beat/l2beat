import { EthereumAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { EthRpcClient } from './EthRpcClient'
import { MockHttp } from './Http'

describe(EthRpcClient.name, () => {
  it('correctly calls an endpoint', async () => {
    const http = new MockHttp()
    const client = new EthRpcClient(http, 'https://rpc.url', () => 1337)
    http.queueResponse(
      200,
      JSON.stringify({ jsonrpc: '2.0', id: 1337, result: '0x1234' }),
    )
    const address = EthereumAddress.random()
    const result = await client.getBalance(address, 0x9999n)
    expect(result).toEqual(0x1234n)
    expect(http.lastFetch?.init.body).toEqual(
      JSON.stringify({
        jsonrpc: '2.0',
        id: 1337,
        method: 'eth_getBalance',
        params: [address, '0x9999'],
      }),
    )
  })

  it('handles a http error response', async () => {
    const http = new MockHttp()
    const client = new EthRpcClient(http, 'https://rpc.url', () => 1337)
    http.queueResponse(503, 'Oops, our server is down')
    await expect(client.blockNumber()).toBeRejectedWith(
      'RPC call failed. HTTP status: 503, body: Oops, our server is down',
    )
  })

  it('handles a jsonrpc error response', async () => {
    const http = new MockHttp()
    const client = new EthRpcClient(http, 'https://rpc.url', () => 1337)
    http.queueResponse(
      200,
      JSON.stringify({
        jsonrpc: '2.0',
        id: 1337,
        error: { code: -32000, message: 'Server error' },
      }),
    )
    await expect(client.blockNumber()).toBeRejectedWith(
      'RPC call failed. RPC code: -32000, message: Server error',
    )
  })

  it('eth_call success', async () => {
    const http = new MockHttp()
    const client = new EthRpcClient(http, 'https://rpc.url', () => 1337)
    http.queueResponse(
      200,
      JSON.stringify({ jsonrpc: '2.0', id: 1337, result: '0x1234' }),
    )
    const result = await client.call(
      { to: EthereumAddress.random(), input: '0xdeadbeef' },
      'latest',
    )
    expect(result).toEqual({ reverted: false, data: '0x1234' })
  })

  it('eth_call revert #1', async () => {
    const http = new MockHttp()
    const client = new EthRpcClient(http, 'https://rpc.url', () => 1337)
    http.queueResponse(
      200,
      JSON.stringify({
        jsonrpc: '2.0',
        id: 1337,
        error: { code: 3, message: 'execution reverted' },
      }),
    )
    const result = await client.call(
      { to: EthereumAddress.random(), input: '0xdeadbeef' },
      'latest',
    )
    expect(result).toEqual({ reverted: true })
  })

  it('eth_call revert #2', async () => {
    const http = new MockHttp()
    const client = new EthRpcClient(http, 'https://rpc.url', () => 1337)
    http.queueResponse(400, 'invalid opcode: INVALID')
    const result = await client.call(
      { to: EthereumAddress.random(), input: '0xdeadbeef' },
      'latest',
    )
    expect(result).toEqual({ reverted: true })
  })

  it('eth_call fail', async () => {
    const http = new MockHttp()
    const client = new EthRpcClient(http, 'https://rpc.url', () => 1337)
    http.queueResponse(503, 'Oops, our server is down')
    expect(
      client.call(
        { to: EthereumAddress.random(), input: '0xdeadbeef' },
        'latest',
      ),
    ).toBeRejected()
  })
})
