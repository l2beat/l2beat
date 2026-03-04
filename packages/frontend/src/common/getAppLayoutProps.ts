import { UnixTime } from '@l2beat/shared-pure'
import type { Request } from 'express'
import { getCollection } from '~/content/getCollection'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import {
  getActiveChangelogWhatsNewWidget,
  getChangelogEntries,
} from '~/server/features/changelog/getChangelogEntries'
import { getRecentlyAddedProjects } from '~/server/features/projects/search-bar/getRecentlyAddedProjects'
import { parseCookies } from '~/server/utils/parseCookies'

export async function getAppLayoutProps(
  req: Request<unknown, unknown, unknown, unknown>,
): Promise<AppLayoutProps> {
  return {
    terms: getCollection('glossary').map((term) => ({
      id: term.id,
      matches: [term.data.term, ...(term.data.match ?? [])],
      description: term.data.definition,
    })),
    recentlyAddedProjects: await getRecentlyAddedProjects(),
    unreadChangelogCount: getUnreadChangelogCount(req),
    whatsNew: getActiveChangelogWhatsNewWidget(),
  }
}

function getUnreadChangelogCount(
  req: Request<unknown, unknown, unknown, unknown>,
) {
  const cookies = parseCookies(req.headers?.cookie ?? '')

  if (req.originalUrl === '/changelog') {
    return 0
  }

  const changelogEntries = getChangelogEntries().filter(
    (entry) =>
      UnixTime.fromDate(entry.publishedAt) > UnixTime.now() - 14 * UnixTime.DAY,
  )
  const lastReadChangelogId = cookies.lastReadChangelogId
  if (!lastReadChangelogId) {
    return changelogEntries.length
  }
  const lastReadChangelogIndex = changelogEntries.findIndex(
    (entry) => entry.id === lastReadChangelogId,
  )
  if (lastReadChangelogIndex === -1) {
    return changelogEntries.length
  }

  return lastReadChangelogIndex
}
