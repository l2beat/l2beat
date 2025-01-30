import type { CollectionEntry } from '~/content/get-collection'
import { getCollectionEntry } from '~/content/get-collection'
import { formatPublicationDate } from '~/utils/dates'
import type { GovernanceAuthorEntry } from './get-governance-author-entry'
import { getGovernanceAuthorEntry } from './get-governance-author-entry'

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
  if (!author) {
    throw new Error(`Author not found for ${post.id}`)
  }
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
