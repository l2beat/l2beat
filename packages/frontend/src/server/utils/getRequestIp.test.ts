import { expect } from 'earl'
import type { Request } from 'express'
import { getRequestIp } from './getRequestIp'

describe(getRequestIp.name, () => {
  it('prefers the Cloudflare client IP header', () => {
    const req = mockRequest({
      headers: {
        'cf-connecting-ip': ' 203.0.113.10 ',
      },
      ip: '198.51.100.10',
    })

    expect(getRequestIp(req)).toEqual('203.0.113.10')
  })

  it('falls back to the raw express request IP', () => {
    const req = mockRequest({
      ip: '::ffff:127.0.0.1',
    })

    expect(getRequestIp(req)).toEqual('::ffff:127.0.0.1')
  })

  it('falls back to the socket remote address', () => {
    const req = mockRequest({
      socketRemoteAddress: '2001:db8::1',
    })

    expect(getRequestIp(req)).toEqual('2001:db8::1')
  })

  it('returns unknown when no valid IP is available', () => {
    const req = mockRequest({
      headers: {
        'cf-connecting-ip': '   ',
      },
    })

    expect(getRequestIp(req)).toEqual('unknown')
  })
})

function mockRequest({
  headers = {},
  ip,
  socketRemoteAddress,
}: {
  headers?: Record<string, string>
  ip?: string
  socketRemoteAddress?: string
} = {}): Request {
  const normalizedHeaders = Object.fromEntries(
    Object.entries(headers).map(([key, value]) => [key.toLowerCase(), value]),
  )

  return {
    header(name: string) {
      return normalizedHeaders[name.toLowerCase()]
    },
    ip,
    socket: {
      remoteAddress: socketRemoteAddress,
    },
  } as unknown as Request
}
