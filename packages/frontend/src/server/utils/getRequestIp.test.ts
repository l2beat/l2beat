import type { Request } from 'express'
import { expect } from 'earl'
import { getRequestIp } from './getRequestIp'

describe(getRequestIp.name, () => {
  it('prefers the Cloudflare client IP header', () => {
    const req = mockRequest({
      headers: {
        'cf-connecting-ip': '203.0.113.10',
        'x-forwarded-for': '198.51.100.10, 198.51.100.11',
      },
      ip: '::ffff:127.0.0.1',
    })

    expect(getRequestIp(req)).toEqual('203.0.113.10')
  })

  it('uses the first forwarded proxy hop when needed', () => {
    const req = mockRequest({
      headers: {
        'x-forwarded-for': '198.51.100.10, 198.51.100.11',
      },
    })

    expect(getRequestIp(req)).toEqual('198.51.100.10')
  })

  it('parses the standardized Forwarded header', () => {
    const req = mockRequest({
      headers: {
        forwarded: 'for="[2001:db8:cafe::17]:4711";proto=https',
      },
    })

    expect(getRequestIp(req)).toEqual('2001:db8:cafe::17')
  })

  it('falls back to the normalized express request IP', () => {
    const req = mockRequest({
      ip: '::ffff:127.0.0.1',
    })

    expect(getRequestIp(req)).toEqual('127.0.0.1')
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
        'x-forwarded-for': 'unknown',
      },
      ip: 'not-an-ip',
      socketRemoteAddress: 'still-not-an-ip',
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
