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
})
