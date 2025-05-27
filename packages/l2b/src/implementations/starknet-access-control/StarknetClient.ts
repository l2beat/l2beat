import type { HttpClient } from '@l2beat/shared'
import { z } from 'zod'
import { segmentRange, starknetKeccak } from './utils'

const StarknetRPCResponse = z.object({
  jsonrpc: z.literal('2.0'),
  id: z.number(),
  result: z.unknown(),
})

const StarknetBlockNumberResponse = z.number()

export type StarknetEvent = z.infer<typeof StarknetEvent>
const StarknetEvent = z.object({
  block_hash: z.string(),
  block_number: z.number(),
  data: z.array(z.string()),
  from_address: z.string(),
  keys: z.array(z.string()),
  transaction_hash: z.string(),
})

export type StarknetGetEventsResponse = z.infer<
  typeof StarknetGetEventsResponse
>
const StarknetGetEventsResponse = z.object({
  events: z.array(StarknetEvent),
})

export class StarknetClient {
  constructor(
    private readonly endpoint: string,
    private readonly httpClient: HttpClient,
    private readonly eventBatchSize = 10_000,
  ) {}

  async getBlockNumber(): Promise<number> {
    return StarknetBlockNumberResponse.parse(
      await this.call('starknet_blockNumber', []),
    )
  }

  async getLogs(
    fromBlock: number,
    toBlock: number,
    address: string,
    keys: string[],
  ): Promise<StarknetEvent[]> {
    const segments = segmentRange(fromBlock, toBlock, this.eventBatchSize)

    // Process segments in batches of 25
    const results: StarknetGetEventsResponse[] = []

    const hashedKeys = keys.map((k) =>
      k.startsWith('0x') ? k : starknetKeccak(Buffer.from(k)),
    )

    // Process segments in chunks of 25
    for (let i = 0; i < segments.length; i += 25) {
      const batchSegments = segments.slice(i, i + 25)

      const batchPromises = batchSegments.map(async ([from, to]) => {
        return await this.call('starknet_getEvents', [
          {
            chunk_size: 1000,
            from_block: { block_number: from },
            to_block: { block_number: to },
            address: address,
            keys: [hashedKeys],
          },
        ])
      })

      const batchResults = await Promise.all(batchPromises)
      const parsedBatch = batchResults.map((result) =>
        StarknetGetEventsResponse.parse(result),
      )

      results.push(...parsedBatch)
    }

    // Combine all results
    return results.reduce(
      (acc, result) => {
        return {
          events: [...acc.events, ...result.events],
        }
      },
      { events: [] },
    ).events
  }

  private async call(method: string, params: unknown[]) {
    const body = {
      jsonrpc: '2.0',
      method,
      params,
      id: 1,
    }

    const request = await this.httpClient.fetchRaw(`${this.endpoint}`, {
      compress: true,
      timeout: 0,
      body: JSON.stringify(body),
      method: 'POST',
    })

    const response = await request.json()
    return StarknetRPCResponse.parse(response).result
  }
}
