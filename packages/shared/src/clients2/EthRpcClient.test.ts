import { EthereumAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { EthRpcClient } from './EthRpcClient'
import { Http, MockHttp } from './Http'

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

const URLS = (process.env.TEST_RPC_URLS ?? '').split(';').filter(x => !!x)
for (const url of URLS) {
  describe(`${EthRpcClient.name} integration: ${url}`, () => {
    const VITALIK = EthereumAddress(
      '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    )
    const MULTICALL3 = EthereumAddress(
      '0xcA11bde05977b3631167028862bE2a173976CA11',
    )
    const client = new EthRpcClient(new Http(), url)

    it(EthRpcClient.prototype.chainId.name, async () => {
      const chainId = await client.chainId()
      expect(chainId > 0n).toEqual(true)
    })

    it(EthRpcClient.prototype.blockNumber.name, async () => {
      const blockNumber = await client.blockNumber()
      expect(blockNumber > 0n).toEqual(true)
    })

    it(EthRpcClient.prototype.gasPrice.name, async () => {
      const gasPrice = await client.blockNumber()
      expect(gasPrice >= 0n).toEqual(true)
    })

    it(EthRpcClient.prototype.getBalance.name, async () => {
      const balance = await client.getBalance(VITALIK, 'latest')
      expect(balance >= 0n).toEqual(true)
    })

    it(EthRpcClient.prototype.getStorageAt.name, async () => {
      const storage = await client.getStorageAt(VITALIK, 0n, 'latest')
      expect(storage).toEqual('0x' + '0'.repeat(64))
    })

    it(EthRpcClient.prototype.getTransactionCount.name, async () => {
      const count = await client.getTransactionCount(VITALIK, 'latest')
      expect(count >= 0n).toEqual(true)
    })

    it(EthRpcClient.prototype.getCode.name, async () => {
      const code = await client.getCode(MULTICALL3, 'latest')
      expect(code).toMatchRegex(/^0x/)
    })

    it(EthRpcClient.prototype.call.name, async () => {
      const chainId = await client.chainId()
      const result1 = await client.call(
        {
          to: MULTICALL3,
          input: '0x3408e470', // getChainId()
        },
        'latest',
      )
      expect(result1.reverted).toEqual(false)
      if (!result1.reverted) {
        expect(BigInt(result1.data)).toEqual(chainId)
      }

      const result2 = await client.call(
        {
          to: MULTICALL3,
          input: '0xDEADBEEF', // garbage
        },
        'latest',
      )
      expect(result2.reverted).toEqual(true)
    })

    it(EthRpcClient.prototype.estimateGas.name, async () => {
      const result1 = await client.estimateGas(
        {
          to: MULTICALL3,
          input: '0x3408e470', // getChainId()
        },
        'latest',
      )
      expect(result1.reverted).toEqual(false)
      if (!result1.reverted) {
        expect(result1.gas >= 0n).toEqual(true)
      }

      const result2 = await client.estimateGas(
        {
          to: MULTICALL3,
          input: '0xDEADBEEF', // garbage
        },
        'latest',
      )
      expect(result2.reverted).toEqual(true)
    })

    describe(EthRpcClient.prototype.getBlockByNumber.name, () => {
      it('without transactions', async () => {
        const latest1 = await client.getBlockByNumber('latest', false)
        expect(latest1 && latest1.number && latest1.number >= 0n).toEqual(true)

        const latest2 = await client.getBlockByNumber(
          latest1?.number ?? 0n,
          false,
        )
        expect(latest2).toEqual(latest1)

        const block0 = await client.getBlockByNumber(0n, false)
        expect(block0?.number).toEqual(0n)

        const block1 = await client.getBlockByNumber(1n, false)
        expect(block1?.number).toEqual(1n)

        const block1000 = await client.getBlockByNumber(1000n, false)
        expect(block1000?.number).toEqual(1000n)
      })
      it('with transactions', async () => {
        const latest1 = await client.getBlockByNumber('latest', true)
        expect(latest1 && latest1.number && latest1.number >= 0n).toEqual(true)

        const latest2 = await client.getBlockByNumber(
          latest1?.number ?? 0n,
          true,
        )
        expect(latest2).toEqual(latest1)

        const block0 = await client.getBlockByNumber(0n, true)
        expect(block0?.number).toEqual(0n)

        const block1 = await client.getBlockByNumber(1n, true)
        expect(block1?.number).toEqual(1n)

        const block1000 = await client.getBlockByNumber(1000n, true)
        expect(block1000?.number).toEqual(1000n)
      })
    })

    describe(EthRpcClient.prototype.getBlockByHash.name, () => {
      it('without transactions', async () => {
        const latest1 = await client.getBlockByNumber('latest', false)
        const latest2 = await client.getBlockByHash(
          latest1?.hash ?? '0x',
          false,
        )
        expect(latest2).toEqual(latest1)
      })
      it('with transactions', async () => {
        const latest1 = await client.getBlockByNumber('latest', true)
        const latest2 = await client.getBlockByHash(latest1?.hash ?? '0x', true)
        expect(latest2).toEqual(latest1)
      })
    })

    it(EthRpcClient.prototype.getTransactionByHash.name, async () => {
      const latest = await client.getBlockByNumber('latest', true)
      const tx1 = latest?.transactions[0]
      const tx2 = await client.getTransactionByHash(tx1?.hash ?? '0x')
      expect(tx1 ?? null).toEqual(tx2)
    })

    it(EthRpcClient.prototype.getTransactionReceipt.name, async () => {
      const latest = await client.getBlockByNumber('latest', true)
      const tx = latest?.transactions[0]
      const receipt = await client.getTransactionReceipt(tx?.hash ?? '0x')
      expect(receipt?.transactionHash).toEqual(tx?.hash)
    })

    it(EthRpcClient.prototype.getLogs.name, async () => {
      const latest = await client.getBlockByNumber('latest', false)
      const logs = await client.getLogs({
        fromBlock: latest?.number ?? 0n,
        toBlock: latest?.number ?? 0n,
      })
      expect(logs.every((l) => l.blockHash === latest?.hash)).toEqual(true)
    })
  })
}
