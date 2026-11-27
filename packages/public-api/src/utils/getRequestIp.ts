import type { Request } from 'express'

// Same rule as packages/frontend/src/server/utils/getRequestIp.ts: the service
// sits behind Cloudflare, so the socket address is Cloudflare's, not the caller's.
export function getRequestIp(req: Request): string {
  const ip =
    req.header('cf-connecting-ip') ?? req.ip ?? req.socket.remoteAddress

  return ip?.trim() ?? 'unknown'
}

/**
 * Where the request reached us from. `cf-connecting-ip` is the caller's word
 * unless Cloudflare set it, so the log keeps the hops we saw ourselves beside
 * it: the address our proxy reports and the socket's own.
 */
export function getRequestHops(req: Request) {
  return {
    forwardedFor: req.header('x-forwarded-for'),
    socketIp: req.socket.remoteAddress,
  }
}
