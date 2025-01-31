import { readFileSync, readdirSync } from 'fs'
import path from 'path'
import { assertUnreachable } from '@l2beat/shared-pure'
import matter from 'gray-matter'
import type { z } from 'zod'

import { startsWithLetterOrNumber } from '~/utils/starts-with-letter-or-number'
import { collections } from './collections'

type Collection = typeof collections
type CollectionKey = keyof Collection

type DataCollectionKey = {
  [K in CollectionKey]: Collection[K]['type'] extends 'data' ? K : never
}[CollectionKey]
type ContentCollectionKey = {
  [K in CollectionKey]: Collection[K]['type'] extends 'content' ? K : never
}[keyof Collection]

interface DataCollectionEntry<T extends CollectionKey> {
  id: string
  data: z.infer<Collection[T]['schema']>
}
interface ContentCollectionEntry<T extends CollectionKey> {
  id: string
  data: z.infer<Collection[T]['schema']>
  content: string
  excerpt: string
  readTimeInMinutes: number
}
export type CollectionEntry<T extends CollectionKey> =
  T extends DataCollectionKey
    ? DataCollectionEntry<T>
    : ContentCollectionEntry<T>

const DIR_PATH = path.join('.', 'src', 'content')

export function getCollection<T extends CollectionKey>(
  key: T,
): CollectionEntry<T>[] {
  const collection = collections[key]

  switch (collection.type) {
    case 'data':
      return getDataCollection(key as DataCollectionKey) as CollectionEntry<T>[]
    case 'content':
      return getContentCollection(
        key as ContentCollectionKey,
      ) as CollectionEntry<T>[]
    default:
      assertUnreachable(collection)
  }
}

function getDataCollection<T extends DataCollectionKey>(
  key: T,
): DataCollectionEntry<T>[] {
  const collection = collections[key]
  const fileNames = readdirSync(path.join(process.cwd(), DIR_PATH, key))

  const parsedFiles = fileNames
    .filter((fileName) => fileName.endsWith(collection.extension))
    .map((fileName) => fileName.replace(`.${collection.extension}`, ''))
    .map((fileName) => getDataCollectionEntry(key, fileName))

  return parsedFiles
}

export function getCollectionEntry<T extends CollectionKey>(
  key: T,
  id: string,
): CollectionEntry<T> | undefined {
  try {
    const collection = collections[key]

    switch (collection.type) {
      case 'data':
        return getDataCollectionEntry(
          key as DataCollectionKey,
          id,
        ) as CollectionEntry<T>
      case 'content':
        return getContentCollectionEntry(
          key as ContentCollectionKey,
          id,
        ) as CollectionEntry<T>
      default:
        assertUnreachable(collection)
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    return undefined
  }
}

function getContentCollection<T extends ContentCollectionKey>(
  key: T,
): ContentCollectionEntry<T>[] {
  const contentEntry = collections[key]
  const fileNames = readdirSync(path.join(process.cwd(), DIR_PATH, key))
  const parsedFiles = fileNames
    .filter((fileName) => fileName.endsWith(contentEntry.extension))
    .map((fileName) => fileName.replace(`.${contentEntry.extension}`, ''))
    .map((fileName) => getContentCollectionEntry(key, fileName))

  return parsedFiles
}

function getDataCollectionEntry<T extends DataCollectionKey>(
  key: T,
  id: string,
): DataCollectionEntry<T> {
  const contentEntry = collections[key]
  const file = readFileSync(
    path.join(DIR_PATH, key, `${id}.${contentEntry.extension}`),
  )

  const json: unknown = JSON.parse(file.toString())
  const data = contentEntry.schema.parse(json)

  return {
    id,
    data,
  }
}

function getContentCollectionEntry<T extends ContentCollectionKey>(
  key: T,
  id: string,
): ContentCollectionEntry<T> {
  const contentEntry = collections[key]
  const file = readFileSync(
    path.join(process.cwd(), DIR_PATH, key, `${id}.${contentEntry.extension}`),
  )
  const parsedFile = matter(file.toString())

  const data = contentEntry.schema.parse(parsedFile.data)
  const excerpt = getExcerpt(parsedFile.content)
  const readTimeInMinutes = getReadTimeInMinutes(parsedFile.content)

  return {
    id,
    data,
    content: parsedFile.content,
    excerpt,
    readTimeInMinutes,
  }
}

function getExcerpt(content: string) {
  const lines = content.split('\n')
  const line = lines.find((line) => startsWithLetterOrNumber(line))
  if (!line) {
    throw new Error('No paragraph found')
  }
  return line
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
