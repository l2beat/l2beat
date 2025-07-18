import { ClientCore, type ClientCoreDependencies } from '@l2beat/shared'
import type { json } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'

interface Dependencies extends ClientCoreDependencies {
  url: string
  apiToken: string
}

const EnvioLogsAndBlocksResponse = v.object({
  data: v.array(
    v.object({
      logs: v.array(
        v.object({
          transaction_hash: v.string(),
          block_number: v.number(),
          address: v.string(),
          data: v.string(),
          topic0: v.union([v.string(), v.null()]),
          topic1: v.union([v.string(), v.null()]),
          topic2: v.union([v.string(), v.null()]),
          topic3: v.union([v.string(), v.null()]),
        }),
      ),
      blocks: v.array(
        v.object({
          number: v.number(),
          timestamp: v.string(),
        }),
      ),
    }),
  ),
})

export class EnvioClient extends ClientCore {
  constructor(private readonly $: Dependencies) {
    super($)
  }

  async getAllLogsAndBlocks(fromBlock: number, toBlock: number) {
    // https://docs.envio.dev/docs/HyperSync/hypersync-query#response-structure
    const query = {
      // The block to start the query from
      from_block: fromBlock,
      // The block to end the query at (exclusive)
      to_block: toBlock + 1,
      logs: [
        {
          address: [],
          topics: [],
        },
      ],
      field_selection: {
        block: ['number', 'timestamp'],
        log: [
          'block_number',
          'address',
          'transaction_hash',
          'topic0',
          'topic1',
          'topic2',
          'topic3',
          'data',
          'timestamp',
        ],
      },
    }

    console.log(query)

    const response = await this.query(query)

    const envioResponse = EnvioLogsAndBlocksResponse.safeParse(response)
    if (!envioResponse.success) {
      this.$.logger.warn('Invalid response', {
        fromBlock,
        toBlock,
        response: JSON.stringify(response),
        message: envioResponse.message,
      })
      throw new Error(`Query <${fromBlock},${toBlock}>: Error during parsing`)
    }

    return envioResponse.data.data[0]
  }

  async query(query: json) {
    return await this.fetch(this.$.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.$.apiToken}`,
      },
      body: JSON.stringify(query),
      redirect: 'follow',
      timeout: 10_000, // Most RPCs respond in ~2s during regular conditions
    })
  }

  override validateResponse(_response: json): {
    success: boolean
    message?: string
  } {
    // const parsedError = RPCError.safeParse(response)

    // if (parsedError.success) {
    //   // TODO: based on error return differently
    //   this.$.logger.warn('Response validation error', {
    //     ...parsedError.data.error,
    //   })
    //   return { success: false }
    // }

    return { success: true }
  }
}
