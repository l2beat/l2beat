import {
  CollectionEntry,
  getCollectionEntry,
} from '../../content/getCollection'

export interface GovernancePublicationEntry {
  id: string
  title: string
  content: string
  author: CollectionEntry<'authors'>
}

export function getGovernancePublicationEntry(
  post: CollectionEntry<'publications'>,
): GovernancePublicationEntry {
  return {
    id: post.id,
    title: post.data.title,
    author: getCollectionEntry('authors', post.data.authorId),
    content: post.content,
  }
}
