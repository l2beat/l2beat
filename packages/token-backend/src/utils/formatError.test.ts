import { expect } from 'earl'
import { formatError } from './formatError'

describe(formatError.name, () => {
  it('returns the message of an error without a cause', () => {
    expect(formatError(new Error('Boom'))).toEqual('Boom')
  })

  it('appends a structured cause so the UI shows the details', () => {
    const error = new Error('Boom', { cause: { status: 429 } })
    expect(formatError(error)).toEqual('Boom ({"status":429})')
  })

  it('appends the message of an error cause', () => {
    const error = new Error('Boom', { cause: new Error('Inner') })
    expect(formatError(error)).toEqual('Boom (Inner)')
  })

  it('does not throw on a cause that cannot be serialized', () => {
    const error = new Error('Boom', { cause: { value: 1n } })
    expect(formatError(error)).toEqual('Boom ([object Object])')
  })

  it('stringifies a value that is not an error', () => {
    expect(formatError('text')).toEqual('text')
  })
})
