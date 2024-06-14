import { HttpClient } from '@l2beat/shared'
import { assert, RateLimiter } from '@l2beat/shared-pure'
import { TendermintValidatorsResponseBodySchema } from './schemas'

interface TendermintClientOpts {
  callsPerMinute?: number
}

export class TendermintClient {
  constructor(
    readonly url: string,
    private readonly httpClient: HttpClient,
    opts?: TendermintClientOpts,
  ) {
    if (opts?.callsPerMinute) {
      const rateLimiter = new RateLimiter({
        callsPerMinute: opts.callsPerMinute,
      })
      this.getValidators = rateLimiter.wrap(this.getValidators.bind(this))
    }
  }

  static create(
    services: { httpClient: HttpClient },
    options: { url: string; callsPerMinute: number | undefined },
  ) {
    return new TendermintClient(options.url, services.httpClient, options)
  }

  async getValidators({
    height,
    page = 1,
    perPage = 100,
  }: {
    height?: number
    page: number
    perPage?: number
  }) {
    const response = await this.httpClient.fetch(
      `${this.url}/validators?${new URLSearchParams({
        ...(height ? { height: height.toString() } : {}),
        page: page.toString(),
        per_page: perPage.toString(),
      }).toString()}`,
    )

    assert(
      response.ok,
      `Tendermint getValidators request failed with status: ${response.status}`,
    )

    return TendermintValidatorsResponseBodySchema.parse(await response.json())
      .result
  }
}
