import { RateLimiter } from '@l2beat/backend-tools'
import type { HttpClient } from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'
import { chain } from 'stream-chain'
import { parser } from 'stream-json'
import { pick } from 'stream-json/filters/Pick'
import { streamValues } from 'stream-json/streamers/StreamValues'
import { createGzip } from 'zlib'

interface QuickNodeClientOpts {
  callsPerMinute?: number
}

type Hex = `0x${string}`

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
    const response = await this.httpClient.fetchRaw(
      `${
        this.url
      }/eth/v1/beacon/states/${stateId}/validators?${new URLSearchParams({
        ...(id ? { id: id.map((x) => x.toString()).join(',') } : {}),
        ...(status ? { status: status.join(',') } : {}),
      }).toString()}`,
      {
        headers: {
          'Accept-Encoding': 'gzip',
        },
      },
    )

    assert(
      response.ok,
      `QuickNode getValidators request failed with status: ${response.status}`,
    )

    const pipeline = chain([
      createGzip(),
      // biome-ignore lint/suspicious/noExplicitAny: the types don't match, but it should be fine
      response.body as any,
      parser(),
      pick({ filter: /^data\.\d+\.balance/ }),
      streamValues(),
    ])

    let effectiveBalance = 0n

    for await (const { value } of pipeline) {
      // gwei to wei
      effectiveBalance += BigInt(value) * 10n ** 9n
    }

    return {
      totalStake: effectiveBalance,
      thresholdStake: (effectiveBalance * 200n) / 300n,
    }
  }
}
