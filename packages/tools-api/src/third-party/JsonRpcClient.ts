import { v } from '@l2beat/validate'

export interface JsonRpcRequest {
  method: string
  params?: unknown[] | Record<string, unknown>
}

export class JsonRpcClient {
  private id = 0

  async call(url: string, request: JsonRpcRequest): Promise<unknown> {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: this.id++,
        method: request.method,
        params: request.params,
      }),
    })
    const json = await res.json()
    const parsed = Response.safeParse(json)
    if (!parsed.success) {
      throw new Error('Cannot parse JSON-RPC response')
    }
    if ('error' in parsed.data) {
      throw new Error(
        `JSON-RPC Error (${parsed.data.error.code}): ${parsed.data.error.message}`,
      )
    }
    return parsed.data.result
  }
}

const SuccessResponse = v.object({
  jsonrpc: v.literal('2.0'),
  id: v.number(),
  result: v.unknown(),
})

const ErrorResponse = v.object({
  jsonrpc: v.literal('2.0'),
  id: v.number(),
  error: v.object({
    code: v.number(),
    message: v.string(),
    data: v.unknown().optional(),
  }),
})

const Response = v.union([SuccessResponse, ErrorResponse])
