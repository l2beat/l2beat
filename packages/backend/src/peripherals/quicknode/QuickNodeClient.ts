import { HttpClient } from '@l2beat/shared'
import {
  assert,
  formatLargeNumberShared,
  RateLimiter,
} from '@l2beat/shared-pure'
import { Hex } from 'viem'

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

    // This returns like 500 MB, so can't just zod.parse it ;)
    // We have to extract stake manually

    let buffer = ''
    let effectiveBalance = 0
    let processedLength = 0

    for await (const chunk of response.body) {
      processedLength += chunk.length
      console.log(formatLargeNumberShared(processedLength))
      buffer += chunk
      let cutoffIndex = 0
      const regex = /"effective_balance": "(\d+)"/g
      let match: RegExpExecArray | null
      while ((match = regex.exec(buffer))) {
        cutoffIndex = match.index + match[0].length
        effectiveBalance += parseInt(match[1])
      }
      buffer = buffer.slice(cutoffIndex)
    }

    return {
      totalStake: effectiveBalance,
      thresholdStake: Math.ceil(effectiveBalance * (2 / 3)),
    }
  }
}
