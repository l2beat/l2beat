import {
  CollectionEntry,
  getCollectionEntry,
} from '../../../../content/getCollection'
import { formatPublicationDate } from '../../../../utils'
import {
  getGovernanceAuthorEntry,
  GovernanceAuthorEntry,
} from './getGovernanceAuthorEntry'

export interface GovernancePublicationEntry {
  id: string
  title: string
  shortTitle: string | undefined
  description: string | undefined
  excerpt: string
  readTimeInMinutes: number
  author: GovernanceAuthorEntry
  publishedOn: string
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
    description: post.data.description,
    excerpt: post.excerpt,
    readTimeInMinutes: post.readTimeInMinutes,
    publishedOn: formatPublicationDate(post.data.publishedOn),
    author: getGovernanceAuthorEntry(author),
  }
}
