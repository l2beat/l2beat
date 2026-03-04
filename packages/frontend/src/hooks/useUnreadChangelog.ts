import type { UnixTime } from '@l2beat/shared-pure'
import { useChangelogEntriesContext } from '~/components/changelog/ChangelogEntriesContext'
import { useIsClient } from './useIsClient'
import { useLocalStorage } from './useLocalStorage'

export const CHANGELOG_LAST_VISITED_AT_LOCAL_STORAGE_KEY =
  'changelog-last-visited-at'

export function useUnreadChangelog() {
  const isClient = useIsClient()
  const changelogPublishedAtTimestamps = useChangelogEntriesContext()
  const [lastVisitedChangelogAt] = useLocalStorage<UnixTime | undefined>(
    CHANGELOG_LAST_VISITED_AT_LOCAL_STORAGE_KEY,
    undefined,
  )

  if (!isClient) return undefined

  if (!lastVisitedChangelogAt) return changelogPublishedAtTimestamps.length

  return changelogPublishedAtTimestamps.filter(
    (timestamp) => timestamp > lastVisitedChangelogAt,
  ).length
}
