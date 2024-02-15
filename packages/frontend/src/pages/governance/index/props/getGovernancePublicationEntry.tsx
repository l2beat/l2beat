import {
  CollectionEntry,
  getCollectionEntry,
} from '../../../../content/getCollection'
import {
  getGovernanceAuthorEntry,
  GovernanceAuthorEntry,
} from './getGovernanceAuthorEntry'

export interface GovernancePublicationEntry {
  id: string
  title: string
  shortTitle: string | undefined
  description: string
  readTimeInMinutes: number
  author: GovernanceAuthorEntry
  content: string
}

export function getGovernancePublicationEntry(
  post: CollectionEntry<'publications'>,
): GovernancePublicationEntry {
  const author = getCollectionEntry('authors', post.data.authorId)

  return {
    id: post.id,
    content: post.content,
    title: post.data.title,
    shortTitle: post.data.shortTitle,
    description: post.data.description ?? post.excerpt,
    readTimeInMinutes: post.data.readTimeInMinutes,
    author: getGovernanceAuthorEntry(author),
  }
}
