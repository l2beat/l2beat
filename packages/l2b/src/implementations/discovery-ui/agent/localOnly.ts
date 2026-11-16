import type { RequestHandler } from 'express'

const LOOPBACK_ADDRESSES = ['127.0.0.1', '::1', '::ffff:127.0.0.1']
const LOOPBACK_HOSTNAMES = ['localhost', '127.0.0.1', '[::1]']
// A DiscoUI page, or the researcher typing the address in.
const ALLOWED_FETCH_SITES = ['same-origin', 'none']

// The server listens on every interface, so routes that act for the
// researcher refuse other machines, pages that rebind their domain to this
// machine (they still name it in the Host header), and pages on other sites
// or other localhost ports (the browser names them in the Origin or
// Sec-Fetch-Site header).
export function localOnly(refusal: string): RequestHandler {
  return (req, res, next) => {
    if (
      isLocalRequest(
        req.socket.remoteAddress,
        req.get('host'),
        req.get('origin'),
        req.get('sec-fetch-site'),
      )
    ) {
      next()
      return
    }
    res.status(403).json({ error: refusal })
  }
}

// host is the Host header, with the port.
export function isLocalRequest(
  remoteAddress: string | undefined,
  host: string | undefined,
  origin: string | undefined,
  fetchSite: string | undefined,
): boolean {
  if (remoteAddress === undefined || host === undefined) {
    return false
  }
  if (!LOOPBACK_ADDRESSES.includes(remoteAddress)) {
    return false
  }
  if (!isLoopbackHost(host)) {
    return false
  }
  // A sandboxed frame or a file page sends "null", which is not this page.
  if (origin !== undefined && !isSameHost(origin, host)) {
    return false
  }
  // A link or frame may omit Origin, but browsers say where it came from.
  // Agents and other local tools send no such header.
  if (fetchSite !== undefined && !ALLOWED_FETCH_SITES.includes(fetchSite)) {
    return false
  }
  return true
}

function isLoopbackHost(host: string): boolean {
  const url = `http://${host}`
  return URL.canParse(url) && LOOPBACK_HOSTNAMES.includes(new URL(url).hostname)
}

// The origin of a DiscoUI page names the same host and port as the request.
function isSameHost(origin: string, host: string): boolean {
  return (
    URL.canParse(origin) &&
    URL.canParse(`http://${host}`) &&
    new URL(origin).host === new URL(`http://${host}`).host
  )
}
