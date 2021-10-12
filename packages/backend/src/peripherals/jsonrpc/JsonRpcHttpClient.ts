import { getErrorMessage, Logger } from '../../tools/Logger'
import { HttpClient } from '../HttpClient'
import { JsonRpcClient, JsonRpcError } from './JsonRpcClient'
import { parseJsonRpcResponse } from './parseJsonRpcResponse'
import { isSuccessResponse, JsonRpcRequest } from './types'

export class JsonRpcHttpClient extends JsonRpcClient {
  constructor(
    private url: string,
    private httpClient: HttpClient,
    protected logger: Logger
  ) {
    super()
    this.logger = this.logger.for(this)
  }

  async execute(request: JsonRpcRequest | JsonRpcRequest[]) {
    const method = Array.isArray(request)
      ? `batch(${request.length})`
      : request.method
    const id = (Array.isArray(request) ? request[0].id : request.id) ?? 'null'

    this.logger.debug({ type: 'request', method, id })

    let res
    try {
      res = await this.httpClient.fetch(this.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        timeout: 20_000,
      })
    } catch (e) {
      this.logger.debug({
        type: 'response',
        error: getErrorMessage(e),
        method,
        id,
      })
      throw e
    }

    const text = await res.text()
    if (!res.ok) {
      let rpcResponse
      try {
        rpcResponse = parseJsonRpcResponse(text)
      } catch {} // eslint-disable-line no-empty
      if (
        rpcResponse !== undefined &&
        !Array.isArray(rpcResponse) &&
        !isSuccessResponse(rpcResponse)
      ) {
        this.logger.debug({
          type: 'response',
          error: rpcResponse.error.message,
          method,
          id,
        })
        throw new JsonRpcError(
          rpcResponse.error.code,
          rpcResponse.error.message,
          rpcResponse.error.data
        )
      }
      this.logger.debug({
        type: 'response',
        error: text,
        method,
        id,
      })
      throw new Error(`Http error ${res.status}: ${text}`)
    }
    this.logger.debug({
      type: 'response',
      success: true,
      method,
      id,
    })
    return parseJsonRpcResponse(text)
  }
}
