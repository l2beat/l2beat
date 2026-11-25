import { expect } from 'earl'
import { errorToString } from './utils'

describe(errorToString.name, () => {
  // The sync dashboard shows this string as lastError, and the provider's
  // code and message are in the cause.
  it('keeps the fields of an object cause', () => {
    const error = new Error('RPC call failed. RPC error', {
      cause: { rpcCode: -32000, rpcMessage: 'header not found' },
    })

    const parsed = JSON.parse(errorToString(error))

    expect(parsed.message).toEqual('RPC call failed. RPC error')
    expect(parsed.cause).toEqual({
      rpcCode: -32000,
      rpcMessage: 'header not found',
    })
  })

  // Called while handling a failure, so it must never throw itself
  it('serializes a cause holding a bigint or a cycle', () => {
    const cycle: Record<string, unknown> = {}
    cycle.self = cycle

    const withBigint = errorToString(new Error('x', { cause: { value: 1n } }))
    const withCycle = errorToString(new Error('y', { cause: cycle }))

    expect(JSON.parse(withBigint).cause).toEqual({ value: '1' })
    expect(JSON.parse(withCycle).message).toEqual('y')
  })
})
