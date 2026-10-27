import type { WhatsNewItem } from '~/components/whats-new/WhatsNewItemContext'
import {
  getChangelogEntries,
  selectNavWhatsNewEntry,
} from './getChangelogEntries'

export function getWhatsNewItem(): WhatsNewItem | undefined {
  const entry = selectNavWhatsNewEntry(getChangelogEntries(), new Date())
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
