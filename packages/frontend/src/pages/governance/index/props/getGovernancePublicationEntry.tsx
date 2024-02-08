import { CollectionEntry } from '../../../../content/getCollection'

export interface GovernancePublicationEntry {
  id: string
  title: string
  description: string
}

export function getGovernancePublicationEntry(
  post: CollectionEntry<'publications'>,
): GovernancePublicationEntry {
  return {
    id: post.id,
    title: post.data.title,
    description: post.data.description,
  }
}
