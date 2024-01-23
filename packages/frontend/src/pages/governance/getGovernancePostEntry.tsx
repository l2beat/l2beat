import {
  CollectionEntry,
  getCollectionEntry,
} from '../../content/getCollection'

export interface GovernancePostEntry {
  id: string
  title: string
  content: string
  author: CollectionEntry<'authors'>
}

export function getGovernancePostEntry(
  post: CollectionEntry<'posts'>,
): GovernancePostEntry {
  return {
    id: post.id,
    title: post.data.title,
    author: getCollectionEntry('authors', post.data.authorId),
    content: post.content,
  }
}
