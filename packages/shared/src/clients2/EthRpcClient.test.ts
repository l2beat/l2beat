import { EthereumAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { EthRpcClient } from './EthRpcClient'
import { Http, MockHttp } from './Http'

describe(EthRpcClient.name, () => {
  it('correctly calls an endpoint', async () => {
    const http = new MockHttp()
    const client = new EthRpcClient(http, 'https://rpc.url', '', () => 1337)
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
    const client = new EthRpcClient(http, 'https://rpc.url', '', () => 1337)
    http.queueResponse(503, 'Oops, our server is down')
    await expect(client.getBlockNumber()).toBeRejectedWith(
      'RPC call failed. HTTP status: 503, body: Oops, our server is down',
    )
  })

  it('handles a jsonrpc error response', async () => {
    const http = new MockHttp()
    const client = new EthRpcClient(http, 'https://rpc.url', '', () => 1337)
    http.queueResponse(
      200,
      JSON.stringify({
        jsonrpc: '2.0',
        id: 1337,
        error: { code: -32000, message: 'Server error' },
      }),
    )
    await expect(client.getBlockNumber()).toBeRejectedWith(
      'RPC call failed. RPC code: -32000, message: Server error',
    )
  })

  it('eth_call success', async () => {
    const http = new MockHttp()
    const client = new EthRpcClient(http, 'https://rpc.url', '', () => 1337)
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
    const client = new EthRpcClient(http, 'https://rpc.url', '', () => 1337)
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
    const client = new EthRpcClient(http, 'https://rpc.url', '', () => 1337)
    http.queueResponse(400, 'invalid opcode: INVALID')
    const result = await client.call(
      { to: EthereumAddress.random(), input: '0xdeadbeef' },
      'latest',
    )
    expect(result).toEqual({ reverted: true })
  })

  it('eth_call fail', async () => {
    const http = new MockHttp()
    const client = new EthRpcClient(http, 'https://rpc.url', '', () => 1337)
    http.queueResponse(503, 'Oops, our server is down')
    expect(
      client.call(
        { to: EthereumAddress.random(), input: '0xdeadbeef' },
        'latest',
      ),
    ).toBeRejected()
  })
})

const URLS = (process.env.TEST_RPC_URLS ?? '').split(';').filter((x) => !!x)
for (const url of URLS) {
  describe(`${EthRpcClient.name} integration: ${url}`, function () {
    this.timeout(5_000)

    const VITALIK = EthereumAddress(
      '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    )
    const MULTICALL3 = EthereumAddress(
      '0xcA11bde05977b3631167028862bE2a173976CA11',
    )
    const client = new EthRpcClient(new Http(), url, '')

    it(EthRpcClient.prototype.getChainId.name, async () => {
      const chainId = await client.getChainId()
      expect(chainId > 0n).toEqual(true)
    })

    it(EthRpcClient.prototype.getBlockNumber.name, async () => {
      const blockNumber = await client.getBlockNumber()
      expect(blockNumber > 0n).toEqual(true)
    })

    it(EthRpcClient.prototype.getGasPrice.name, async () => {
      const gasPrice = await client.getGasPrice()
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
      const chainId = await client.getChainId()
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

    const interestingBlocks: bigint[] = [0n, 1000n]
    it('gets interesting blocks', async () => {
      const latest = await client.getBlockNumber()
      interestingBlocks.push(
        latest / 5n,
        (latest / 5n) * 2n,
        (latest / 5n) * 3n,
        (latest / 5n) * 4n,
        latest,
        latest - 1000n,
      )
    })

    const blocksWithTransactions: bigint[] = []
    const transactionHashes: string[] = []

    describe(EthRpcClient.prototype.getBlockByNumber.name, () => {
      it('latest', async () => {
        const latest = await client.getBlockByNumber('latest', false)
        expect((latest?.number ?? 0n) > 0n).toEqual(true)
      })

      it('interesting blocks', async () => {
        for (const number of interestingBlocks) {
          console.log('BLOCK', number)
          const block = await client.getBlockByNumber(number, false)
          if (block && block.transactions.length > 0) {
            blocksWithTransactions.push(number)
            transactionHashes.push(...block.transactions)
          }
        }
      })

      it('with trasactions', async () => {
        for (const number of blocksWithTransactions) {
          console.log('BLOCK', number)
          const block = await client.getBlockByNumber(number, true)
          expect(block?.number).toEqual(number)
        }
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

    describe('transactions', () => {
      it(EthRpcClient.prototype.getTransactionByHash.name, async () => {
        const top5 = transactionHashes.sort().slice(0, 5)
        for (const hash of top5) {
          console.log('HASH', hash)
          const tx = await client.getTransactionByHash(hash)
          expect(tx).not.toEqual(null)
        }
      })

      it(EthRpcClient.prototype.getTransactionReceipt.name, async () => {
        const top5 = transactionHashes.sort().slice(0, 5)
        for (const hash of top5) {
          console.log('HASH', hash)
          const receipt = await client.getTransactionReceipt(hash)
          expect(receipt).not.toEqual(null)
        }
      })
    })

    it(EthRpcClient.prototype.getLogs.name, async () => {
      const blockNumber = await client.getBlockNumber()
      await client.getLogs({
        fromBlock: blockNumber - 10n,
        toBlock: blockNumber,
      })
    })
  })
}
