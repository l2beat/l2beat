import { getErrorMessage, Logger, RequestTracker } from '@l2beat/common'

import { HttpClient } from '../HttpClient'
import { JsonRpcClient } from './JsonRpcClient'
import { parseJsonRpcResponse } from './parseJsonRpcResponse'
import { isSuccessResponse, JsonRpcRequest } from './types'

export class JsonRpcHttpClient extends JsonRpcClient {
  private requestTracker = new RequestTracker(20)

  constructor(
    private url: string,
    private httpClient: HttpClient,
    protected logger: Logger
  ) {
    super()
    this.logger = this.logger.for(this)
  }

  getStatus() {
    return this.requestTracker.getStats()
  }

  async execute(request: JsonRpcRequest | JsonRpcRequest[]) {
    const start = Date.now()
    const { httpResponse, error } = await this.httpClient
      .fetch(this.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        timeout: 20_000,
      })
      .then(
        (httpResponse) => ({ httpResponse, error: undefined }),
        (error: unknown) => ({ httpResponse: undefined, error })
      )
    const timeMs = Date.now() - start

    if (!httpResponse) {
      const message = getErrorMessage(error)
      this.recordError(request, timeMs, message)
      throw error
    }

    const text = await httpResponse.text()
    const rpcResponse = tryParseJsonRpcResponse(text)

    if (
      rpcResponse &&
      !Array.isArray(rpcResponse) &&
      !isSuccessResponse(rpcResponse)
    ) {
      const message = rpcResponse.error.message
      this.recordError(request, timeMs, message)
      return rpcResponse
    }

    if (!httpResponse.ok) {
      this.recordError(request, timeMs, text)
      throw new Error(`Http error ${httpResponse.status}: ${text}`)
    }

    if (!rpcResponse) {
      const message = 'Invalid JSON-RPC response.'
      this.recordError(request, timeMs, message)
      throw new TypeError(message)
    }

    this.recordSuccess(request, timeMs)
    return rpcResponse
  }

  private recordSuccess(
    request: JsonRpcRequest | JsonRpcRequest[],
    timeMs: number
  ) {
    this.requestTracker.add(timeMs, true)
    this.logger.debug({ type: 'success', timeMs, ...getRequestInfo(request) })
  }

  private recordError(
    request: JsonRpcRequest | JsonRpcRequest[],
    timeMs: number,
    message: string
  ) {
    this.requestTracker.add(timeMs, false)
    this.logger.debug({
      type: 'error',
      message,
      timeMs,
      ...getRequestInfo(request),
    })
  }
}

type RequestInfo =
  | { batch: number; id: string | number | null }
  | { method: string; id: string | number | null }

function getRequestInfo(
  request: JsonRpcRequest | JsonRpcRequest[]
): RequestInfo {
  if (Array.isArray(request)) {
    return { batch: request.length, id: request[0].id ?? null }
  } else {
    return { method: request.method, id: request.id ?? null }
  }
}

function tryParseJsonRpcResponse(text: string) {
  try {
    return parseJsonRpcResponse(text)
  } catch {
    return undefined
  }
}
