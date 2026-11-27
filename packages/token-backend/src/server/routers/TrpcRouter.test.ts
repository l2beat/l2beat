import { expect } from 'earl'
import { getLogLevel } from './TrpcRouter'

describe(getLogLevel.name, () => {
  it('warns when a request names an unknown procedure', () => {
    expect(getLogLevel('NOT_FOUND', true)).toEqual('warn')
  })

  it('logs errors when a registered procedure returns NOT_FOUND', () => {
    expect(getLogLevel('NOT_FOUND', false)).toEqual('error')
  })

  it('logs internal failures even when the procedure type is unknown', () => {
    expect(getLogLevel('INTERNAL_SERVER_ERROR', true)).toEqual('error')
  })
})
