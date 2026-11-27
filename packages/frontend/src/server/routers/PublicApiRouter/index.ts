import express from 'express'
import { toProductionUrl } from '~/consts/productionOrigin'
import {
  API_MIGRATION_GUIDE_PATH,
  OLD_PUBLIC_API_PATH,
  PUBLIC_API_URL,
} from '~/consts/publicApi'
import { getGoneBody } from './goneBody'

/**
 * The old public API was shut down. Its paths answer 410 rather than 404, so
 * a caller that still asks learns the API is gone for good and where the new
 * one is.
 */
export function createPublicApiRouter() {
  const router = express.Router()
  const body = getGoneBody()
  const guide = toProductionUrl(API_MIGRATION_GUIDE_PATH)
  const links = [
    `<${guide}>; rel="sunset"; type="text/html"`,
    `<${PUBLIC_API_URL}>; rel="successor-version"`,
  ]

  router.use(OLD_PUBLIC_API_PATH, (_req, res) => {
    res
      .status(410)
      // The answer never changes, so the edge may keep it
      .header('Cache-Control', GONE_CACHE_CONTROL)
      .header('Access-Control-Expose-Headers', 'Link')
      .append('Link', links)
      .json(body)
  })

  return router
}

const GONE_CACHE_CONTROL = 'public, max-age=3600, s-maxage=86400'
