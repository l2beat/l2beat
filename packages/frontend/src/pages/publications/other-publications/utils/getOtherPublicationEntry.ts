import type { CollectionEntry } from '~/content/getCollection'
import { getCollectionEntry } from '~/content/getCollection'
import { readFileSync } from 'fs'
import matter from 'gray-matter'
import path from 'path'
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

  const content = getOtherPublicationContent(post.id, post.data.contentFile)
  const excerpt = getExcerpt(content)
  const readTimeInMinutes = getReadTimeInMinutes(content)

  return {
    id: post.id,
    thumbnail,
    content,
    title: post.data.title,
    shortTitle: post.data.shortTitle,
    description: post.data.description,
    excerpt,
    readTimeInMinutes,
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

function getOtherPublicationContent(id: string, contentFile: string): string {
  const base = path.join(process.cwd(), 'src', 'content', 'other-publications')
  const filePath = path.join(base, contentFile)
  if (!filePath.startsWith(base)) {
    throw new Error(`Invalid content file path for ${id}`)
  }
  const file = readFileSync(filePath, 'utf-8')
  return matter(file).content
}

function getExcerpt(content: string) {
  const lines = content.split('\n')
  return lines.find((line) => line.trim().length > 0)
}

const AVERAGE_WORDS_PER_MINUTE = 183

function getReadTimeInMinutes(content: string) {
  const words = content
    .split('\n')
    .join(' ')
    .split(' ')
    .filter((word) => word !== '')
  return Math.max(5, Math.round(words.length / AVERAGE_WORDS_PER_MINUTE))
}
