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

/**
 * Every page renders the search bar, so a token database outage must not take
 * pages down. The route serves the current index for any hash, uncached.
 */
async function getSearchIndexPathOrLatest(): Promise<string> {
  try {
    return getSearchIndexPath((await getSearchIndexFile()).hash)
  } catch (error) {
    getLogger()
      .for('getAppLayoutProps')
      .warn('Search index unavailable', { error })
    return getSearchIndexPath('latest')
  }
}
