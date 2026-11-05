import { expect } from 'earl'
import { isLocalRequest } from './localOnly'

describe(isLocalRequest.name, () => {
  it('takes requests from this machine to localhost', () => {
    expect(isLocal('127.0.0.1', 'localhost:2021')).toEqual(true)
    expect(isLocal('::1', '[::1]:2021')).toEqual(true)
    expect(isLocal('::ffff:127.0.0.1', '127.0.0.1:2021')).toEqual(true)
  })

  it('takes requests from DiscoUI pages', () => {
    const origin = 'http://localhost:2021'
    expect(
      isLocal('127.0.0.1', 'localhost:2021', origin, 'same-origin'),
    ).toEqual(true)
    expect(isLocal('127.0.0.1', 'localhost:2021', undefined, 'none')).toEqual(
      true,
    )
  })

  it('refuses other machines and rebound domains', () => {
    expect(isLocal('192.168.1.20', 'localhost:2021')).toEqual(false)
    expect(isLocal('127.0.0.1', 'evil.example:2021')).toEqual(false)
    expect(isLocal(undefined, 'localhost:2021')).toEqual(false)
    expect(isLocal('127.0.0.1', undefined)).toEqual(false)
  })

  it('refuses pages on other sites that post here', () => {
    const evil = 'https://evil.example'
    expect(isLocal('127.0.0.1', 'localhost:2021', evil)).toEqual(false)
    expect(isLocal('127.0.0.1', 'localhost:2021', 'null')).toEqual(false)
  })

  it('refuses pages on other sites that leave out Origin', () => {
    expect(
      isLocal('127.0.0.1', 'localhost:2021', undefined, 'cross-site'),
    ).toEqual(false)
  })

  it('refuses pages on other localhost ports by either header', () => {
    expect(
      isLocal('127.0.0.1', 'localhost:2021', undefined, 'same-site'),
    ).toEqual(false)
    // Without Sec-Fetch-Site, the Origin's port alone refuses it.
    const other = 'http://localhost:3000'
    expect(isLocal('127.0.0.1', 'localhost:2021', other)).toEqual(false)
  })
})

function isLocal(
  remoteAddress: string | undefined,
  host: string | undefined,
  origin?: string,
  fetchSite?: string,
) {
  return isLocalRequest(remoteAddress, host, origin, fetchSite)
}
