import type { Request } from 'express'

export function getRequestIp(req: Request): string {
  const ip =
    req.header('cf-connecting-ip') ?? req.ip ?? req.socket.remoteAddress

  return ip?.trim() ?? 'unknown'
}
