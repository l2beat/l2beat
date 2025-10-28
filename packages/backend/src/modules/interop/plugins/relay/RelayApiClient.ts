import type { HttpClient } from '@l2beat/shared'
import { v } from '@l2beat/validate'

const API_URL = 'https://api.relay.link'

interface GetRequestsOptions {
  limit?: number
  continuation?: string
  user?: string
  hash?: string
  originChainId?: number
  destinationChainId?: number
  privateChainsToInclude?: string
  id?: string
  orderId?: string
  startTimestamp?: number
  endTimestamp?: number
  startBlock?: number
  endBlock?: number
  chainId?: string
  referrer?: string
  sortBy?: 'createdAt' | 'updatedAt'
  sortDirection?: 'asc' | 'desc'
}

const CurrencyObject = v.object({
  chainId: v.number().optional(),
  address: v.string().optional(),
  symbol: v.string().optional(),
  name: v.string().optional(),
  decimals: v.number().optional(),
  metadata: v
    .object({
      logoURI: v.string().optional(),
      verified: v.boolean().optional(),
    })
    .optional(),
})

const AppFee = v.object({
  recipient: v.string().optional(),
  bps: v.string().optional(),
  amount: v.string().optional(),
  amountUsd: v.string().optional(),
  amountUsdCurrent: v.string().optional(),
})

const CurrencyInOut = v.object({
  currency: CurrencyObject.optional(),
  amount: v.string().optional(),
  amountFormatted: v.string().optional(),
  amountUsd: v.string().optional(),
  amountUsdCurrent: v.string().optional(),
  minimumAmount: v.string().optional(),
})

const RouteSide = v.object({
  inputCurrency: CurrencyInOut.optional(),
  outputCurrency: CurrencyInOut.optional(),
  router: v.string().optional(),
  includedSwapSources: v.array(v.string()).optional(),
})

const Fees = v.object({
  gas: v.string().optional(),
  fixed: v.string().optional(),
  price: v.string().optional(),
  gateway: v.string().optional(),
})

const StateChange = v.object({
  change: v.object({
    data: v
      .object({
        tokenId: v.string().optional(),
        tokenKind: v.string().optional(),
        tokenAddress: v.string().optional(),
      })
      .optional(),
    kind: v.string().optional(),
    balanceDiff: v.string().optional(),
  }),
  address: v.string().optional(),
})

const Transaction = v.object({
  fee: v.string().optional(),
  data: v
    .object({
      block: v.number().optional(),
      to: v.string().optional(),
      data: v.string().optional(),
      from: v.string().optional(),
      value: v.string().optional(),
      signer: v.string().optional(),
      instructions: v.unknown().optional(),
      hash: v.string().optional(),
      time: v.union([v.string(), v.number()]).optional(),
      user: v.string().optional(),
      error: v.unknown().optional(),
      action: v.unknown().optional(),
      vin: v.unknown().optional(),
      vout: v.unknown().optional(),
    })
    .optional(),
  hash: v.string().optional(),
  timestamp: v.number().optional(),
  chainId: v.number().optional(),
  type: v.string().optional(),
  block: v.number().optional(),
  stateChanges: v.array(StateChange).optional(),
})

export type GetRequestsResponse = v.infer<typeof GetRequestsResponse>
export const GetRequestsResponse = v.object({
  requests: v.array(
    v.object({
      id: v.string(),
      status: v.string().optional(),
      user: v.string().optional(),
      recipient: v.string().optional(),
      data: v.object({
        failedTxBlockNumber: v.number().optional(),
        slippageTolerance: v.string().optional(),
        failReason: v.string().optional(),
        failedTxHash: v.string().optional(),
        failedCallData: v.unknown().optional(),
        refundFailReason: v.string().optional(),
        fees: Fees.optional(),
        feesUsd: Fees.optional(),
        inTxs: v.array(Transaction).optional(),
        stateChanges: v.array(StateChange).optional(),
        currency: v.string().optional(),
        currencyObject: CurrencyObject.optional(),
        feeCurrency: v.string().optional(),
        feeCurrencyObject: CurrencyObject.optional(),
        appFeeCurrencyObject: CurrencyObject.optional(),
        refundCurrencyData: CurrencyInOut.optional(),
        appFees: v.array(AppFee).optional(),
        paidAppFees: v.array(AppFee).optional(),
        metadata: v
          .object({
            sender: v.string().optional(),
            recipient: v.string().optional(),
            currencyIn: CurrencyInOut.optional(),
            currencyOut: CurrencyInOut.optional(),
            currencyGasTopup: CurrencyInOut.optional(),
            rate: v.string().optional(),
            route: v
              .object({
                origin: RouteSide.optional(),
                destination: RouteSide.optional(),
              })
              .optional(),
          })
          .optional(),
        price: v.string().optional(),
        usesExternalLiquidity: v.boolean().optional(),
        timeEstimate: v.number().optional(),
        outTxs: v.array(Transaction).optional(),
      }),
      referrer: v.string().optional(),
      createdAt: v.string(),
      updatedAt: v.string(),
    }),
  ),
  continuation: v.string().optional(),
})

export class RelayApiClient {
  constructor(private httpClient: HttpClient) {}

  async getRequests(options: GetRequestsOptions = {}) {
    const queryParams: Record<string, string> = {}
    for (const key in options) {
      const value = options[key as keyof typeof options]
      if (value !== undefined) {
        queryParams[key] = value.toString()
      }
    }
    const data = await this.httpClient.fetch(
      `${API_URL}/requests/v2?${new URLSearchParams(queryParams)}`,
      {},
    )
    return GetRequestsResponse.parse(data)
  }

  async getAllRequests(options: GetRequestsOptions = {}) {
    const result: GetRequestsResponse = {
      requests: [],
    }
    let continuation = options.continuation
    do {
      const res = await this.getRequests({ ...options, continuation })
      result.requests.push(...res.requests)
      continuation = res.continuation
    } while (continuation)
    return result
  }
}
