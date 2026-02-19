import type { WhatsNewWidget } from '~/components/whats-new/WhatsNewWidget'
import type { CollectionEntry } from '~/content/getCollection'
import { getCollection } from '~/content/getCollection'

export interface ChangelogEntry {
  id: string
  title: string
  summary: string | undefined
  publishedAt: Date
  content: string
  whatsNew:
    | {
        image: string
        alt: string
        href?: string
        mobileDisabledOnMatches?: string[]
        expiresAt: Date
      }
    | undefined
}

export function getChangelogEntries(): ChangelogEntry[] {
  return sortChangelogEntries(getCollection('changelog').map(mapChangelogEntry))
}

export function sortChangelogEntries(
  entries: ChangelogEntry[],
): ChangelogEntry[] {
  return [...entries].sort(
    (a, b) => b.publishedAt.getTime() - a.publishedAt.getTime(),
  )
}

export function selectActiveChangelogWhatsNewWidget(
  entries: ChangelogEntry[],
  now: Date,
): WhatsNewWidget | undefined {
  for (const entry of sortChangelogEntries(entries)) {
    if (!entry.whatsNew) continue

    const nowTimestamp = now.getTime()
    const publishedAt = entry.publishedAt.getTime()
    const expiresAt = entry.whatsNew.expiresAt.getTime()

    if (publishedAt <= nowTimestamp && nowTimestamp < expiresAt) {
      return {
        id: `changelog-${entry.id}`,
        href: entry.whatsNew.href ?? `/changelog#${entry.id}`,
        image: entry.whatsNew.image,
        mobileDisabledOnMatches: entry.whatsNew.mobileDisabledOnMatches,
        alt: entry.whatsNew.alt,
      }
    }
  }

  return undefined
}

export function getActiveChangelogWhatsNewWidget(
  now: Date = new Date(),
): WhatsNewWidget | undefined {
  return selectActiveChangelogWhatsNewWidget(getChangelogEntries(), now)
}

function mapChangelogEntry(
  entry: CollectionEntry<'changelog'>,
): ChangelogEntry {
  return {
    id: entry.id,
    title: entry.data.title,
    summary: entry.data.summary,
    publishedAt: entry.data.publishedAt,
    content: entry.content,
    whatsNew: entry.data.whatsNew,
  }
}
