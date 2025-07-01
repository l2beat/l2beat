import type { CollectionEntry } from '~/content/getCollection'
import type { EcosystemUpdate } from '~/content/monthly-updates'
import { formatPublicationDate } from '~/utils/dates'

export interface MonthlyUpdateEntry {
  id: string
  title: string
  publishedOn: string
  ecosystemUpdates: EcosystemUpdate[]
}

export function getMonthlyUpdateEntry(
  post: CollectionEntry<'monthly-updates'>,
): MonthlyUpdateEntry {
  const ecosystemUpdates = post.data.updates.filter(
    (update) => update.type === 'ecosystem',
  )

  return {
    id: post.id,
    title: post.data.title,
    publishedOn: formatPublicationDate(post.data.publishedOn),
    ecosystemUpdates,
  }
}
