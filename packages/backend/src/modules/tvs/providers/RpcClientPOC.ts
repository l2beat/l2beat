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
  isPoolBlocked = false
  pool: {
    id: string
    params: CallParameters
    blockNumber: number | 'latest'
  }[] = []
  responses: Map<string, Bytes> = new Map()

  isMulticallPoolBlocked = false
  multicallPool: {
    id: string
    params: MulticallRequest
    blockNumber: number | 'latest'
  }[] = []
  multicallResponses: Map<string, Bytes> = new Map()

  constructor(
    private readonly rpcClient: RpcClient,
    private multicallV3: EthereumAddress,
    private logger: Logger,
  ) {
    setInterval(() => this.flush(), 1000)
    setInterval(() => this.flushMulticall(), 1000)
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
    return await this.rpcClient.call(callParams, blockNumber)
  }

  async callWithBatching(
    callParams: CallParameters,
    blockNumber: number | 'latest',
  ): Promise<Bytes> {
    while (this.isPoolBlocked) {
      this.logger.debug('Waiting for pool unblock...')
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
    const id = randomUUID()
    this.logger.debug(`Adding to pool ${id}`)
    this.pool.push({ id, params: callParams, blockNumber })

    let response = this.responses.get(id)
    while (response === undefined) {
      this.logger.debug(`Waiting ${id}`)
      response = this.responses.get(id)
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    return response
  }

  async flush() {
    if (this.pool.length === 0) {
      this.logger.debug('Nothing to flush...')
      return
    }

    this.isPoolBlocked = true
    this.logger.debug(`Flushing [${this.pool.length}]...`)
    const queries = [...this.pool]
    this.pool = []
    this.isPoolBlocked = false

    const batches = toBatches(queries, MAX_BATCH_SIZE)

    const promises = batches.map(async (batch, index) => {
      this.logger.debug(`Fetching batch [${index}] of ${batch.length} calls`)
      const r = await this.rpcClient.batchCall(batch)
      for (const [index, query] of batch.entries()) {
        this.logger.debug(`Setting ${query.id} - ${r[index]}`)
        this.responses.set(query.id, r[index])
      }
    })

    await Promise.all(promises)
  }

  async callWithMulticall(
    callParams: CallParameters,
    blockNumber: number | 'latest',
  ): Promise<Bytes> {
    while (this.isMulticallPoolBlocked) {
      this.logger.debug('Waiting for multicall pool unblock...')
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
    const id = randomUUID()
    this.logger.debug(`Adding to multicall pool ${id}`)
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
      this.logger.debug(`Waiting ${id}`)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      response = this.multicallResponses.get(id)
    }

    return response
  }

  async flushMulticall() {
    if (this.multicallPool.length === 0) {
      this.logger.debug('Nothing to flush...')
      return
    }

    this.isMulticallPoolBlocked = true
    this.logger.debug(`Flushing multicall [${this.pool.length}]...`)
    const queries = [...this.multicallPool]
    this.multicallPool = []
    this.isMulticallPoolBlocked = false

    const batches = toBatches(queries, MAX_BATCH_SIZE)

    const promises = batches.map(async (batch, index) => {
      this.logger.debug(`Fetching batch [${index}] of ${batch.length} calls`)
      const blockNumber = batch[0].blockNumber
      const encoded = encodeBatch(batch.map((b) => b.params))
      const response = await this.rpcClient.call(
        { to: this.multicallV3, data: encoded },
        blockNumber,
      )
      const r = decodeBatch(response)
      for (const [index, query] of batch.entries()) {
        this.logger.debug(`Setting ${query.id} - ${r[index]}`)
        this.multicallResponses.set(query.id, r[index].data)
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
