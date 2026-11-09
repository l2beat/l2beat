import { PROJECT_COUNTDOWNS } from '@l2beat/config'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { getWhatsNewItem } from '~/server/features/changelog/getWhatsNewItem'
import { getRecentlyAddedProjects } from '~/server/features/search-bar/getRecentlyAddedProjects'
import {
  getSearchIndexFile,
  getSearchIndexPath,
} from '~/server/features/search-bar/getSearchIndex'
import { getLogger } from '~/server/utils/logger'

export async function getAppLayoutProps(): Promise<AppLayoutProps> {
  const [recentlyAddedProjects, searchIndexPath] = await Promise.all([
    getRecentlyAddedProjects(),
    getSearchIndexPathOrLatest(),
  ])
  return {
    recentlyAddedProjects,
    searchIndexPath,
    whatsNewItem: getWhatsNewItem(),
    countdowns: PROJECT_COUNTDOWNS,
  }
}

const SEARCH_INDEX_WAIT_MS = 1_000

/**
 * Every page renders the search bar, so a slow or failing token database must
 * not hold pages up. A cached index answers at once; a cold build gets a short
 * wait and keeps running for later pages. The route serves the current index
 * for any hash, uncached.
 */
async function getSearchIndexPathOrLatest(): Promise<string> {
  const logger = getLogger().for('getAppLayoutProps')
  let deadline: ReturnType<typeof setTimeout> | undefined
  const timedOut = new Promise<undefined>((resolve) => {
    deadline = setTimeout(resolve, SEARCH_INDEX_WAIT_MS, undefined)
  })
  try {
    const file = await Promise.race([getSearchIndexFile(), timedOut])
    if (file === undefined) {
      logger.warn('Search index not ready', { waitMs: SEARCH_INDEX_WAIT_MS })
      return getSearchIndexPath('latest')
    }
    return getSearchIndexPath(file.hash)
  } catch (error) {
    logger.warn('Search index unavailable', { error })
    return getSearchIndexPath('latest')
  } finally {
    clearTimeout(deadline)
  }
}
