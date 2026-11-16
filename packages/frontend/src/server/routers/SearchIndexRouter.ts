import express from 'express'
import { SEARCH_INDEX_PATH } from '~/components/search-bar/searchIndex'
import { getSearchIndexJson } from '~/server/features/search-bar/getSearchIndex'

/**
 * The token list behind the index changes every hour, so browsers keep it a
 * few minutes and then revalidate it by ETag.
 */
const SEARCH_INDEX_CACHE_CONTROL = 'public, max-age=300'

export function createSearchIndexRouter() {
  const router = express.Router()

  router.get(SEARCH_INDEX_PATH, async (_, res) => {
    const json = await getSearchIndexJson()
    res.set('Cache-Control', SEARCH_INDEX_CACHE_CONTROL)
    res.type('application/json').send(json)
  })

  return router
}
