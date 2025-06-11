import { z } from 'zod'

export interface JsonRpcRequest {
  method: string
  params?: unknown[] | Record<string, unknown>
}

export class JsonRpcClient {
  private id: number = 0

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

const SuccessResponse = z.object({
  jsonrpc: z.literal('2.0'),
  id: z.number(),
  result: z.unknown(),
})

const ErrorResponse = z.object({
  jsonrpc: z.literal('2.0'),
  id: z.number(),
  error: z.object({
    code: z.number(),
    message: z.string(),
    data: z.unknown().optional(),
  }),
})

const Response = z.union([SuccessResponse, ErrorResponse])
