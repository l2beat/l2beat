export interface JsonRpcRequest {
  jsonrpc: '2.0'
  id: string | number | null
  method: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: Record<string, any> | any[]
}

export interface JsonRpcNotification {
  jsonrpc: '2.0'
  method: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: Record<string, any> | any[]
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
