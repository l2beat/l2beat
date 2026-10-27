import type { RequestHandler } from 'express'

const LOOPBACK_ADDRESSES = ['127.0.0.1', '::1', '::ffff:127.0.0.1']
const LOOPBACK_HOSTNAMES = ['localhost', '127.0.0.1', '[::1]']

// The server listens on every interface, so routes that act for the
// researcher refuse other machines, pages that rebind their domain to this
// machine (they still name it in the Host header), and pages on other sites
// that post here (the browser names them in the Origin header).
export function localOnly(refusal: string): RequestHandler {
  return (req, res, next) => {
    if (
      isLocalRequest(req.socket.remoteAddress, req.hostname, req.get('origin'))
    ) {
      next()
      return
    }
    res.status(403).json({ error: refusal })
  }
}

export function isLocalRequest(
  remoteAddress: string | undefined,
  hostname: string,
  origin: string | undefined,
): boolean {
  if (remoteAddress === undefined) {
    return false
  }
  if (origin !== undefined && !isLocalOrigin(origin)) {
    return false
  }
  return (
    LOOPBACK_ADDRESSES.includes(remoteAddress) &&
    LOOPBACK_HOSTNAMES.includes(hostname)
  )
}

// A sandboxed frame or a file page sends "null", which is not this machine.
function isLocalOrigin(origin: string): boolean {
  return (
    URL.canParse(origin) &&
    LOOPBACK_HOSTNAMES.includes(new URL(origin).hostname)
  )
}
