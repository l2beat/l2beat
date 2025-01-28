import { randomUUID } from 'node:crypto'
import type { Logger } from '@l2beat/backend-tools'
import type { CallParameters, RpcClient } from '@l2beat/shared'
import type { Bytes, EthereumAddress } from '@l2beat/shared-pure'

const MAX_BATCH_SIZE = 100

export class RpcClientPOC {
  isPoolBlocked = false

  pool: {
    id: string
    params: CallParameters
    blockNumber: number | 'latest'
  }[] = []

  responses: Map<string, Bytes> = new Map()

  constructor(
    private readonly rpcClient: RpcClient,
    private logger: Logger,
  ) {
    setInterval(() => this.flush(), 1000)
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
    this.pool.push({ id, params: callParams, blockNumber }) - 1

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
}

function toBatches<T>(items: T[], batchSize: number): T[][] {
  const batches: T[][] = []
  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize))
  }
  return batches
}
