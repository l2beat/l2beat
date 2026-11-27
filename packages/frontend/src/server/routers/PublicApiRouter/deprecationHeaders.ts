import { UnixTime } from '@l2beat/shared-pure'
import type { NextFunction, Request, Response } from 'express'
import { toProductionUrl } from '~/consts/productionOrigin'
import {
  API_MIGRATION_GUIDE_PATH,
  OLD_PUBLIC_API_DEPRECATED_AT,
  OLD_PUBLIC_API_SUNSET_AT,
  PUBLIC_API_URL,
} from '~/consts/publicApi'

/**
 * Marks every response of the old API as deprecated. Its callers are mostly
 * anonymous scripts we cannot contact, so the responses themselves have to
 * carry the notice.
 */
export function DeprecationHeadersMiddleware() {
  const headers = getDeprecationHeaders()
  return (_req: Request, res: Response, next: NextFunction) => {
    res.set(headers.single)
    // Appended: the llms.txt middleware has already set a Link on this path
    res.append('Link', headers.links)
    next()
  }
}

export function getDeprecationHeaders() {
  const guide = toProductionUrl(API_MIGRATION_GUIDE_PATH)
  return {
    single: {
      // RFC 9745: a structured-field date, "@" and UNIX seconds
      Deprecation: `@${OLD_PUBLIC_API_DEPRECATED_AT}`,
      // RFC 8594: an HTTP date
      Sunset: UnixTime.toDate(OLD_PUBLIC_API_SUNSET_AT).toUTCString(),
      // Without this a browser script cannot read the headers cross-origin
      'Access-Control-Expose-Headers': 'Deprecation, Sunset, Link',
    },
    links: [
      `<${guide}>; rel="deprecation"; type="text/html"`,
      `<${guide}>; rel="sunset"; type="text/html"`,
      `<${PUBLIC_API_URL}>; rel="successor-version"`,
    ],
  }
}
