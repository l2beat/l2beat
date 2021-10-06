import { as, CastError } from '../../tools/cast'
import { JsonRpcResponse } from './types'

const asUncheckedResponse = as.object('strict', {
  jsonrpc: as.exactly('2.0' as const),
  id: as.either(as.string, as.either(as.number, as.exactly(null))),
  result: as.optional(as.unknown),
  error: as.optional(
    as.object('strict', {
      code: as.integer,
      message: as.string,
      data: as.optional(as.unknown),
    })
  ),
})

function asResponse(value: unknown): JsonRpcResponse {
  const response = asUncheckedResponse(value)
  if (!xor('result' in response, 'error' in response)) {
    throw new CastError('response')
  }
  return response
}

function xor(a: boolean, b: boolean) {
  return (a || b) && (!a || !b)
}

const asResponseOrMany = as.either(asResponse, as.array(asResponse))

export function parseJsonRpcResponse(
  value: string
): JsonRpcResponse | JsonRpcResponse[] {
  try {
    const json = JSON.parse(value)
    const parsed = asResponseOrMany(json)
    if (Array.isArray(parsed) && parsed.length === 0) {
      throw new Error()
    }
    return parsed
  } catch {
    throw new TypeError('Invalid JSON-RPC response')
  }
}
