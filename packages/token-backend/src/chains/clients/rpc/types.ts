export interface RpcClientConfig {
  url: string
}

export interface RpcResponse {
  id: string | number
  jsonrpc: string
  result?: string
  error?: {
    code: number
    message: string
  }
}
