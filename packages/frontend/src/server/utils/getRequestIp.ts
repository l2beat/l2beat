import { isIP } from 'node:net'
import type { Request } from 'express'

const IP_HEADER_NAMES = [
  'cf-connecting-ip',
  'true-client-ip',
  'x-real-ip',
  'x-forwarded-for',
] as const

export function getRequestIp(req: Request): string {
  for (const headerName of IP_HEADER_NAMES) {
    const ip = getFirstIpFromHeader(req.header(headerName))
    if (ip) {
      return ip
    }
  }

  const forwardedIp = getForwardedIp(req.header('forwarded'))
  if (forwardedIp) {
    return forwardedIp
  }

  return normalizeIp(req.ip) ?? normalizeIp(req.socket.remoteAddress) ?? 'unknown'
}

function getFirstIpFromHeader(header: string | undefined): string | undefined {
  const [first] = header?.split(',') ?? []
  return normalizeIp(first)
}

function getForwardedIp(header: string | undefined): string | undefined {
  if (!header) {
    return undefined
  }

  const [firstEntry] = header.split(',')
  if (!firstEntry) {
    return undefined
  }

  for (const part of firstEntry.split(';')) {
    const trimmed = part.trim()
    if (!trimmed.toLowerCase().startsWith('for=')) {
      continue
    }

    return normalizeIp(trimmed.slice(4))
  }

  return undefined
}

function normalizeIp(value: string | undefined): string | undefined {
  if (!value) {
    return undefined
  }

  let candidate = value.trim()
  if (!candidate || candidate.toLowerCase() === 'unknown') {
    return undefined
  }

  candidate = candidate.replace(/^"+|"+$/g, '')

  if (candidate.startsWith('[')) {
    const closingBracket = candidate.indexOf(']')
    if (closingBracket !== -1) {
      candidate = candidate.slice(1, closingBracket)
    }
  } else if (candidate.startsWith('::ffff:')) {
    const ipv4Candidate = candidate.slice('::ffff:'.length)
    if (isIP(ipv4Candidate) === 4) {
      candidate = ipv4Candidate
    }
  } else if (/^\d{1,3}(?:\.\d{1,3}){3}:\d+$/.test(candidate)) {
    candidate = candidate.slice(0, candidate.lastIndexOf(':'))
  }

  return isIP(candidate) === 0 ? undefined : candidate
}
