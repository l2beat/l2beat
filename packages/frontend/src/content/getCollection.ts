import { assertUnreachable } from '@l2beat/shared-pure'
import { readdirSync, readFileSync } from 'fs'
import matter from 'gray-matter'
import MarkdownIt from 'markdown-it'
import path from 'path'
import { z } from 'zod'

import { collections } from './collections'

type Collection = typeof collections
type CollectionKey = keyof Collection

type JSONCollectionKey = {
  [K in CollectionKey]: Collection[K]['extension'] extends 'json' ? K : never
}[CollectionKey]
type MarkdownCollectionKey = {
  [K in CollectionKey]: Collection[K]['extension'] extends 'md' ? K : never
}[keyof Collection]

export type CollectionEntry<T extends CollectionKey> =
  T extends JSONCollectionKey
    ? JSONCollectionEntry<T>
    : MarkdownCollectionEntry<T>

interface JSONCollectionEntry<T extends CollectionKey> {
  id: string
  data: z.infer<Collection[T]['schema']>
}
interface MarkdownCollectionEntry<T extends CollectionKey> {
  id: string
  data: z.infer<Collection[T]['schema']>
  content: string
}

export function getCollection<T extends CollectionKey>(
  key: T,
): CollectionEntry<T>[] {
  const collection = collections[key]

  switch (collection.extension) {
    case 'json':
      return getJsonCollection(key as JSONCollectionKey) as CollectionEntry<T>[]
    case 'md':
      return getMarkdownCollection(
        key as MarkdownCollectionKey,
      ) as CollectionEntry<T>[]
    default:
      assertUnreachable(collection)
  }
}

function getJsonCollection<T extends JSONCollectionKey>(
  key: T,
): JSONCollectionEntry<T>[] {
  const collection = collections[key]
  const files = readdirSync(`./${key}`)

  const parsedFiles = files
    .filter((file) => file.endsWith(collection.extension))
    .map((file) => {
      const content = readFileSync(`./${key}/${file}`)
      const json: unknown = JSON.parse(content.toString())
      const data = collection.schema.parse(json)

      return {
        id: file.replace(`.${collection.extension}`, ''),
        data,
      }
    })

  return parsedFiles
}

function getMarkdownCollection<T extends MarkdownCollectionKey>(
  key: T,
): MarkdownCollectionEntry<T>[] {
  const collection = collections[key]
  const fileNames = readdirSync(path.join(__dirname, key))
  const markdownIt = MarkdownIt()
  const parsedFiles = fileNames
    .filter((fileName) => fileName.endsWith(collection.extension))
    .map((fileName) => {
      const file = readFileSync(path.join(__dirname, key, fileName))
      const parsedFile = matter(file.toString())
      const markdown = markdownIt.render(parsedFile.content.toString())
      const data = collection.schema.parse(parsedFile.data)

      return {
        id: fileName.replace(`.${collection.extension}`, ''),
        data,
        content: markdown,
      }
    })

  return parsedFiles
}
