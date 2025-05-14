import { writeFileSync } from 'fs'
import { HttpClient } from '@l2beat/shared'
import { type Type, command, option, positional } from 'cmd-ts'
import { z } from 'zod'
import { HttpUrl } from './types'

export const StarknetAddressValue: Type<string, string> = {
  async from(str): Promise<string> {
    return new Promise((resolve, _) => {
      const address = str.startsWith('0x') ? str.slice(2) : str

      const isValidHex = /^[0-9a-fA-F]{64}$/.test(address)

      if (!isValidHex) {
        throw new Error(
          `Invalid Starknet address: ${str}. Must be a 64-character hex string with optional 0x prefix.`,
        )
      }

      resolve(`0x${address.toLowerCase()}`)
    })
  },
}

export const StarknetEvents = command({
  name: 'starknet-events',
  description: 'Fetch events from starknet',
  args: {
    address: positional({
      type: StarknetAddressValue,
    }),
    endpoint: option({
      type: HttpUrl,
      long: 'endpoint',
      short: 'e',
    }),
  },
  handler: async (args) => {
    const httpClient = new HttpClient()
    const client = new StarknetClient(args.endpoint, httpClient)

    const highestBlock = await client.getBlockNumber()
    const responseJson = await client.getLogs(0, highestBlock, args.address, [
      '0x10f262273ceaa52776e74b306e33ad0b9e1b4051ae2efdfd782bc4569b421cf',
      '0xa5939adc9600c99eba18c0760fc0884d52129df955922bb7f3a114485b4606',
      '0xcfefac9fac087f5372e9e1f677824f7420c3261eaf33ba240b836cd570e152',
      '0x3da438fe76a955cfd731f2521594d43baae6615852ab7fd9099dc0709b8f75b',
      '0x38a81c7fd04bac40e22e3eab2bcb3a09398bba67d0c5a263c6665c9c0b13a3',
      '0x7633a8d8b49c5c6002a1329e2c9791ea2ced86e06e01e17b5d0d1d5312c792',
      '0x34bb683f971572e1b0f230f3dd40f3dbcee94e0b3e3261dd0a91229a1adc4b7',
      '0xd1831486d8c46712712653f17d3414869aa50b4c16836d0b3d4afcfeafa024',
      '0x9d4a59b844ac9d98627ddba326ab3707a7d7e105fd03c777569d0f61a91f1e',
      '0x2842fd3b01bb0858fef6a2da51cdd9f995c7d36d7625fb68dd5d69fcc0a6d76',
      '0x2b23b0c08c7b22209aea4100552de1b7876a49f04ee5a4d94f83ad24bc4ec1c',
      '0x1f9961b3744c1e017cbcfafecec635be98ae8c6aeb9f70be5b7e93f2f52e2e5',
      '0xf98c2e7c652ac3805eb73ff089b53a4b501f8e2d750a6131f474d71d49fef8',
      '0x209ff368803f5de65188245078e888d4462f8d98697699c1dcdd8b02ffb250f',
      '0x198116a5c5421876feb02bdb0b472ace223bdde3dbd87f92db8d735a233fbb0',
      '0x3ae95723946e49d38f0cf844cef1fb25870e9a74999a4b96271625efa849b4c',
      '0x2d8a82390cce552844e57407d23a1e48a38c4b979d525b1673171e503e116ab',
      '0x20e4d3438ce3d451a0b4c17cdcbdd5aef2ba11c5b28a2d65353f91db3eb26dd',
      '0xf73e08374e6098adb9600916577e3311612674306f1c2e3fe239a4576ad157',
      '0x36d743b501f1ce191c02b6bd687c6790def364974947f206de67805a5d0d794',
      '0xa3eac89d22258ea63a7f47b0be3c559c6177eb4d7fe6641b109da1e1272d60',
      '0x2143175c365244751ccde24dd8f54f934672d6bc9110175c9e58e1e73705531',
      '0x25e2d538533284b9d61dfe45b9aaa563d33ef8374d9bb26d77a009b8e21f0de',
      '0x1d6c15800e6da7a5556b49a824ea4b70c1169d71092c1a4c5d80aaadc6636d1',
      '0x2eb7ab861b6ade361ff0e949e94d48fd5b2052639b40cfe9f796f2bb7864f45',
      '0xde2aa78658531ebb6d1125461e139734c22e0d3045a3a44366066a2756070e',
      '0x2642a36e73652fddc2c8b6e54d2dd5396dd5385d190a121e2e1da5772dff325',
    ])

    console.log(`Found ${responseJson.events.length} events`)
    writeFileSync('events.json', JSON.stringify(responseJson, null, 2))
  },
})

const StarknetRPCResponse = z.object({
  jsonrpc: z.literal('2.0'),
  id: z.number(),
  result: z.unknown(),
})

const StarknetBlockNumberResponse = z.number()

type StarknetGetEventsResponse = z.infer<typeof StarknetGetEventsResponse>
const StarknetGetEventsResponse = z.object({
  events: z.array(
    z.object({
      block_hash: z.string(),
      block_number: z.number(),
      data: z.array(z.string()),
      from_address: z.string(),
      keys: z.array(z.string()),
      transaction_hash: z.string(),
    }),
  ),
})

class StarknetClient {
  constructor(
    private readonly endpoint: string,
    private readonly httpClient: HttpClient,
    private readonly eventBatchSize = 1_000,
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
  ): Promise<StarknetGetEventsResponse> {
    const segments = segmentRange(fromBlock, toBlock, this.eventBatchSize)

    // Process segments in batches of 25
    const results: StarknetGetEventsResponse[] = []

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
            keys: [keys],
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
    )
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

function segmentRange(
  start: number,
  end: number,
  batchSize: number,
): [number, number][] {
  if (start > end) {
    throw new Error('Start index cannot be greater than end index')
  }

  if (batchSize <= 0) {
    throw new Error('Batch size must be a positive number')
  }

  const result: [number, number][] = []

  for (let i = start; i <= end; i += batchSize) {
    const batchEnd = Math.min(i + batchSize - 1, end)
    result.push([i, batchEnd])
  }

  return result
}
