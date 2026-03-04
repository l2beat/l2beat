import { UnixTime } from '@l2beat/shared-pure'
import { getCollection } from '~/content/getCollection'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import {
  getActiveChangelogWhatsNewWidget,
  getChangelogEntries,
} from '~/server/features/changelog/getChangelogEntries'
import { getRecentlyAddedProjects } from '~/server/features/projects/search-bar/getRecentlyAddedProjects'

export async function getAppLayoutProps(): Promise<AppLayoutProps> {
  const recentlyAddedProjects = await getRecentlyAddedProjects()
  const changelogPublishedAtTimestamps = getChangelogEntries()
    .map((entry) => UnixTime.fromDate(entry.publishedAt))
    .filter((timestamp) => timestamp > UnixTime.now() - 14 * UnixTime.DAY)
  const whatsNew = getActiveChangelogWhatsNewWidget()
  return {
    terms: getCollection('glossary').map((term) => ({
      id: term.id,
      matches: [term.data.term, ...(term.data.match ?? [])],
      description: term.data.definition,
    })),
    recentlyAddedProjects,
    changelogPublishedAtTimestamps,
    whatsNew,
  }
}
