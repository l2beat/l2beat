import { expect } from 'earl'
import { isLocalRequest } from './localOnly'

describe(isLocalRequest.name, () => {
  it('takes requests from this machine to localhost', () => {
    expect(isLocalRequest('127.0.0.1', 'localhost', undefined)).toEqual(true)
    expect(isLocalRequest('::1', '[::1]', undefined)).toEqual(true)
    expect(isLocalRequest('::ffff:127.0.0.1', '127.0.0.1', undefined)).toEqual(
      true,
    )
  })

  it('takes requests from DiscoUI pages', () => {
    const origin = 'http://localhost:2021'
    expect(isLocalRequest('127.0.0.1', 'localhost', origin)).toEqual(true)
  })

  it('refuses other machines and rebound domains', () => {
    expect(isLocalRequest('192.168.1.20', 'localhost', undefined)).toEqual(
      false,
    )
    expect(isLocalRequest('127.0.0.1', 'evil.example', undefined)).toEqual(
      false,
    )
    expect(isLocalRequest(undefined, 'localhost', undefined)).toEqual(false)
  })

  it('refuses pages on other sites that post here', () => {
    const local = ['127.0.0.1', 'localhost'] as const
    expect(isLocalRequest(...local, 'https://evil.example')).toEqual(false)
    expect(isLocalRequest(...local, 'null')).toEqual(false)
  })
})
