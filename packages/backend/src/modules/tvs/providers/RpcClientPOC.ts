import { randomUUID } from 'node:crypto'
import type { Logger } from '@l2beat/backend-tools'
import type { CallParameters, RpcClient } from '@l2beat/shared'
import { assert, Bytes, type EthereumAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import type {
  MulticallRequest,
  MulticallResponse,
} from '../../../peripherals/multicall/types'

const MAX_BATCH_SIZE = 100

export class RpcClientPOC {
  multicallPool: {
    id: string
    params: MulticallRequest
    blockNumber: number | 'latest'
  }[] = []
  multicallResponses: Map<string, Bytes> = new Map()

  constructor(
    private readonly rpcClient: RpcClient,
    private chain: string,
    private logger: Logger,
    /** If Multicall configured all the calls will be batched*/
    private params: {
      multicallV3?: EthereumAddress
      batchingEnabled?: boolean
    },
  ) {
    this.logger = logger.for(this).tag({ tag: chain })

    if (params.multicallV3) {
      setInterval(() => this.flushMulticall(), 1000)
    }
    if (params.batchingEnabled) {
      setInterval(() => this.flush(), 1000)
    }
  }

  async getBalance(
    holder: EthereumAddress,
    blockNumber: number | 'latest',
  ): Promise<bigint> {
    return await this.rpcClient.getBalance(holder, blockNumber)
  }

  async call(
    callParams: CallParameters,
    blockNumber: number | 'latest',
  ): Promise<Bytes> {
    if (this.params.multicallV3 && this.params.batchingEnabled) {
      throw new Error('Multicall and batching not supported together, yet')
    }

    if (this.params.multicallV3) {
      return await this.callWithMulticall(callParams, blockNumber)
    }

    if (this.params.batchingEnabled) {
      return this.callWithBatching(callParams, blockNumber)
    }

    return await this.rpcClient.call(callParams, blockNumber)
  }

  async callWithMulticall(
    callParams: CallParameters,
    blockNumber: number | 'latest',
  ): Promise<Bytes> {
    const id = randomUUID()
    this.logger.trace(`Adding to multicall pool ${id}`)
    assert(callParams.data)
    this.multicallPool.push({
      id,
      params: {
        address: callParams.to,
        data: callParams.data,
      },
      blockNumber,
    })

    let response = this.multicallResponses.get(id)
    while (response === undefined) {
      this.logger.trace(`Waiting ${id}`)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      response = this.multicallResponses.get(id)
      this.multicallResponses.delete(id)
    }

    return response
  }

  async flushMulticall() {
    assert(this.params.multicallV3, `Missing MulticallV3 address`)

    if (this.multicallPool.length === 0) {
      this.logger.trace('Nothing to flush...')
      return
    }

    this.logger.trace(`Flushing multicall [${this.pool.length}]...`)
    const queries = [...this.multicallPool]
    this.multicallPool = []

    const batches = toBatches(queries, MAX_BATCH_SIZE)

    const promises = batches.map(async (batch, index) => {
      const blockNumber = batch[0].blockNumber
      this.logger.trace(
        `Fetching batch [${index}] of ${batch.length} calls for block ${blockNumber}`,
      )
      // TODO: add pools per block number
      const encoded = encodeBatch(batch.map((b) => b.params))
      this.logger.trace(`encoded [${index}] ${encoded}`)
      assert(this.params.multicallV3, `Missing MulticallV3 address`)
      const response = await this.rpcClient.call(
        { to: this.params.multicallV3, data: encoded },
        blockNumber,
      )
      const decoded = decodeBatch(response)
      this.logger.trace(`decoded [${index}] ${decoded}`)
      for (const [index, query] of batch.entries()) {
        this.logger.trace(`Setting ${query.id} - ${decoded[index].data}`)
        this.multicallResponses.set(query.id, decoded[index].data)
      }
    })

    await Promise.all(promises)
  }

  // Batchin PoC
  pool: {
    id: string
    params: CallParameters
    blockNumber: number | 'latest'
  }[] = []
  responses: Map<string, Bytes> = new Map()

  async callWithBatching(
    callParams: CallParameters,
    blockNumber: number | 'latest',
  ): Promise<Bytes> {
    const id = randomUUID()
    this.logger.trace(`Adding to pool ${id}`)
    this.pool.push({ id, params: callParams, blockNumber })

    let response = this.responses.get(id)
    while (response === undefined) {
      this.logger.trace(`Waiting ${id}`)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      response = this.responses.get(id)
      this.responses.delete(id)
    }

    return response
  }

  async flush() {
    if (this.pool.length === 0) {
      this.logger.trace('Nothing to flush...')
      return
    }

    this.logger.trace(`Flushing [${this.pool.length}]...`)
    const queries = [...this.pool]
    this.pool = []

    const batches = toBatches(queries, MAX_BATCH_SIZE)

    const promises = batches.map(async (batch, index) => {
      this.logger.trace(`Fetching batch [${index}] of ${batch.length} calls`)
      const r = await this.rpcClient.batchCall(batch)
      for (const [index, query] of batch.entries()) {
        this.logger.trace(`Setting ${query.id} - ${r[index]}`)
        this.responses.set(query.id, r[index])
      }
    })

    await Promise.all(promises)
  }
}

function toBatches<T>(items: T[], batchSize: number): T[][] {
  const batches: T[][] = []
  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize))
  }
  return batches
}

const multicallInterface = new utils.Interface([
  'function multicall(tuple(address, bytes)[] memory calls) public returns (bytes[] memory results)',
  'function aggregate(tuple(address target, bytes callData)[] calls) public returns (uint256 blockNumber, bytes[] returnData)',
  'function tryAggregate(bool requireSuccess, tuple(address target, bytes callData)[] calls) public returns (tuple(bool success, bytes returnData)[] returnData)',
])

function encodeBatch(requests: MulticallRequest[]) {
  const string = multicallInterface.encodeFunctionData('tryAggregate', [
    false,
    requests.map((request) => [
      request.address.toString(),
      request.data.toString(),
    ]),
  ])
  return Bytes.fromHex(string)
}

function decodeBatch(result: Bytes) {
  const decoded = multicallInterface.decodeFunctionResult(
    'tryAggregate',
    result.toString(),
  )
  const values = decoded[0] as [boolean, string][]
  return values.map(([success, data]): MulticallResponse => {
    const bytes = Bytes.fromHex(data)
    return {
      success: success && bytes.length !== 0,
      data: bytes,
    }
  })
}
