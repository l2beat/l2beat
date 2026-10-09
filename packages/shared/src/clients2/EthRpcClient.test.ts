import { EthereumAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { FetchInit } from '../clients/http/fetchWithTimeout'
import type { RpcMetricsRecorder } from '../clients/rpc/RpcMetricsAggregator'
import { EthRpcClient } from './EthRpcClient'
import { Http, type HttpResponse, MockHttp, makeHttpResponse } from './Http'

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
    await expect(client.getBlockNumber()).toBeRejectedWith(
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
    await expect(client.getBlockNumber()).toBeRejectedWith(
      'RPC call failed. RPC code: -32000, message: Server error',
    )
  })

  // Methodology: a batch answered out of order, with one receipt the node has
  // not got; the results must follow the asked order, the missing one null
  it('asks for receipts in one batch and answers in the asked order', async () => {
    const http = new MockHttp()
    let id = 0
    const client = new EthRpcClient(http, 'https://rpc.url', () => ++id)
    http.queueResponse(
      200,
      JSON.stringify([
        { jsonrpc: '2.0', id: 2, result: null },
        { jsonrpc: '2.0', id: 1, result: receipt(HASH_A) },
      ]),
    )

    const receipts = await client.getTransactionReceipts([HASH_A, HASH_B])

    expect(receipts.map((r) => r?.transactionHash ?? null)).toEqual([
      HASH_A,
      null,
    ])
    expect(JSON.parse(http.lastFetch?.init.body as string)).toEqual([
      {
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_getTransactionReceipt',
        params: [HASH_A],
      },
      {
        jsonrpc: '2.0',
        id: 2,
        method: 'eth_getTransactionReceipt',
        params: [HASH_B],
      },
    ])
  })

  it('refuses a batch with an error for any of its calls', async () => {
    const http = new MockHttp()
    let id = 0
    const client = new EthRpcClient(http, 'https://rpc.url', () => ++id)
    http.queueResponse(
      200,
      JSON.stringify([
        { jsonrpc: '2.0', id: 1, result: receipt(HASH_A) },
        { jsonrpc: '2.0', id: 2, error: { code: -32005, message: 'Limit' } },
      ]),
    )

    await expect(
      client.getTransactionReceipts([HASH_A, HASH_B]),
    ).toBeRejectedWith('RPC call failed. RPC code: -32005, message: Limit')
  })

  describe('batches', () => {
    const REJECTIONS: Record<string, (request: RpcRequest[]) => HttpResponse> =
      {
        // dRPC's free plan
        'every call fails with a batch error': (request) =>
          ok(
            request.map((call) =>
              rpcError(
                call.id,
                'Batch of more than 3 requests are not allowed',
              ),
            ),
          ),
        // publicnode
        'one batch error for the whole batch': (request) =>
          ok([rpcError(request[0]?.id ?? null, 'batch too large')]),
        // Cloudflare, Flashbots
        'one error in place of the array': () =>
          ok(rpcError(null, 'too many RPC calls in batch request')),
        'HTTP 413': () => makeHttpResponse(413, 'Request Entity Too Large'),
      }

    const TRANSIENT_FAILURES: Record<
      string,
      (request: RpcRequest | RpcRequest[]) => HttpResponse
    > = {
      'network error': () => {
        throw new Error('Failed to fetch: network error.')
      },
      'HTTP 503': () => makeHttpResponse(503, 'Oops, our server is down'),
      'HTTP 429 with an error in place of the array': () =>
        makeHttpResponse(
          429,
          JSON.stringify(rpcError(null, 'Rate limit exceeded')),
        ),
    }

    // Methodology: 5 receipts at 2 per batch, a node that answers every batch
    // reversed; the requests must hold at most 2 calls (the lone fifth goes
    // as a plain call) and the results must follow the asked order
    it('splits calls into requests of maxBatchSize and keeps their order', async () => {
      const node = new FakeNode(answerReversed)
      const client = batchingClient(node, 2)

      const receipts = await client.getTransactionReceipts(HASHES)

      expect(receipts.map((r) => r?.transactionHash)).toEqual(HASHES)
      expect(node.requests.map(callsIn)).toEqual([2, 2, 'single'])
    })

    // Methodology: the node drops a call from the second batch only
    it('refuses a batch that lacks the answer to one of its calls', async () => {
      const node = new FakeNode((request) => {
        const answer = answerReversed(request)
        if (Array.isArray(request) && request[0].params[0] === HASHES[2]) {
          return ok(JSON.parse(answer.body).slice(1))
        }
        return answer
      })
      const client = batchingClient(node, 2)

      await expect(client.getTransactionReceipts(HASHES)).toBeRejectedWith(
        'RPC call failed. ID mismatch.',
      )
    })

    // Methodology: each case is a rejection as a real RPC sends it, for any
    // batch over 1 call; the calls must then go one by one, and the next
    // batches must be half the rejected size
    for (const [name, reject] of Object.entries(REJECTIONS)) {
      it(`calls one by one when the RPC rejects the batch: ${name}`, async () => {
        const node = new FakeNode((request) =>
          Array.isArray(request) && request.length > 2
            ? reject(request)
            : answerReversed(request),
        )
        const client = batchingClient(node, 4)

        const first = await client.getTransactionReceipts(HASHES.slice(0, 4))
        const second = await client.getTransactionReceipts(HASHES.slice(0, 4))

        expect(first.map((r) => r?.transactionHash)).toEqual(HASHES.slice(0, 4))
        expect(second).toEqual(first)
        expect(node.requests.map(callsIn)).toEqual([
          4,
          ...Array(4).fill('single'),
          2,
          2,
        ])
      })
    }

    // Methodology: failures of the request, not of its size; each must reach
    // the caller, which retries, after one request and no single calls
    for (const [name, fail] of Object.entries(TRANSIENT_FAILURES)) {
      it(`does not call one by one when a retry would do: ${name}`, async () => {
        const node = new FakeNode(fail)
        const client = batchingClient(node, 4)

        await expect(
          client.getTransactionReceipts(HASHES.slice(0, 4)),
        ).toBeRejected()
        expect(node.requests.map(callsIn)).toEqual([4])
      })
    }
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

  it('accepts custom envelope tx with calls and missing top-level input/value', async () => {
    const http = new MockHttp()
    const client = new EthRpcClient(http, 'https://rpc.url', () => 1337)
    http.queueResponse(
      200,
      JSON.stringify({
        jsonrpc: '2.0',
        id: 1337,
        result: {
          blockHash: `0x${'11'.repeat(32)}`,
          blockNumber: '0x64',
          from: '0x0000000000000000000000000000000000000001',
          gas: '0x5208',
          hash: `0x${'22'.repeat(32)}`,
          to: '0x0000000000000000000000000000000000000002',
          transactionIndex: '0x0',
          type: '0x76',
          calls: [
            {
              to: '0x0000000000000000000000000000000000000003',
              value: '0x9',
              input: '0xabcd',
              data: null,
            },
          ],
        },
      }),
    )

    const result = await client.getTransactionByHash(`0x${'ff'.repeat(32)}`)

    expect(result).toEqual({
      blockHash: `0x${'11'.repeat(32)}`,
      blockNumber: 100n,
      from: EthereumAddress('0x0000000000000000000000000000000000000001'),
      gas: 21000n,
      hash: `0x${'22'.repeat(32)}`,
      to: EthereumAddress('0x0000000000000000000000000000000000000002'),
      transactionIndex: 0n,
      type: 118n,
      calls: [
        {
          to: EthereumAddress('0x0000000000000000000000000000000000000003'),
          value: 9n,
          input: '0xabcd',
          data: undefined,
        },
      ],
    })
  })

  it('treats calls: null as missing in transaction response', async () => {
    const http = new MockHttp()
    const client = new EthRpcClient(http, 'https://rpc.url', () => 1337)
    http.queueResponse(
      200,
      JSON.stringify({
        jsonrpc: '2.0',
        id: 1337,
        result: {
          blockHash: null,
          blockNumber: null,
          from: '0x0000000000000000000000000000000000000001',
          gas: '0x5208',
          hash: `0x${'22'.repeat(32)}`,
          to: '0x0000000000000000000000000000000000000002',
          transactionIndex: null,
          calls: null,
        },
      }),
    )

    const result = await client.getTransactionByHash(`0x${'ff'.repeat(32)}`)

    expect(result?.calls).toEqual(undefined)
  })

  it('records rpc metrics for calls', async () => {
    const http = new MockHttp()
    const recorded: Parameters<RpcMetricsRecorder['record']>[0][] = []
    const rpcMetrics: RpcMetricsRecorder = {
      record: (metric) => {
        recorded.push(metric)
      },
    }
    const client = new EthRpcClient(
      http,
      'https://rpc.url',
      () => 1337,
      undefined,
      rpcMetrics,
    )
    http.queueResponse(
      200,
      JSON.stringify({ jsonrpc: '2.0', id: 1337, result: '0x1234' }),
    )

    await client.getBlockNumber()

    expect(recorded).toHaveLength(1)
    expect(recorded[0]?.method).toEqual('eth_blockNumber')
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
    const client = new EthRpcClient(new Http(), url)

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

const HASH_A = `0x${'a'.repeat(64)}`
const HASH_B = `0x${'b'.repeat(64)}`
const HASHES = [1, 2, 3, 4, 5].map((i) => `0x${i.toString().repeat(64)}`)

interface RpcRequest {
  id: number
  params: [string]
}

/** Answers by the request body, so batches sent at once get their own answers */
class FakeNode extends Http {
  requests: (RpcRequest | RpcRequest[])[] = []

  constructor(
    private answer: (request: RpcRequest | RpcRequest[]) => HttpResponse,
  ) {
    super()
  }

  override fetch(_url: string, init: FetchInit) {
    const request = JSON.parse(init.body as string)
    this.requests.push(request)
    try {
      return Promise.resolve(this.answer(request))
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

function batchingClient(http: Http, maxBatchSize: number) {
  let id = 0
  return new EthRpcClient(
    http,
    'https://rpc.url',
    () => ++id,
    undefined,
    undefined,
    maxBatchSize,
  )
}

function answerReversed(request: RpcRequest | RpcRequest[]) {
  const answer = (call: RpcRequest) => ({
    jsonrpc: '2.0',
    id: call.id,
    result: receipt(call.params[0]),
  })
  return ok(
    Array.isArray(request) ? request.map(answer).reverse() : answer(request),
  )
}

function callsIn(request: RpcRequest | RpcRequest[]) {
  return Array.isArray(request) ? request.length : 'single'
}

function ok(body: unknown) {
  return makeHttpResponse(200, JSON.stringify(body))
}

function rpcError(id: number | null, message: string) {
  return { jsonrpc: '2.0', id, error: { code: -32600, message } }
}

function receipt(transactionHash: string) {
  return {
    transactionHash,
    transactionIndex: '0x0',
    blockHash: `0x${'c'.repeat(64)}`,
    blockNumber: '0x1',
    from: `0x${'1'.repeat(40)}`,
    to: `0x${'2'.repeat(40)}`,
    cumulativeGasUsed: '0x1',
    effectiveGasPrice: '0x1',
    gasUsed: '0x1',
    contractAddress: null,
    logs: [],
    logsBloom: `0x${'0'.repeat(512)}`,
    type: '0x3',
    status: '0x1',
  }
}
