import { PROJECT_COUNTDOWNS } from '@l2beat/config'
import { getCollection } from '~/content/getCollection'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { getActiveChangelogWhatsNewWidget } from '~/server/features/changelog/getChangelogEntries'
import { getWhatsNewItem } from '~/server/features/changelog/getWhatsNewItem'
import { getRecentlyAddedProjects } from '~/server/features/search-bar/getRecentlyAddedProjects'

export async function getAppLayoutProps(): Promise<AppLayoutProps> {
  const recentlyAddedProjects = await getRecentlyAddedProjects()
  const whatsNew = getActiveChangelogWhatsNewWidget()
  return {
    terms: getCollection('glossary').map((term) => ({
      id: term.id,
      matches: [term.data.term, ...(term.data.match ?? [])],
      description: term.data.definition,
    })),
    recentlyAddedProjects,
    whatsNew,
    whatsNewItem: getWhatsNewItem(),
    countdowns: PROJECT_COUNTDOWNS,
  }
}
