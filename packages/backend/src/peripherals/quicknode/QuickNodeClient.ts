import { HttpClient } from '@l2beat/shared'
import { assert, RateLimiter } from '@l2beat/shared-pure'
import { Hex } from 'viem'
import { chain } from 'stream-chain'
import { parser } from 'stream-json'
import { pick } from 'stream-json/filters/Pick'
import { streamValues } from 'stream-json/streamers/StreamValues'

interface QuickNodeClientOpts {
  callsPerMinute?: number
}

export class QuickNodeClient {
  constructor(
    readonly url: string,
    private readonly httpClient: HttpClient,
    opts?: QuickNodeClientOpts,
  ) {
    if (opts?.callsPerMinute) {
      const rateLimiter = new RateLimiter({
        callsPerMinute: opts.callsPerMinute,
      })
      this.getValidatorsStake = rateLimiter.wrap(
        this.getValidatorsStake.bind(this),
      )
    }
  }

  static create(
    services: { httpClient: HttpClient },
    options: { url: string; callsPerMinute: number | undefined },
  ) {
    return new QuickNodeClient(options.url, services.httpClient, options)
  }

  async getValidatorsStake({
    id,
    stateId,
    status,
  }: {
    id?: (number | Hex)[]
    stateId: 'head' | 'gensis' | 'finalized' | 'justified' | 'slot' | Hex
    status?: string[]
  }) {
    let start = performance.now()
    // TODO: Add compression
    const response = await this.httpClient.fetch(
      `${
        this.url
      }/eth/v1/beacon/states/${stateId}/validators?${new URLSearchParams({
        ...(id ? { id: id.map((x) => x.toString()).join(',') } : {}),
        ...(status ? { status: status.join(',') } : {}),
      }).toString()}`,
    )

    assert(
      response.ok,
      `QuickNode getValidators request failed with status: ${response.status}`,
    )

    console.log(`Request took ${performance.now() - start} ms`)
    start = performance.now()

    const pipeline = chain([
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      response.body as any,
      parser(),
      pick({ filter: /^data\.\d+\.balance/ }),
      streamValues(),
    ])

    // This returns like 500 MB, so can't just zod.parse it ;)
    // We have to extract stake manually

    let effectiveBalance = 0n
    let i = 0

    for await (const { value } of pipeline) {
      i++
      effectiveBalance += BigInt(value)
      if (i % 1000 === 0) {
        console.log(`Processed ${i} validators`)
      }
    }

    console.log(`Parsing took ${performance.now() - start} ms`)

    return {
      totalStake: effectiveBalance,
      thresholdStake: (effectiveBalance * 200n) / 300n,
    }
  }
}
