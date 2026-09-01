import { type Logger, RateLimiter } from '@l2beat/backend-tools'
import type { HttpClient } from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'

const API_URL = 'https://api.relay.link'

interface GetRequestsOptions {
  limit?: number
  continuation?: string
  startTimestamp?: number
  endTimestamp?: number
  sortBy?: 'createdAt' | 'updatedAt'
  sortDirection?: 'asc' | 'desc'
}

type GetAllRequestsOptions = Omit<
  GetRequestsOptions,
  'sortBy' | 'sortDirection'
>

const Currency = v.object({
  chainId: v.number().optional(),
  address: v.string().optional(),
  symbol: v.string().optional(),
  name: v.string().optional(),
  decimals: v.number().optional(),
})

const CurrencyAmount = v.object({
  currency: Currency.optional(),
  amount: v.string().optional(),
  amountFormatted: v.string().optional(),
  amountUsd: v.string().optional(),
  amountUsdCurrent: v.string().optional(),
  minimumAmount: v.string().optional(),
})

const NullableCurrencyAmount = v.union([CurrencyAmount, v.null()])

const RouteSide = v.object({
  inputCurrency: NullableCurrencyAmount.optional(),
  outputCurrency: NullableCurrencyAmount.optional(),
})

const NullableRouteSide = v.union([RouteSide, v.null()])

const RoutePhase = v.object({
  origin: NullableRouteSide.optional(),
  destination: NullableRouteSide.optional(),
})

const NullableRoutePhase = v.union([RoutePhase, v.null()])

const Route = v.object({
  quoted: NullableRoutePhase.optional(),
  actual: NullableRoutePhase.optional(),
})

const Transaction = v.object({
  txHash: v.string().optional(),
  timestamp: v.number().optional(),
  chainId: v.number().optional(),
})

const RelayV3Response = v.object({
  requests: v.array(
    v.object({
      id: v.string(),
      status: v.string().optional(),
      data: v.object({
        inTxs: v.array(Transaction).optional(),
        outTxs: v.array(Transaction).optional(),
        route: v.union([Route, v.null()]).optional(),
      }),
      createdAt: v.string(),
      updatedAt: v.string(),
    }),
  ),
  continuation: v.string().optional(),
})

type RelayV3Request = v.infer<typeof RelayV3Response>['requests'][number]
type RelayV3Transaction = v.infer<typeof Transaction>

export type RelayCurrencyAmount = v.infer<typeof CurrencyAmount>

export interface RelayTransaction {
  hash?: string
  timestamp?: number
  chainId?: number
}

export interface RelayRequest {
  id: string
  status?: string
  sourceTx?: RelayTransaction
  destinationTx?: RelayTransaction
  sourceCurrency?: RelayCurrencyAmount
  destinationCurrency?: RelayCurrencyAmount
  createdAt: string
  updatedAt: string
}

export interface GetRequestsResponse {
  requests: RelayRequest[]
  continuation?: string
}

interface RelayApiClientOptions {
  callsPerMinute: number
  maxAttempts: number
  initialRetryDelayMs: number
  maxRetryDelayMs: number
}

const DEFAULT_OPTIONS: RelayApiClientOptions = {
  callsPerMinute: 200,
  maxAttempts: 4,
  initialRetryDelayMs: 1_000,
  maxRetryDelayMs: 4_000,
}

export class RelayApiClient {
  private readonly options: RelayApiClientOptions
  private readonly rateLimiter: RateLimiter

  constructor(
    private readonly httpClient: HttpClient,
    private logger: Logger,
    private readonly apiKey: string,
    options: Partial<RelayApiClientOptions> = {},
  ) {
    this.logger = logger.for(this)
    this.options = { ...DEFAULT_OPTIONS, ...options }
    assert(
      Number.isInteger(this.options.callsPerMinute) &&
        this.options.callsPerMinute > 0,
      'Relay callsPerMinute must be a positive integer',
    )
    this.rateLimiter = new RateLimiter({
      callsPerMinute: this.options.callsPerMinute,
    })
  }

  async getRequests(
    options: GetRequestsOptions = {},
  ): Promise<GetRequestsResponse> {
    const queryParams: Record<string, string> = {}
    for (const key in options) {
      const value = options[key as keyof typeof options]
      if (value !== undefined) {
        queryParams[key] = value.toString()
      }
    }

    const url = `${API_URL}/requests/v3?${new URLSearchParams(queryParams)}`
    const data = await this.fetchWithRetry(url)
    const parsed = RelayV3Response.parse(data)

    return {
      requests: parsed.requests.map(normalizeRequest),
      continuation: parsed.continuation,
    }
  }

  async getAllRequests(
    options: GetAllRequestsOptions = {},
  ): Promise<GetRequestsResponse> {
    let remaining = options.limit ?? 50
    assert(
      Number.isInteger(remaining) && remaining > 0,
      'Relay requests limit must be a positive integer',
    )

    const result: GetRequestsResponse = { requests: [] }
    let continuation = options.continuation

    do {
      const previousContinuation = continuation
      const res = await this.getRequests({
        ...options,
        sortBy: 'updatedAt',
        sortDirection: 'asc',
        limit: Math.min(remaining, 50),
        continuation,
      })

      result.requests.push(...res.requests.slice(0, remaining))
      remaining -= res.requests.length
      continuation = res.continuation

      if (continuation && continuation === previousContinuation) {
        throw new Error('Relay API returned an unchanged continuation cursor')
      }
    } while (continuation && remaining > 0)

    result.continuation = continuation
    return result
  }

  private async fetchWithRetry(url: string): Promise<unknown> {
    for (let attempt = 1; ; attempt++) {
      try {
        return await this.rateLimiter.call(() =>
          this.httpClient.fetch(url, {
            headers: { 'x-api-key': this.apiKey },
          }),
        )
      } catch (error) {
        if (
          attempt >= this.options.maxAttempts ||
          !isRetryableRelayError(error)
        ) {
          throw error
        }

        const delay = Math.min(
          this.options.initialRetryDelayMs * 2 ** (attempt - 1),
          this.options.maxRetryDelayMs,
        )
        this.logger.warn('Retrying Relay API page', {
          attempt,
          delay,
          error: error instanceof Error ? error.message : error,
        })
        if (delay > 0) {
          await new Promise((resolve) => setTimeout(resolve, delay))
        }
      }
    }
  }
}

function normalizeRequest(request: RelayV3Request): RelayRequest {
  const route = request.data.route
  const actual = route?.actual
  const quoted = route?.quoted

  return {
    id: request.id,
    status: request.status,
    sourceTx: normalizeTransaction(request.data.inTxs?.[0]),
    destinationTx: normalizeTransaction(request.data.outTxs?.[0]),
    sourceCurrency:
      actual?.origin?.inputCurrency ??
      quoted?.origin?.inputCurrency ??
      undefined,
    destinationCurrency:
      actual?.destination?.outputCurrency ??
      quoted?.destination?.outputCurrency ??
      undefined,
    createdAt: request.createdAt,
    updatedAt: request.updatedAt,
  }
}

function normalizeTransaction(
  transaction: RelayV3Transaction | undefined,
): RelayTransaction | undefined {
  if (!transaction) {
    return undefined
  }
  return {
    hash: transaction.txHash,
    timestamp: transaction.timestamp,
    chainId: transaction.chainId,
  }
}

function isRetryableRelayError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return true
  }

  const match = /^HTTP error: (\d{3})/.exec(error.message)
  if (!match) {
    return true
  }

  const status = Number(match[1])
  return status === 408 || status === 429 || status >= 500
}
