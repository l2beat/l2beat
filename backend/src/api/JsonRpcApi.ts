import fetch from 'node-fetch'
import { z } from 'zod'

const response = z
  .object({
    jsonrpc: z.literal('2.0'),
    // other types are permitted, but we only use numbers
    id: z.number(),
    result: z.any().optional(),
    error: z
      .object({
        code: z.number(),
        message: z.string(),
        data: z.any().optional(),
      })
      .strict()
      .optional(),
  })
  .strict()

export class JsonRpcApi {
  private id = 0

  constructor(private url: string) {}

  async call(
    method: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params?: any[] | Record<string, any>
  ): Promise<unknown> {
    const request = {
      jsonrpc: '2.0',
      method,
      params,
      id: ++this.id,
    }
    return this.jsonRequest(request).then((data: unknown) => {
      const parsed = response.safeParse(data)
      if (
        !parsed.success ||
        (parsed.data.result !== undefined && parsed.data.error !== undefined) ||
        parsed.data.id !== request.id
      ) {
        throw new Error('JSON-RPC 2.0 Protocol failure')
      }
      if (parsed.data.error !== undefined) {
        const error = new Error(parsed.data.error.message)
        Object.assign(error, parsed.data.error)
        throw error
      } else {
        if (parsed.data.result === undefined) {
          throw new Error('JSON-RPC 2.0 Protocol failure')
        }
        return parsed.data.result
      }
    })
  }

  private async jsonRequest(body: unknown) {
    return fetch(this.url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then((res) => {
      if (!res.ok) {
        throw new Error(res.statusText)
      }
      return res.json()
    })
  }
}
