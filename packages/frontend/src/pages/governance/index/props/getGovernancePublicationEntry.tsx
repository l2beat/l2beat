import { CollectionEntry } from '../../../../content/getCollection'

export interface GovernancePublicationEntry {
  id: string
  title: string
  shortTitle: string | undefined
  description: string
  readTimeInMinutes: number
}

export function getGovernancePublicationEntry(
  post: CollectionEntry<'publications'>,
): GovernancePublicationEntry {

  return {
    id: post.id,
    title: post.data.title,
    shortTitle: post.data.shortTitle,
    description: post.data.description,
    readTimeInMinutes: post.data.readTimeInMinutes,
  }
}
