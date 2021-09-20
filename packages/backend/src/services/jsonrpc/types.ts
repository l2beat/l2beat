// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type JsonRpcParams = Record<string, any> | any[]

export interface JsonRpcRequest {
  jsonrpc: '2.0'
  id?: string | number | null
  method: string
  params?: JsonRpcParams
}

export interface JsonRpcSuccessResponse {
  jsonrpc: '2.0'
  id: string | number | null
  result: unknown
}

export interface JsonRpcErrorResponse {
  jsonrpc: '2.0'
  id: string | number | null
  error: {
    code: number
    message: string
    data?: unknown
  }
}

export type JsonRpcResponse = JsonRpcSuccessResponse | JsonRpcErrorResponse

export function isSuccessResponse(
  response: JsonRpcResponse
): response is JsonRpcSuccessResponse {
  return 'result' in response
}
