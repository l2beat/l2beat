import { expect } from 'earl'
import { isLocalRequest } from './localOnly'

describe(isLocalRequest.name, () => {
  it('takes requests from this machine to localhost', () => {
    expect(isLocalRequest('127.0.0.1', 'localhost')).toEqual(true)
    expect(isLocalRequest('::1', '[::1]')).toEqual(true)
    expect(isLocalRequest('::ffff:127.0.0.1', '127.0.0.1')).toEqual(true)
  })

  it('refuses other machines and rebound domains', () => {
    expect(isLocalRequest('192.168.1.20', 'localhost')).toEqual(false)
    expect(isLocalRequest('127.0.0.1', 'evil.example')).toEqual(false)
    expect(isLocalRequest(undefined, 'localhost')).toEqual(false)
  })
})
