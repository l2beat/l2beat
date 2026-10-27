import type { RequestHandler } from 'express'

const LOOPBACK_ADDRESSES = ['127.0.0.1', '::1', '::ffff:127.0.0.1']
const LOOPBACK_HOSTNAMES = ['localhost', '127.0.0.1', '[::1]']

// The server listens on every interface, so routes that act for the
// researcher refuse other machines, and pages that rebind their domain to
// this machine still name it in the Host header.
export function localOnly(refusal: string): RequestHandler {
  return (req, res, next) => {
    if (isLocalRequest(req.socket.remoteAddress, req.hostname)) {
      next()
      return
    }
    res.status(403).json({ error: refusal })
  }
}

export function isLocalRequest(
  remoteAddress: string | undefined,
  hostname: string,
): boolean {
  if (remoteAddress === undefined) {
    return false
  }
  return (
    LOOPBACK_ADDRESSES.includes(remoteAddress) &&
    LOOPBACK_HOSTNAMES.includes(hostname)
  )
}
