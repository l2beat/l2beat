import { Logger } from '@l2beat/backend-tools'
import { Bytes, EthereumAddress } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { HttpClient } from '../../clients/http/HttpClient'
import { NotFoundOnRpcError } from '../../clients/rpc/RpcClient'
import { withServer } from '../../test/withServer'
import type { EthRpcClient, RpcBlock } from '../EthRpcClient'
import { RpcClientCompat } from './RpcClientCompat'

describe(RpcClientCompat.name, () => {
  describe(RpcClientCompat.create.name, () => {
    it('does not retry a block the RPC has not got', async () => {
      const results = [null]
      const requests = await countRequests(results, (client) =>
        expect(client.getBlockHeader(100)).toBeRejectedWith(NotFoundOnRpcError),
      )
      expect(requests).toEqual(1)
    })

    it('retries other failures', async () => {
      const results = [undefined, rpcBlock(100)]
      const requests = await countRequests(results, async (client) => {
        const header = await client.getBlockHeader(100)
        expect(header.number).toEqual(100)
      })
      expect(requests).toEqual(2)
    })
  })

  describe(RpcClientCompat.prototype.call.name, () => {
    // Why: the log formats a cause that is an Error as {}
    it('keeps the status of a refused call in a plain cause', async () => {
      const error = await withServer(
        (_, res) => {
          res.statusCode = 503
          res.setHeader('Retry-After', '7')
          res.end(
            JSON.stringify({
              jsonrpc: '2.0',
              id: 1,
              error: { code: 3, message: 'execution reverted' },
            }),
          )
        },
        (url) =>
          RpcClientCompat.create({
            url,
            chain: 'ethereum',
            http: new HttpClient(),
            logger: Logger.SILENT,
            callsPerMinute: 60_000,
            retryStrategy: 'TEST',
          })
            .call({ to: EthereumAddress.random(), input: Bytes.EMPTY }, 100)
            .catch((e: Error) => e),
      )

      expect(error).toBeA(Error)
      expect((error as Error).message).not.toInclude('revert')
      expect((error as Error).cause).toEqual({
        status: 503,
        rateLimit: { 'retry-after': '7' },
      })
    })
  })

  describe(RpcClientCompat.prototype.getBlockTimestamp.name, () => {
    it('fetches the block without transaction bodies', async () => {
      const header = {
        hash: `0x${'ab'.repeat(32)}`,
        number: 100n,
        timestamp: 1_000n,
        logsBloom: '0x',
        transactions: [],
      } as unknown as RpcBlock
      const getBlockByNumber = mockFn().resolvesTo(header)
      const client = new RpcClientCompat(
        mockObject<EthRpcClient>({ getBlockByNumber }),
        'chain',
      )

      const timestamp = await client.getBlockTimestamp(100)

      expect(timestamp).toEqual(1_000)
      expect(getBlockByNumber).toHaveBeenOnlyCalledWith(100n, false)
    })
  })

  describe(RpcClientCompat.prototype.getBlock.name, () => {
    it('exposes settledHeight only when the header has it', async () => {
      const client = new RpcClientCompat(
        mockObject<EthRpcClient>({
          getBlockByNumber: mockFn()
            .resolvesToOnce({ ...block(100), settledHeight: 98n })
            .resolvesToOnce(block(101)),
        }),
        'avalanche',
      )

      const settled = await client.getBlock(100, false)
      const legacy = await client.getBlock(101, false)

      expect(settled.settledHeight).toEqual(98)
      expect(legacy.settledHeight).toEqual(undefined)
    })

    it('tells a block the RPC has not got from a broken response', async () => {
      // As RpcClient does, so a caller following the head waits for it
      const client = new RpcClientCompat(
        mockObject<EthRpcClient>({
          getBlockByNumber: mockFn().resolvesTo(null),
        }),
        'ethereum',
      )

      await expect(client.getBlock(100, true)).toBeRejectedWith(
        NotFoundOnRpcError,
        'Block not found',
      )
    })
  })

  describe(RpcClientCompat.prototype.getTransactionReceipts.name, () => {
    it('names the receipts the RPC has not got', async () => {
      const client = new RpcClientCompat(
        mockObject<EthRpcClient>({
          getTransactionReceipts: mockFn().resolvesTo([{ logs: [] }, null]),
        }),
        'ethereum',
      )

      const error = await client.getTransactionReceipts(['0x1', '0x2']).then(
        () => undefined,
        (e: Error) => e,
      )

      expect(error).toBeA(NotFoundOnRpcError)
      expect(error?.cause).toEqual({ txHashes: ['0x2'] })
    })
  })

  describe(RpcClientCompat.prototype.getBlockReceipts.name, () => {
    it('maps the gas fields and fails on an unknown block', async () => {
      const getBlockReceipts = mockFn()
        .resolvesToOnce([
          {
            blockHash: `0x${'ab'.repeat(32)}`,
            gasUsed: 21_000n,
            effectiveGasPrice: 3n,
            logs: [],
          },
        ])
        .resolvesToOnce(null)
      const client = new RpcClientCompat(
        mockObject<EthRpcClient>({ getBlockReceipts }),
        'ethereum',
      )

      expect(await client.getBlockReceipts(100)).toEqual([
        {
          blockHash: `0x${'ab'.repeat(32)}`,
          gasUsed: 21_000n,
          effectiveGasPrice: 3n,
          logs: [],
        },
      ])
      expect(getBlockReceipts).toHaveBeenNthCalledWith(1, 100n)
      await expect(client.getBlockReceipts(101)).toBeRejectedWith(
        NotFoundOnRpcError,
      )
    })
  })

  describe(RpcClientCompat.prototype.getTransactionReceipt.name, () => {
    it('keeps the block hash, event emitter and log index', async () => {
      const client = new RpcClientCompat(
        mockObject<EthRpcClient>({
          getTransactionReceipt: mockFn().resolvesTo({
            blockHash: `0x${'ab'.repeat(32)}`,
            logs: [
              {
                address: EthereumAddress.ZERO,
                topics: ['0x1'],
                data: '0x2',
                logIndex: 7n,
              },
            ],
          }),
        }),
        'avalanche',
      )

      const receipt = await client.getTransactionReceipt('0xtx')

      expect(receipt).toEqual({
        blockHash: `0x${'ab'.repeat(32)}`,
        logs: [
          {
            address: EthereumAddress.ZERO.toString(),
            topics: ['0x1'],
            data: '0x2',
            logIndex: 7,
          },
        ],
      })
    })

    it('rejects a receipt with a pending log', async () => {
      const client = new RpcClientCompat(
        mockObject<EthRpcClient>({
          getTransactionReceipt: mockFn().resolvesTo({
            logs: [
              {
                address: EthereumAddress.ZERO,
                topics: [],
                data: '0x',
                logIndex: null,
              },
            ],
          }),
        }),
        'avalanche',
      )

      await expect(client.getTransactionReceipt('0xtx')).toBeRejectedWith(
        'pending log',
      )
    })
  })

  describe(RpcClientCompat.prototype.getLogs.name, () => {
    it('passes positional topic filters through unchanged', async () => {
      const getLogs = mockFn<EthRpcClient['getLogs']>().resolvesTo([])
      const client = new RpcClientCompat(
        mockObject<EthRpcClient>({ getLogs }),
        'ethereum',
      )
      const addresses = [
        EthereumAddress('0x1111111111111111111111111111111111111111'),
      ]
      const topics = [
        [`0x${'aa'.repeat(32)}`, `0x${'bb'.repeat(32)}`],
        null,
        `0x${'cc'.repeat(32)}`,
      ]

      await client.getLogs(100, 200, addresses, topics)

      expect(getLogs).toHaveBeenOnlyCalledWith({
        fromBlock: 100n,
        toBlock: 200n,
        address: addresses,
        topics,
      })
    })

    it('does not split a single block when limit exceeded', async () => {
      const error = new Error(
        'RPC call failed. RPC code: -32602, message: Log response size exceeded',
      )
      const getLogs = mockFn<EthRpcClient['getLogs']>()
        .rejectsWithOnce(error)
        .resolvesTo([])
      const client = new RpcClientCompat(
        mockObject<EthRpcClient>({ getLogs }),
        'ethereum',
      )

      await expect(client.getLogs(100, 100)).toBeRejectedWith(error.message)
      expect(getLogs).toHaveBeenCalledTimes(1)
    })
  })

  describe(RpcClientCompat.prototype.getBlockTimestamps.name, () => {
    it('reads the headers in one batch', async () => {
      const getBlocksByNumber = mockFn<
        EthRpcClient['getBlocksByNumber']
      >().resolvesTo([block(1), block(2)])
      const client = new RpcClientCompat(
        mockObject<EthRpcClient>({ getBlocksByNumber }),
        'ethereum',
      )

      const result = await client.getBlockTimestamps([1, 2])

      expect(result).toEqual(
        new Map([
          [1, 100],
          [2, 200],
        ]),
      )
      expect(getBlocksByNumber).toHaveBeenOnlyCalledWith([1n, 2n])
    })

    it('fails on a block the RPC has not got', async () => {
      const client = new RpcClientCompat(
        mockObject<EthRpcClient>({
          getBlocksByNumber: mockFn().resolvesTo([block(1), null]),
        }),
        'ethereum',
      )

      await expect(() => client.getBlockTimestamps([1, 2])).toBeRejectedWith(
        NotFoundOnRpcError,
        'Block not found',
      )
    })

    it('rejects a mismatched block number', async () => {
      const client = new RpcClientCompat(
        mockObject<EthRpcClient>({
          getBlocksByNumber: mockFn().resolvesTo([block(2)]),
        }),
        'ethereum',
      )

      await expect(() => client.getBlockTimestamps([1])).toBeRejectedWith(
        'Unexpected block number',
      )
    })
  })
})

function block(number: number): RpcBlock {
  return {
    number: BigInt(number),
    timestamp: BigInt(number * 100),
    hash: `0x${number.toString(16).padStart(64, '0')}`,
    logsBloom: `0x${'00'.repeat(256)}`,
  } as RpcBlock
}

/** Answers with `results` in turn; `undefined` answers with an RPC error */
async function countRequests(
  results: unknown[],
  run: (client: RpcClientCompat) => Promise<void>,
): Promise<number> {
  let requests = 0
  await withServer(
    (req, res) => {
      let body = ''
      req.on('data', (chunk) => {
        body += chunk
      })
      req.on('end', () => {
        const { id } = JSON.parse(body)
        const result = results[requests++]
        res.setHeader('Content-Type', 'application/json')
        res.end(
          JSON.stringify(
            result === undefined
              ? { jsonrpc: '2.0', id, error: { code: -32000, message: 'oops' } }
              : { jsonrpc: '2.0', id, result },
          ),
        )
      })
    },
    (url) =>
      run(
        RpcClientCompat.create({
          url,
          chain: 'ethereum',
          http: new HttpClient(),
          logger: Logger.SILENT,
          callsPerMinute: 60_000,
          retryStrategy: 'SCRIPT',
        }),
      ),
  )
  return requests
}

function rpcBlock(number: number) {
  return {
    hash: `0x${'ab'.repeat(32)}`,
    parentHash: `0x${'cd'.repeat(32)}`,
    number: `0x${number.toString(16)}`,
    timestamp: '0x64',
    gasUsed: '0x0',
    gasLimit: '0x0',
    size: '0x0',
    logsBloom: `0x${'00'.repeat(256)}`,
    transactionsRoot: `0x${'00'.repeat(32)}`,
    stateRoot: `0x${'00'.repeat(32)}`,
    receiptsRoot: `0x${'00'.repeat(32)}`,
    miner: `0x${'00'.repeat(20)}`,
    extraData: '0x',
    transactions: [],
  }
}
