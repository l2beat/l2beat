import type { WhatsNewItem } from '~/components/whats-new/WhatsNewItemContext'
import {
  getChangelogEntries,
  selectActiveWhatsNewEntry,
} from './getChangelogEntries'

/**
 * The announcement in the nav. The nav always has room for it, so unlike the
 * floating widget it falls back to the most recent entry when no campaign is
 * currently active.
 */
export function getWhatsNewItem(): WhatsNewItem | undefined {
  const entries = getChangelogEntries()
  const entry =
    selectActiveWhatsNewEntry(entries, new Date()) ??
    entries.find((entry) => entry.whatsNew)
  if (!entry?.whatsNew) {
    return undefined
  }
  return {
    id: `changelog-${entry.id}`,
    title: entry.title,
    description: entry.summary,
    href: entry.whatsNew.href ?? `/changelog#${entry.id}`,
    imageSrc: entry.whatsNew.image,
    imageAlt: entry.whatsNew.alt,
  }
}
