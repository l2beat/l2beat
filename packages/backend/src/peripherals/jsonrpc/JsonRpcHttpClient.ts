import { Logger } from '../../tools/Logger'
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
    const res = await this.httpClient.fetch(this.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })
    this.logger.debug({ type: 'response', status: res.status, method, id })

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
        throw new JsonRpcError(
          rpcResponse.error.code,
          rpcResponse.error.message,
          rpcResponse.error.data
        )
      }
      throw new Error(`Http error ${res.status}: ${text}`)
    }
    return parseJsonRpcResponse(text)
  }
}
