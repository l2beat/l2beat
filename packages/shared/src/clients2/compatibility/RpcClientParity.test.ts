import { Logger } from '@l2beat/backend-tools'
import { Bytes, EthereumAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { HttpClient } from '../../clients/http/HttpClient'
import { MulticallV3Client } from '../../clients/rpc/multicall/MulticallV3Client'
import { NotFoundOnRpcError, RpcClient } from '../../clients/rpc/RpcClient'
import type { CallParameters } from '../../clients/rpc/types'
import { withServer } from '../../test/withServer'
import type { RetryHandlerVariant } from '../../tools'
import { type IRpcClient, RpcClientCompat } from './RpcClientCompat'

// The backend switches from RpcClient to RpcClientCompat with a flag. Both
// are run here against one fake RPC, so each case shows what the switch
// changes for the callers.

type Answer =
  | { result: unknown }
  | { error: { code: number; message: string } }
  | { status: number; body: string }
  /** Sent as it is, with no `jsonrpc` added */
  | { envelope: Record<string, unknown> }

interface Call {
  method: string
  params: unknown[]
}

interface Case {
  name: string
  /**
   * Called once per call, in the order the calls reach the RPC. `request`
   * counts HTTP requests, of which a batch is one.
   */
  answer: (call: Call, index: number, request: number) => Answer
  run: (client: IRpcClient) => Promise<unknown>
  /** TEST, with one retry, unless set */
  retryStrategy?: RetryHandlerVariant
  /**
   * Calls sent in parallel reach the RPC in no set order, so which of them is
   * refused, and sent again, differs from run to run
   */
  refusesAnyOf?: true
  /** Set when the case checks only that both clients fail */
  fails?: true
  /** Gives both clients a multicall deployed at block 1000 */
  multicall?: true
  /**
   * RpcClient fails to parse the null, RpcClientCompat names it with
   * NotFoundOnRpcError. Neither retries it.
   */
  onlyCompatNotFound?: true
}

const ADDRESS_A = '0x' + 'a1'.repeat(20)
const ADDRESS_B = '0x' + 'b2'.repeat(20)
const HASH_A = '0x' + 'aa'.repeat(32)
const HASH_B = '0x' + 'bb'.repeat(32)
const TOPIC = '0x' + 'cc'.repeat(32)

const CASES: Case[] = [
  {
    name: 'latest block number',
    answer: () => ({ result: '0x64' }),
    run: (c) => c.getLatestBlockNumber(),
  },
  {
    name: 'block header',
    answer: () => ({ result: block(100) }),
    run: (c) => c.getBlock(100, false),
  },
  {
    name: 'block header with Avalanche settledHeight',
    answer: () => ({ result: { ...block(100), settledHeight: '0x62' } }),
    run: (c) => c.getBlock(100, false),
  },
  {
    name: 'block header of a pre-London, pre-Shanghai block',
    answer: () => ({
      result: {
        ...block(100),
        baseFeePerGas: undefined,
        withdrawals: undefined,
        parentBeaconBlockRoot: undefined,
      },
    }),
    run: (c) => c.getBlock(100, false),
  },
  {
    name: 'block with transactions of every kind',
    answer: () => ({
      result: {
        ...block(100),
        transactions: [
          eip1559Tx(),
          contractCreationTx(),
          blobTx(),
          opDepositTx(),
          zkSyncTx(),
        ],
      },
    }),
    run: (c) => c.getBlockWithTransactions(100),
  },
  {
    name: 'block timestamp',
    answer: () => ({ result: block(100) }),
    run: (c) => c.getBlockTimestamp(100),
  },
  {
    name: 'block parent beacon root',
    answer: () => ({ result: block(100) }),
    run: (c) => c.getBlockParentBeaconRoot(100),
  },
  {
    name: 'block timestamps in a batch',
    answer: (call) => ({ result: block(Number(call.params[0])) }),
    run: (c) => c.getBlockTimestamps([1, 2, 3]),
  },
  {
    name: 'transaction',
    answer: () => ({ result: blobTx() }),
    run: (c) => c.getTransaction(HASH_A),
  },
  {
    name: 'receipt',
    answer: () => ({ result: receipt(HASH_A) }),
    run: (c) => c.getTransactionReceipt(HASH_A),
  },
  {
    name: 'receipt with a null effective gas price, as zetachain answers',
    answer: () => ({
      result: { ...receipt(HASH_A), effectiveGasPrice: null },
    }),
    run: (c) => c.getTransactionReceipt(HASH_A),
  },
  {
    name: 'receipts in a batch',
    answer: (call) => ({ result: receipt(String(call.params[0])) }),
    run: (c) => c.getTransactionReceipts([HASH_A, HASH_B]),
  },
  {
    name: 'block receipts',
    answer: () => ({ result: [receipt(HASH_A), receipt(HASH_B)] }),
    run: (c) => c.getBlockReceipts(100),
  },
  {
    name: 'balance',
    answer: () => ({ result: '0x7b' }),
    run: (c) => c.getBalance(EthereumAddress(ADDRESS_A), 100),
  },
  {
    name: 'logs',
    answer: () => ({
      result: [
        log(1, { blockTimestamp: '0x64' }),
        log(2, { blockTimestamp: '0x0' }),
        log(3),
      ],
    }),
    run: (c) => c.getLogs(100, 200, [ADDRESS_A], [[TOPIC], null]),
  },
  {
    name: 'logs over a range the RPC splits',
    answer: (call) => {
      const { fromBlock, toBlock } = call.params[0] as Record<string, string>
      if (Number(toBlock) - Number(fromBlock) > 50) {
        return {
          error: { code: -32602, message: 'Log response size exceeded' },
        }
      }
      return { result: [log(Number(fromBlock))] }
    },
    run: (c) => c.getLogs(100, 200),
  },
  {
    name: 'logs over the limit, refused with HTTP 429',
    answer: (_, i) =>
      i === 0
        ? {
            status: 429,
            body: JSON.stringify({
              jsonrpc: '2.0',
              id: 1,
              error: { code: -32005, message: 'Log response size exceeded' },
            }),
          }
        : { result: [log(150)] },
    run: (c) => c.getLogs(100, 200),
  },
  {
    name: 'fee history without rewards',
    answer: () => ({ result: feeHistory() }),
    run: (c) => c.getFeeHistory(2, 100, []),
  },
  {
    name: 'fee history with rewards',
    answer: () => ({ result: { ...feeHistory(), reward: [['0x1'], ['0x2']] } }),
    run: (c) => c.getFeeHistory(2, 100, [50]),
  },
  {
    name: 'eth_call',
    answer: () => ({ result: '0x' + '00'.repeat(31) + '2a' }),
    run: (c) => c.call(callParams(), 100),
  },
  {
    name: 'eth_call answered with no data',
    answer: () => ({ result: '0x' }),
    run: (c) => c.call(callParams(), 'latest'),
  },
  {
    name: 'multicall in batches',
    answer: (call) => ({
      result: (call.params[0] as Record<string, string>).input,
    }),
    run: (c) =>
      c.multicall([callParams(1), callParams(2), callParams(3)], 1500),
    multicall: true,
  },
  {
    name: 'whether multicall is deployed',
    answer: () => ({ result: '0x' }),
    run: async (c) => [c.isMulticallDeployed(999), c.isMulticallDeployed(1000)],
    multicall: true,
  },
  {
    name: 'a call that fails once, then is answered',
    answer: (_, i) =>
      i === 0
        ? { error: { code: -32000, message: 'header not found' } }
        : { result: '0x7b' },
    run: (c) => c.getBalance(EthereumAddress(ADDRESS_A), 100),
  },
  {
    name: 'a call answered after an HTTP 503',
    answer: (_, i) =>
      i === 0
        ? { status: 503, body: 'Service Unavailable' }
        : { result: '0x7b' },
    run: (c) => c.getBalance(EthereumAddress(ADDRESS_A), 100),
  },
  {
    name: 'a call answered after an HTTP 429',
    answer: (_, i) =>
      i === 0 ? { status: 429, body: 'Too Many Requests' } : { result: '0x7b' },
    run: (c) => c.getBalance(EthereumAddress(ADDRESS_A), 100),
  },
  {
    name: 'a block the RPC has not got',
    answer: () => ({ result: null }),
    run: (c) => c.getBlock(100, false),
    fails: true,
  },
  {
    name: 'block receipts of a block the RPC has not got',
    answer: () => ({ result: null }),
    run: (c) => c.getBlockReceipts(100),
    fails: true,
  },
  {
    name: 'receipts of which the RPC has not got one',
    answer: (call) => ({
      result: call.params[0] === HASH_B ? null : receipt(HASH_A),
    }),
    run: (c) => c.getTransactionReceipts([HASH_A, HASH_B]),
    fails: true,
  },
  {
    name: 'a transaction the RPC has not got',
    answer: () => ({ result: null }),
    run: (c) => c.getTransaction(HASH_A),
    fails: true,
    onlyCompatNotFound: true,
  },
  {
    name: 'a receipt the RPC has not got',
    answer: () => ({ result: null }),
    run: (c) => c.getTransactionReceipt(HASH_A),
    fails: true,
    onlyCompatNotFound: true,
  },
  {
    name: 'logs of a single block over the RPC limit',
    answer: () => ({
      error: { code: -32602, message: 'Log response size exceeded' },
    }),
    run: (c) => c.getLogs(100, 100),
    fails: true,
  },
  {
    name: 'a reverted eth_call',
    answer: () => ({ error: { code: 3, message: 'execution reverted' } }),
    run: (c) => c.call(callParams(), 100),
    fails: true,
  },
  {
    name: 'multicall before its deployment',
    answer: () => ({ result: '0x' }),
    run: (c) => c.multicall([callParams()], 999),
    fails: true,
    multicall: true,
  },
  {
    name: 'multicall with none configured',
    answer: () => ({ result: '0x' }),
    run: (c) => c.multicall([callParams()], 1500),
    fails: true,
    // Sends nothing, so nothing to retry: a retry would wait 1 + 2 + 4 s
    retryStrategy: 'RELIABLE',
  },
  {
    name: 'a call that keeps failing',
    answer: () => ({ error: { code: -32000, message: 'header not found' } }),
    run: (c) => c.getBalance(EthereumAddress(ADDRESS_A), 100),
    fails: true,
  },
  {
    name: 'block header of block 0',
    answer: () => ({ result: block(0) }),
    run: (c) => c.getBlock(0, false),
  },
  {
    name: 'logs from block 0',
    answer: () => ({ result: [log(0)] }),
    run: (c) => c.getLogs(0, 100),
  },
  {
    name: 'a result sent with "error": null',
    answer: () => ({
      envelope: { jsonrpc: '2.0', result: '0x7b', error: null },
    }),
    run: (c) => c.getBalance(EthereumAddress(ADDRESS_A), 100),
  },
  {
    name: 'receipts in a batch sent with "error": null',
    answer: (call) => ({
      envelope: {
        jsonrpc: '2.0',
        result: receipt(String(call.params[0])),
        error: null,
      },
    }),
    run: (c) => c.getTransactionReceipts([HASH_A, HASH_B]),
  },
  {
    name: 'a result sent without jsonrpc',
    answer: () => ({ envelope: { result: '0x7b' } }),
    run: (c) => c.getBalance(EthereumAddress(ADDRESS_A), 100),
  },
  {
    name: 'logs over a range the RPC splits, with the limit sent without jsonrpc',
    answer: (call) => {
      const { fromBlock, toBlock } = call.params[0] as Record<string, string>
      if (Number(toBlock) - Number(fromBlock) > 100) {
        return {
          envelope: {
            error: { code: -32005, message: 'Log response size exceeded' },
          },
        }
      }
      return { result: [log(Number(fromBlock))] }
    },
    run: (c) => c.getLogs(1, 800),
  },
  {
    name: 'a call answered after a body that is not JSON',
    answer: (_, i) =>
      i === 0 ? { status: 200, body: '<html>busy</html>' } : { result: '0x7b' },
    run: (c) => c.getBalance(EthereumAddress(ADDRESS_A), 100),
  },
  {
    name: 'a batch answered after a body that is not JSON',
    answer: (call, _, request) =>
      request === 0
        ? { status: 200, body: '<html>busy</html>' }
        : { result: receipt(String(call.params[0])) },
    run: (c) => c.getTransactionReceipts([HASH_A, HASH_B]),
  },
  {
    name: 'a batch in which the RPC fails one call',
    answer: (call) =>
      call.params[0] === HASH_B
        ? { error: { code: -32000, message: 'header not found' } }
        : { result: receipt(HASH_A) },
    run: (c) => c.getTransactionReceipts([HASH_A, HASH_B]),
    fails: true,
  },
  {
    name: 'multicall in 8 batches while every 5th request is refused',
    answer: refuseEvery(5, (call) => ({
      result: (call.params[0] as Record<string, string>).input,
    })),
    run: (c) =>
      c.multicall(
        Array.from({ length: 16 }, (_, i) => callParams(i + 1)),
        1500,
      ),
    multicall: true,
    retryStrategy: 'SCRIPT',
    refusesAnyOf: true,
  },
  {
    name: 'logs over a range the RPC splits while every 5th request is refused',
    answer: refuseEvery(5, (call) => {
      const { fromBlock, toBlock } = call.params[0] as Record<string, string>
      if (Number(toBlock) - Number(fromBlock) > 100) {
        return {
          error: { code: -32005, message: 'Log response size exceeded' },
        }
      }
      return { result: [log(Number(fromBlock))] }
    }),
    run: (c) => c.getLogs(1, 800),
    retryStrategy: 'SCRIPT',
    refusesAnyOf: true,
  },
  {
    name: 'receipts in a batch refused once',
    answer: refuseEvery(
      2,
      (call) => ({
        result: receipt(String(call.params[0])),
      }),
      0,
    ),
    run: (c) => c.getTransactionReceipts([HASH_A, HASH_B]),
  },
  {
    name: 'block timestamps in a batch refused once',
    answer: refuseEvery(
      2,
      (call) => ({
        result: block(Number(call.params[0])),
      }),
      0,
    ),
    run: (c) => c.getBlockTimestamps([1, 2, 3]),
  },
]

describe('RpcClient and RpcClientCompat parity', () => {
  for (const testCase of CASES) {
    it(testCase.name, async () => {
      const old = await runOn(testCase, createOld)
      const compat = await runOn(testCase, createCompat)

      // A split range is asked for in parallel, in no set order
      if (testCase.refusesAnyOf) {
        expect(new Set(compat.calls)).toEqual(new Set(old.calls))
        expect(compat.calls.length).toEqual(old.calls.length)
      } else {
        expect(compat.calls).toEqualUnsorted(old.calls)
      }
      expect(compat.requests).toEqual(old.requests)
      if (testCase.fails) {
        expect(old.error).not.toEqual(undefined)
        expect(compat.error).not.toEqual(undefined)
        expect(compat.error instanceof NotFoundOnRpcError).toEqual(
          testCase.onlyCompatNotFound ||
            old.error instanceof NotFoundOnRpcError,
        )
      } else {
        expect(old.error).toEqual(undefined)
        expect(compat.error).toEqual(undefined)
        expect(compat.value).toEqual(old.value)
      }
    })
  }

  it('both name a revert in the error, as callWithOptionalMulticall reads', async () => {
    const revert = CASES.find((c) => c.name === 'a reverted eth_call')
    if (!revert) throw new Error('Missing case')
    for (const create of [createOld, createCompat]) {
      const { error } = await runOn(revert, create)
      expect((error as Error).message.toLowerCase()).toInclude('revert')
    }
  })
})

type Create = (
  url: string,
  retryStrategy: RetryHandlerVariant,
  multicallClient?: MulticallV3Client,
) => IRpcClient

const createOld: Create = (url, retryStrategy, multicallClient) =>
  new RpcClient({
    url,
    chain: 'chain',
    http: new HttpClient(),
    logger: Logger.SILENT,
    callsPerMinute: 600_000,
    retryStrategy,
    multicallClient,
  })

const createCompat: Create = (url, retryStrategy, multicallClient) =>
  RpcClientCompat.create({
    url,
    chain: 'chain',
    http: new HttpClient(),
    logger: Logger.SILENT,
    callsPerMinute: 600_000,
    retryStrategy,
    multicallClient,
  })

/** Refuses every `n`th HTTP request with 429, counting from `first` */
function refuseEvery(
  n: number,
  answer: Case['answer'],
  first = n - 1,
): Case['answer'] {
  return (call, index, request) =>
    request % n === first
      ? { status: 429, body: 'Too Many Requests' }
      : answer(call, index, request)
}

/** Two calls per batch; a batch's answer is its calldata, read back as one result */
class StubMulticall extends MulticallV3Client {
  constructor() {
    super(EthereumAddress(ADDRESS_B), 1000, 2)
  }

  override encodeBatches(requests: CallParameters[]): CallParameters[] {
    const batches: CallParameters[] = []
    for (let i = 0; i < requests.length; i += 2) {
      const [first, second] = requests.slice(i, i + 2)
      if (!first) continue
      const input = second ? first.input.concat(second.input) : first.input
      batches.push({ to: this.address, input })
    }
    return batches
  }

  override decode(result: Bytes) {
    return [{ success: true, data: result }]
  }
}

async function runOn(testCase: Case, create: Create) {
  const calls: string[] = []
  let requests = 0
  const result = await withServer(
    (req, res) => {
      let body = ''
      req.on('data', (chunk) => {
        body += chunk
      })
      req.on('end', () => {
        requests++
        const request = JSON.parse(body)
        const batch: { id: unknown; method: string; params: unknown[] }[] =
          Array.isArray(request) ? request : [request]
        const answers = batch.map((call) => {
          calls.push(`${call.method}(${JSON.stringify(call.params)})`)
          return {
            id: call.id,
            answer: testCase.answer(call, calls.length - 1, requests - 1),
          }
        })
        const http = answers.find(({ answer }) => 'status' in answer)?.answer
        if (http && 'status' in http) {
          res.statusCode = http.status
          res.end(http.body)
          return
        }
        const envelopes = answers.map(({ id, answer }) =>
          'envelope' in answer
            ? { id, ...answer.envelope }
            : { jsonrpc: '2.0', id, ...answer },
        )
        res.setHeader('Content-Type', 'application/json')
        res.end(
          JSON.stringify(Array.isArray(request) ? envelopes : envelopes[0]),
        )
      })
    },
    (url) =>
      testCase
        .run(
          create(
            url,
            testCase.retryStrategy ?? 'TEST',
            testCase.multicall ? new StubMulticall() : undefined,
          ),
        )
        .then((value) => ({ value: plain(value), error: undefined }))
        .catch((error: unknown) => ({ value: undefined, error })),
  )
  return { ...result, calls: calls.map(sameMeaning), requests }
}

/**
 * Differences in the request that nodes read the same way. RpcClient sends
 * `address: []` and `topics: []` for a filter it was not given, where
 * RpcClientCompat leaves them out. RpcClientCompat sends eth_call's calldata
 * as `data` too, for nodes that read no `input` (pre-Bedrock Optimism).
 */
function sameMeaning(call: string) {
  const open = call.indexOf('(')
  const method = call.slice(0, open)
  const params = JSON.parse(call.slice(open + 1, -1)) as unknown[]
  const first = params[0]
  if (typeof first === 'object' && first !== null && !Array.isArray(first)) {
    const object = first as Record<string, unknown>
    const kept = Object.entries(object).filter(([key, value]) => {
      if (method === 'eth_getLogs' && (key === 'address' || key === 'topics')) {
        return !(Array.isArray(value) && value.length === 0)
      }
      return !(
        method === 'eth_call' &&
        key === 'data' &&
        value === object.input
      )
    })
    params[0] = Object.fromEntries(kept.sort(([a], [b]) => a.localeCompare(b)))
  }
  return `${method}(${JSON.stringify(params)})`
}

/** Drops keys set to undefined, which only one of the clients writes */
function plain(value: unknown): unknown {
  if (value instanceof Map) {
    return new Map([...value].map(([k, v]) => [k, plain(v)]))
  }
  if (Array.isArray(value)) {
    return value.map(plain)
  }
  if (value instanceof Bytes) {
    return value.toString()
  }
  if (typeof value === 'object' && value !== null) {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => [k, plain(v)]),
    )
  }
  return value
}

function block(number: number) {
  return {
    number: hex(number),
    hash: '0x' + number.toString(16).padStart(64, '0'),
    parentHash:
      '0x' +
      Math.max(number - 1, 0)
        .toString(16)
        .padStart(64, '0'),
    nonce: '0x0000000000000000',
    sha3Uncles: '0x' + '1d'.repeat(32),
    logsBloom: '0x' + '00'.repeat(256),
    transactionsRoot: '0x' + '01'.repeat(32),
    stateRoot: '0x' + '02'.repeat(32),
    receiptsRoot: '0x' + '03'.repeat(32),
    miner: ADDRESS_B,
    difficulty: '0x0',
    totalDifficulty: '0x0',
    extraData: '0x',
    size: '0x220',
    gasLimit: '0x1c9c380',
    gasUsed: '0x5208',
    timestamp: hex(number * 12),
    mixHash: '0x' + '04'.repeat(32),
    baseFeePerGas: '0x3b9aca00',
    withdrawalsRoot: '0x' + '05'.repeat(32),
    withdrawals: [
      {
        index: '0x1',
        validatorIndex: '0x2',
        address: ADDRESS_A,
        amount: '0x3',
      },
    ],
    blobGasUsed: '0x0',
    excessBlobGas: '0x0',
    parentBeaconBlockRoot: '0x' + '06'.repeat(32),
    uncles: [],
    transactions: [HASH_A],
  }
}

function txBase() {
  return {
    blockHash: '0x' + '64'.padStart(64, '0'),
    blockNumber: '0x64',
    from: ADDRESS_A,
    gas: '0x5208',
    hash: HASH_A,
    input: '0x1234',
    nonce: '0x1',
    to: ADDRESS_B,
    transactionIndex: '0x0',
    value: '0xde0b6b3a7640000',
    v: '0x1',
    r: '0x' + '07'.repeat(32),
    s: '0x' + '08'.repeat(32),
  }
}

function eip1559Tx() {
  return {
    ...txBase(),
    type: '0x2',
    chainId: '0x1',
    maxFeePerGas: '0x77359400',
    maxPriorityFeePerGas: '0x3b9aca00',
    gasPrice: '0x3b9aca00',
    accessList: [],
    yParity: '0x1',
  }
}

function contractCreationTx() {
  return {
    ...txBase(),
    hash: HASH_B,
    to: null,
    type: '0x0',
    gasPrice: '0x3b9aca00',
    value: '0x0',
  }
}

function blobTx() {
  return {
    ...eip1559Tx(),
    type: '0x3',
    maxFeePerBlobGas: '0x1',
    blobVersionedHashes: ['0x01' + '09'.repeat(31)],
  }
}

function opDepositTx() {
  return {
    ...txBase(),
    type: '0x7e',
    gasPrice: '0x0',
    v: '0x0',
    r: '0x0',
    s: '0x0',
    sourceHash: '0x' + '0a'.repeat(32),
    mint: '0x0',
    isSystemTx: false,
  }
}

function zkSyncTx() {
  const { v: _v, r: _r, s: _s, ...rest } = txBase()
  return { ...rest, type: '0xff', gasPrice: '0x1' }
}

function receipt(transactionHash: string) {
  return {
    transactionHash,
    transactionIndex: '0x0',
    blockHash: '0x' + '64'.padStart(64, '0'),
    blockNumber: '0x64',
    from: ADDRESS_A,
    to: ADDRESS_B,
    cumulativeGasUsed: '0x5208',
    effectiveGasPrice: '0x3b9aca00',
    gasUsed: '0x5208',
    contractAddress: null,
    logs: [
      {
        ...log(100),
        transactionHash,
      },
    ],
    logsBloom: '0x' + '00'.repeat(256),
    type: '0x2',
    status: '0x1',
  }
}

function log(blockNumber: number, extra: Record<string, unknown> = {}) {
  return {
    removed: false,
    logIndex: hex(blockNumber % 7),
    transactionIndex: '0x0',
    transactionHash: HASH_A,
    blockHash: '0x' + blockNumber.toString(16).padStart(64, '0'),
    blockNumber: hex(blockNumber),
    address: ADDRESS_A,
    data: '0x' + '00'.repeat(32),
    topics: [TOPIC],
    ...extra,
  }
}

function feeHistory() {
  return {
    oldestBlock: '0x63',
    baseFeePerGas: ['0x1', '0x2', '0x3'],
    gasUsedRatio: [0.5, 0.6],
    baseFeePerBlobGas: ['0x1', '0x1', '0x1'],
    blobGasUsedRatio: [0.1, 0.2],
  }
}

function callParams(n = 0x12345678) {
  return { to: EthereumAddress(ADDRESS_B), input: Bytes.fromNumber(n) }
}

function hex(n: number) {
  return `0x${n.toString(16)}`
}
