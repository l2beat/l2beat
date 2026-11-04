import { expect } from 'earl'
import { isLocalRequest } from './localOnly'

describe(isLocalRequest.name, () => {
  it('takes requests from this machine to localhost', () => {
    expect(isLocal('127.0.0.1', 'localhost')).toEqual(true)
    expect(isLocal('::1', '[::1]')).toEqual(true)
    expect(isLocal('::ffff:127.0.0.1', '127.0.0.1')).toEqual(true)
  })

  it('takes requests from DiscoUI pages', () => {
    const origin = 'http://localhost:2021'
    expect(isLocal('127.0.0.1', 'localhost', origin, 'same-origin')).toEqual(
      true,
    )
  })

  it('refuses other machines and rebound domains', () => {
    expect(isLocal('192.168.1.20', 'localhost')).toEqual(false)
    expect(isLocal('127.0.0.1', 'evil.example')).toEqual(false)
    expect(isLocal(undefined, 'localhost')).toEqual(false)
  })

  it('refuses pages on other sites that post here', () => {
    expect(isLocal('127.0.0.1', 'localhost', 'https://evil.example')).toEqual(
      false,
    )
    expect(isLocal('127.0.0.1', 'localhost', 'null')).toEqual(false)
  })

  it('refuses pages on other sites that leave out Origin', () => {
    expect(isLocal('127.0.0.1', 'localhost', undefined, 'cross-site')).toEqual(
      false,
    )
  })

  it('refuses pages on other localhost ports', () => {
    expect(isLocal('127.0.0.1', 'localhost', undefined, 'same-site')).toEqual(
      false,
    )
    const origin = 'http://localhost:3000'
    expect(isLocal('127.0.0.1', 'localhost', origin, 'same-site')).toEqual(
      false,
    )
    expect(isLocal('127.0.0.1', 'localhost', undefined, 'none')).toEqual(true)
  })
})

function isLocal(
  remoteAddress: string | undefined,
  hostname: string,
  origin?: string,
  fetchSite?: string,
) {
  return isLocalRequest(remoteAddress, hostname, origin, fetchSite)
}
