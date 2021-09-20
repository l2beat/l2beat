import { parseJsonRpcResponse } from './parseJsonRpcResponse'
import { isSuccessResponse, JsonRpcParams, JsonRpcRequest } from './types'

export interface ExecuteJsonRpc {
  (data: JsonRpcRequest | JsonRpcRequest[]): Promise<unknown>
}

export class JsonRpcError extends Error {
  constructor(public code: number, message: string, public data?: unknown) {
    super(message)
  }
}

export interface BatchResult {
  result?: unknown
  error?: Error
}

export abstract class JsonRpcClient {
  private requestId = 1337

  protected abstract execute(
    request: JsonRpcRequest | JsonRpcRequest[]
  ): Promise<unknown>

  async call(method: string, params?: JsonRpcParams) {
    const request = this.toRequest(method, params)
    const result = await this.execute(request)
    const parsed = parseJsonRpcResponse(result)
    if (Array.isArray(parsed)) {
      throw new TypeError('Unexpected array JSON-RPC response')
    } else if (parsed.id !== request.id) {
      throw new TypeError('Id mismatched in JSON-RPC response')
    } else if (isSuccessResponse(parsed)) {
      return parsed.result
    } else {
      throw new JsonRpcError(
        parsed.error.code,
        parsed.error.message,
        parsed.error.data
      )
    }
  }

  async callBatch(requests: { method: string; params?: JsonRpcParams }[]) {
    if (requests.length === 0) {
      return []
    }
    const jsonRpcRequests = requests.map((x) =>
      this.toRequest(x.method, x.params)
    )
    const result = await this.execute(jsonRpcRequests)
    const parsed = parseJsonRpcResponse(result)
    if (!Array.isArray(parsed)) {
      throw new TypeError('Unexpected object JSON-RPC response')
    } else {
      return jsonRpcRequests.map((request): BatchResult => {
        const response = parsed.find((x) => x.id === request.id)
        if (!response) {
          return { error: new Error('Missing JSON-RPC response') }
        } else if (isSuccessResponse(response)) {
          return { result: response.result }
        } else {
          return {
            error: new JsonRpcError(
              response.error.code,
              response.error.message,
              response.error.data
            ),
          }
        }
      })
    }
  }

  private toRequest(method: string, params?: JsonRpcParams) {
    const id = this.requestId++
    const request: JsonRpcRequest = {
      jsonrpc: '2.0',
      id,
      method,
    }
    if (params !== undefined) {
      request.params = params
    }
    return request
  }
}
