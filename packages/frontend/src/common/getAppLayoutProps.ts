import { PROJECT_COUNTDOWNS } from '@l2beat/config'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { getActiveChangelogWhatsNewWidget } from '~/server/features/changelog/getChangelogEntries'
import { getWhatsNewItem } from '~/server/features/changelog/getWhatsNewItem'
import { getRecentlyAddedProjects } from '~/server/features/search-bar/getRecentlyAddedProjects'

export async function getAppLayoutProps(): Promise<AppLayoutProps> {
  const recentlyAddedProjects = await getRecentlyAddedProjects()
  const whatsNew = getActiveChangelogWhatsNewWidget()
  return {
    recentlyAddedProjects,
    whatsNew,
    whatsNewItem: getWhatsNewItem(),
    countdowns: PROJECT_COUNTDOWNS,
  }
}
