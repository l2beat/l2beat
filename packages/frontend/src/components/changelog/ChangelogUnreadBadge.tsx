import { useLocalStorage } from '~/hooks/useLocalStorage'
import { useChangelogEntriesContext } from './ChangelogEntriesContext'

const IS_SERVER = typeof window === 'undefined'

export function ChangelogUnreadBadge() {
  const recentChangelogEntriesIds = useChangelogEntriesContext()
  const [lastReadChangelogEntryId] = useLocalStorage<string | undefined>(
    'last-read-changelog-entry-id',
    undefined,
  )

  const count = getCount(recentChangelogEntriesIds, lastReadChangelogEntryId)

  return (
    <div
      data-role="changelog-unread-badge"
      hidden={count === 0}
      suppressHydrationWarning
      className="inline-flex h-3.5 min-w-3.5 items-center justify-center rounded bg-brand p-px font-medium text-2xs text-white tabular-nums leading-none"
    >
      {count > 0 ? count : null}
    </div>
  )
}

function getCount(
  recentChangelogEntriesIds: string[],
  lastReadChangelogEntryId: string | undefined,
) {
  if (!recentChangelogEntriesIds.length) return 0
  if (IS_SERVER) return 0
  if (!lastReadChangelogEntryId) return recentChangelogEntriesIds.length
  const idx = recentChangelogEntriesIds.indexOf(lastReadChangelogEntryId)
  return idx === -1 ? recentChangelogEntriesIds.length : idx
}
