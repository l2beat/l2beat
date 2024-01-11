import { RateLimiter } from '@l2beat/shared-pure'
import fetch from 'node-fetch'
import { z } from 'zod'

const internalTxSchema = z.object({
  result: z.array(z.object({ from: z.string() })),
})

export class EtherscanClient {
  apiUrl = 'https://api.etherscan.io/api'
  endpointAddress = '0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675'

  constructor(readonly apiKey: string, readonly callsPerMinute: number) {
    const rateLimiter = new RateLimiter({ callsPerMinute })
    this.call = rateLimiter.wrap(this.call.bind(this))
  }

  async fetchAllInternalTxs(start: number, end: number, batchSize: number) {
    const internalTxsPromises: Promise<{ from: string }[]>[] = []

    for (let i = start; i < end; i += batchSize) {
      const fetchedInternalTxs = this.fetchInternalTxs(
        this.endpointAddress,
        i - 1,
        i + batchSize,
      )
      internalTxsPromises.push(fetchedInternalTxs)
    }

    return (await Promise.all(internalTxsPromises)).flat()
  }

  private async fetchInternalTxs(
    address: string,
    startBlock: number,
    endBlock: number,
  ) {
    const response = await this.safeCall(
      `module=account&startblock=${startBlock}&endblock=${endBlock}&action=txlistinternal&address=${address}`,
    )

    return internalTxSchema.parse(response).result
  }

  // will retry on error
  private async safeCall(query: string) {
    let json: unknown
    let retries = 0
    const maxRetries = 5

    while (retries < maxRetries) {
      try {
        json = await this.call(query)

        if (
          json &&
          typeof json === 'object' &&
          // @ts-expect-error result is a string
          typeof json.result === 'string' &&
          // @ts-expect-error result is a string
          json.result === 'Max rate limit reached'
        ) {
          throw new Error('undefined response')
        }

        break
      } catch (error) {
        console.log('error: ', error)
        console.log('retrying...')
        retries++
      }
    }

    if (retries === maxRetries) {
      throw new Error(`Failed to fetch data for query: ${query}`)
    }

    return json
  }

  private async call(query: string) {
    const response = await fetch(
      `${this.apiUrl}?${query}&apikey=${this.apiKey}`,
    )
    const json = (await response.json()) as unknown
    return json
  }
}
