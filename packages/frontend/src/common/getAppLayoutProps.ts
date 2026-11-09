import { PROJECT_COUNTDOWNS } from '@l2beat/config'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { getWhatsNewItem } from '~/server/features/changelog/getWhatsNewItem'
import { getRecentlyAddedProjects } from '~/server/features/search-bar/getRecentlyAddedProjects'

export async function getAppLayoutProps(): Promise<AppLayoutProps> {
  const recentlyAddedProjects = await getRecentlyAddedProjects()
  return {
    recentlyAddedProjects,
    whatsNewItem: getWhatsNewItem(),
    countdowns: PROJECT_COUNTDOWNS,
  }
}
