import type { CollectionEntry } from '~/content/getCollection'
import { getCollectionEntry } from '~/content/getCollection'
import { formatPublicationDate } from '~/utils/dates'
import type { ImageParams } from '~/utils/project/getImageParams'
import { getImageParams } from '~/utils/project/getImageParams'

export interface OtherPublicationEntry {
  id: string
  thumbnail: ImageParams
  title: string
  shortTitle: string | undefined
  description: string | undefined
  excerpt: string | undefined
  readTimeInMinutes: number
  author: {
    id: string
    avatar: ImageParams
    firstName: string
    lastName: string
    role: string | undefined
  }
  publishedOn: string
  content: string
  tag: CollectionEntry<'other-publications'>['data']['tag']
}

export function getOtherPublicationEntry(
  post: CollectionEntry<'other-publications'>,
): OtherPublicationEntry {
  const author = getCollectionEntry('authors', post.data.authorId)
  if (!author) {
    throw new Error(`Author not found for ${post.id}`)
  }

  const avatar = getImageParams(`/images/avatars/${author.id}.png`)
  if (!avatar) {
    throw new Error(`Avatar not found for ${author.id}`)
  }

  const thumbnail = getImageParams(`/meta-images/publications/${post.id}.png`)
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
    author: {
      id: author.id,
      avatar,
      firstName: author.data.firstName,
      lastName: author.data.lastName,
      role: author.data.role,
    },
    tag: post.data.tag,
  }
}
