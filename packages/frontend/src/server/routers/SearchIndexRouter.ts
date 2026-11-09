import express from 'express'
import { getSearchIndexFile } from '~/server/features/search-bar/getSearchIndex'

const IMMUTABLE_CACHE_CONTROL = 'public, max-age=31536000, immutable'

/**
 * Pages link the index by the hash they were rendered with. A hash that is
 * not the current one (a page rendered before the token list changed, or by
 * another instance) still gets the current index, just not cached for good.
 */
export function createSearchIndexRouter() {
  const router = express.Router()

  router.get('/api/search-index/:hash', async (req, res) => {
    const file = await getSearchIndexFile()
    res.set(
      'Cache-Control',
      req.params.hash === file.hash ? IMMUTABLE_CACHE_CONTROL : 'no-cache',
    )
    res.type('application/json').send(file.json)
  })

  return router
}
