import type { CollectionEntry } from '~/content/getCollection'
import { getCollectionEntry } from '~/content/getCollection'
import { formatPublicationDate } from '~/utils/dates'
import type { ImageParams } from '~/utils/project/getImageParams'
import { getImageParams } from '~/utils/project/getImageParams'
import type { GovernanceAuthorEntry } from './getGovernanceAuthorEntry'
import { getGovernanceAuthorEntry } from './getGovernanceAuthorEntry'

export interface GovernancePublicationEntry {
  id: string
  thumbnail: ImageParams
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

  const thumbnail = getImageParams(
    `/meta-images/governance/publications/${post.id}.png`,
  )
  if (!thumbnail) {
    throw new Error(`Thumbnail not found for ${post.id}`)
  }

  return {
    id: post.id,
    thumbnail,
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
