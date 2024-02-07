import { CollectionEntry } from '../../../../content/getCollection'

export interface GovernancePublicationEntry {
  id: string
  title: string
  link: string
}

export function getGovernancePublicationEntry(
  post: CollectionEntry<'publications'>,
): GovernancePublicationEntry {
  return {
    id: post.id,
    title: post.data.title,
    link: post.data.link,
  }
}
