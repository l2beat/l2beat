import { EthereumAddress } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import type { Http } from './Http'

export type BlockParameter =
  | bigint
  | 'earliest'
  | 'latest'
  | 'safe'
  | 'finalized'
  | 'pending'

export interface TransactionParameter {
  from?: EthereumAddress
  to: EthereumAddress
  gas?: bigint
  gasPrice?: bigint
  value?: bigint
  input?: string
}

export interface FilterParameter {
  fromBlock?: BlockParameter
  toBlock?: BlockParameter
  address?: EthereumAddress
  topics?: (string | null | (string | null)[])[]
  blockHash?: string
}

export class EthRpcClient {
  constructor(
    private http: Http,
    private url: string,
    private nextId: () => string | number = randomId,
  ) {}

  async chainId(): Promise<bigint> {
    const data = await this._call('eth_chainId')
    return vQuantity.parse(data)
  }

  async blockNumber(): Promise<bigint> {
    const data = await this._call('eth_blockNumber')
    return vQuantity.parse(data)
  }

  async gasPrice(): Promise<bigint> {
    const data = await this._call('eth_gasPrice')
    return vQuantity.parse(data)
  }

  async getBalance(
    address: EthereumAddress,
    block: BlockParameter,
  ): Promise<bigint> {
    const data = await this._call('eth_getBalance', [
      address,
      encodeBlock(block),
    ])
    return vQuantity.parse(data)
  }

  async getStorageAt(
    address: EthereumAddress,
    position: bigint,
    block: BlockParameter,
  ): Promise<string> {
    const data = await this._call('eth_getStorageAt', [
      address,
      encodeQuantity(position),
      encodeBlock(block),
    ])
    return Bytes32Response.parse(data)
  }

  async getTransactionCount(
    address: EthereumAddress,
    block: BlockParameter,
  ): Promise<bigint> {
    const data = await this._call('eth_getTransactionCount', [
      address,
      encodeBlock(block),
    ])
    return vQuantity.parse(data)
  }

  async getBlockTransactionCountByHash(hash: string): Promise<bigint> {
    const data = await this._call('eth_getBlockTransactionCountByHash', [hash])
    return vQuantity.parse(data)
  }

  async getBlockTransactionCountByNumber(
    block: BlockParameter,
  ): Promise<bigint> {
    const data = await this._call('eth_getBlockTransactionCountByNumber', [
      encodeBlock(block),
    ])
    return vQuantity.parse(data)
  }

  async getCode(
    address: EthereumAddress,
    block: BlockParameter,
  ): Promise<string> {
    const data = await this._call('eth_getCode', [address, encodeBlock(block)])
    return BytesResponse.parse(data)
  }

  async sendRawTransaction(signedTransaction: string): Promise<string> {
    const data = await this._call('eth_sendRawTransaction', [signedTransaction])
    return Bytes32Response.parse(data)
  }

  async call(
    transaction: TransactionParameter,
    block: BlockParameter,
  ): Promise<{ reverted: false; data: string } | { reverted: true }> {
    let data: unknown
    try {
      data = await this._call('eth_call', [
        encodeTransaction(transaction),
        encodeBlock(block),
      ])
    } catch (e) {
      if (
        e instanceof Error &&
        e.message.startsWith('RPC call failed') &&
        (e.message.includes('invalid opcode: INVALID') ||
          e.message.includes('CALL_EXCEPTION') ||
          e.message.includes('revert') ||
          e.message.includes('reverted'))
      ) {
        return { reverted: true }
      }
      throw e
    }
    const result = BytesResponse.parse(data)
    return { reverted: false, data: result }
  }

  async estimateGas(
    transaction: TransactionParameter,
    block: BlockParameter,
  ): Promise<{ reverted: boolean; estimate: bigint }> {
    const data = await this._call('eth_estimateGas', [
      encodeTransaction(transaction),
      encodeBlock(block),
    ])
    // TODO: handle revert
    const result = vQuantity.parse(data)
    return { reverted: false, estimate: result }
  }

  async getBlockByHash(hash: string): Promise<RpcBlock | null> {
    const data = await this._call('eth_getBlockByHash', [hash, false])
    return BlockResponse.parse(data)
  }

  async getBlockByNumber(block: BlockParameter): Promise<RpcBlock | null> {
    const data = await this._call('eth_getBlockByNumber', [
      encodeBlock(block),
      false,
    ])
    return BlockResponse.parse(data)
  }

  async getBlockWithTransactionsByHash(
    hash: string,
  ): Promise<RpcBlockWithTransactions | null> {
    const data = await this._call('eth_getBlockByHash', [hash, true])
    return BlockWithTransactionsResponse.parse(data)
  }

  async getBlockWithTransactionsByNumber(
    block: BlockParameter,
  ): Promise<RpcBlockWithTransactions | null> {
    const data = await this._call('eth_getBlockByNumber', [
      encodeBlock(block),
      true,
    ])
    return BlockWithTransactionsResponse.parse(data)
  }

  async getTransactionByHash(hash: string): Promise<RpcTransaction | null> {
    const data = await this._call('eth_getTransactionByHash', [hash])
    return TransactionResponse.parse(data)
  }

  async getTransactionByBlockHashAndIndex(
    hash: string,
    index: bigint,
  ): Promise<RpcTransaction | null> {
    const data = await this._call('eth_getTransactionByBlockHashAndIndex', [
      hash,
      encodeQuantity(index),
    ])
    return TransactionResponse.parse(data)
  }

  async getTransactionByBlockNumberAndIndex(
    block: BlockParameter,
    index: bigint,
  ): Promise<RpcTransaction | null> {
    const data = await this._call('eth_getTransactionByBlockNumberAndIndex', [
      encodeBlock(block),
      encodeQuantity(index),
    ])
    return TransactionResponse.parse(data)
  }

  async getTransactionReceipt(hash: string): Promise<RpcReceipt | null> {
    const data = await this._call('eth_getTransactionReceipt', [hash])
    return ReceiptResponse.parse(data)
  }

  async getLogs(filter: FilterParameter): Promise<RpcLog[]> {
    const data = await this._call('eth_getLogs', [encodeFilter(filter)])
    return LogsResponse.parse(data)
  }

  private async _call(method: string, params: unknown = []) {
    const id = this.nextId()
    const response = await this.http.fetch(this.url, {
      body: JSON.stringify({
        jsonrpc: '2.0',
        id,
        method,
        params,
      }),
      headers: { 'Content-Type': 'application/json' },
    })
    let data: unknown
    let jsonSuccess = true
    try {
      data = JSON.parse(response.body)
    } catch {
      jsonSuccess = false
    }
    const parsed = JsonRpcResponse.safeValidate(data)
    if (!jsonSuccess || !parsed.success) {
      throw new Error(
        `RPC call failed. HTTP status: ${response.status}, body: ${response.body}`,
      )
    }
    const envelope = parsed.data
    if ('error' in envelope) {
      throw new Error(
        `RPC call failed. RPC code: ${envelope.error.code}, message: ${envelope.error.message}`,
      )
    }
    if (envelope.id !== id) {
      throw new Error('RPC call failed. ID mismatch.')
    }
    return envelope.result
  }
}

function encodeBlock(block: BlockParameter) {
  if (typeof block === 'string') {
    return block
  }
  return encodeQuantity(block)
}

function encodeQuantity(value: bigint) {
  if (value < 0) {
    throw new Error('Cannot encode a negative QUANTITY.')
  }
  return `0x${value.toString(16)}`
}

function encodeTransaction(transaction: TransactionParameter) {
  const encoded: Record<string, string> = {}
  if (transaction.from) {
    encoded.from = transaction.from
  }
  encoded.to = transaction.to
  if (transaction.gas !== undefined) {
    encoded.gas = encodeQuantity(transaction.gas)
  }
  if (transaction.gasPrice !== undefined) {
    encoded.gasPrice = encodeQuantity(transaction.gasPrice)
  }
  if (transaction.value !== undefined) {
    encoded.value = encodeQuantity(transaction.value)
  }
  if (transaction.input !== undefined) {
    encoded.input = transaction.input
  }
  return encoded
}

function encodeFilter(filter: FilterParameter) {
  const encoded: Record<string, unknown> = {}
  if (filter.fromBlock) {
    encoded.fromBlock = encodeBlock(filter.fromBlock)
  }
  if (filter.toBlock) {
    encoded.toBlock = encodeBlock(filter.toBlock)
  }
  if (filter.address) {
    encoded.address = filter.address
  }
  if (filter.topics) {
    encoded.topics = filter.topics
  }
  if (filter.blockHash) {
    encoded.blockHash = filter.blockHash
  }
}

const vQuantity = v.string().transform((value: string) => {
  if (/^0x[\da-f]+$/i.test(value)) {
    return BigInt(value)
  }
  throw new Error('Cannot decode QUANTITY.')
})

const vData = (length?: number) => v.string().transform(normalizeHex(length))
const vAddress = v.string().transform(EthereumAddress)

function normalizeHex(length?: number) {
  return function (value: string) {
    if (!/^0x[\da-f]*$/i.test(value) || value.length % 2 !== 0) {
      throw new Error('Invalid hex value.')
    }
    if (length !== undefined && value.length !== length * 2 + 2) {
      throw new Error('Invalid hex value length.')
    }
    return value.toLowerCase()
  }
}

const blockBase = {
  number: v.union([v.null(), vQuantity]),
  hash: v.union([v.null(), vData(32)]),
  parentHash: vData(32),
  nonce: v.union([v.null(), vData(8), v.literal('0x0')]),
  sha3Uncles: vData(32),
  logsBloom: vData(256),
  transactionsRoot: vData(32),
  stateRoot: vData(32),
  receiptsRoot: vData(32),
  miner: vAddress,
  difficulty: vQuantity,
  totalDifficulty: vQuantity,
  extraData: vData(),
  size: vQuantity,
  gasLimit: vQuantity,
  gasUsed: vQuantity,
  timestamp: vQuantity,
  uncles: v.array(vData(32)),
  // TODO: non-standard fields from other chains
}

export type RpcBlock = v.infer<typeof RpcBlock>
const RpcBlock = v.object({
  ...blockBase,
  transactions: v.array(vData(32)),
})

export type RpcTransaction = v.infer<typeof RpcTransaction>
const RpcTransaction = v.object({
  blockHash: v.union([v.null(), vData(32)]),
  blockNumber: v.union([v.null(), vQuantity]),
  from: vAddress,
  gas: vQuantity,
  gasPrice: vQuantity,
  hash: vData(32),
  input: vData(),
  nonce: vQuantity,
  to: v.union([v.null(), vAddress]),
  transactionIndex: v.union([v.null(), vQuantity]),
  value: vQuantity,
  v: vQuantity,
  r: vQuantity,
  s: vQuantity,
  // TODO: non-standard fields from other chains
})

export type RpcBlockWithTransactions = v.infer<typeof RpcBlockWithTransactions>
const RpcBlockWithTransactions = v.object({
  ...blockBase,
  transactions: v.array(RpcTransaction),
})

export type RpcLog = v.infer<typeof RpcLog>
const RpcLog = v.object({
  removed: v.boolean(),
  logIndex: v.union([v.null(), vQuantity]),
  transactionIndex: v.union([v.null(), vQuantity]),
  transactionHash: v.union([v.null(), vData(32)]),
  blockHash: v.union([v.null(), vData(32)]),
  blockNumber: v.union([v.null(), vQuantity]),
  address: vAddress,
  data: vData(),
  topics: v.array(vData(32)),
  // TODO: non-standard fields from other chains
})

export type RpcReceipt = v.infer<typeof RpcReceipt>
const RpcReceipt = v.object({
  transactionHash: vData(32),
  transactionIndex: vQuantity,
  blockHash: vData(32),
  blockNumber: vQuantity,
  from: vAddress,
  to: v.union([v.null(), vAddress]),
  cumulativeGasUsed: vQuantity,
  effectiveGasPrice: vQuantity,
  gasUsed: vQuantity,
  contractAddress: v.union([v.null(), vAddress]),
  logs: v.array(RpcLog),
  logsBloom: vData(256),
  type: vQuantity,
  root: vData(32).optional(),
  status: vQuantity.optional(),
  // TODO: non-standard fields from other chains
})

const Bytes32Response = vData(32)
const BytesResponse = vData()
const TransactionResponse = v.union([v.null(), RpcTransaction])
const BlockResponse = v.union([v.null(), RpcBlock])
const BlockWithTransactionsResponse = v.union([
  v.null(),
  RpcBlockWithTransactions,
])
const ReceiptResponse = v.union([v.null(), RpcReceipt])
const LogsResponse = v.array(RpcLog)

const JsonRpcResponse = v.union([
  v.strictObject({
    jsonrpc: v.literal('2.0'),
    error: v.strictObject({
      code: v.number(),
      message: v.string(),
      data: v.unknown().optional(),
    }),
    id: v.union([v.null(), v.string(), v.number()]),
  }),
  v.strictObject({
    jsonrpc: v.literal('2.0'),
    result: v.unknown(),
    id: v.union([v.null(), v.string(), v.number()]),
  }),
])

const alphabet =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
function randomId() {
  let id = ''
  for (let i = 0; i < 8; i++) {
    id += alphabet[Math.floor(Math.random() * alphabet.length)]
  }
  return id
}
