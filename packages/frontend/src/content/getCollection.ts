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

export function getCollectionEntry<T extends CollectionKey>(
  key: T,
  id: string,
): CollectionEntry<T> {
  const collection = collections[key]

  switch (collection.extension) {
    case 'json':
      return getJsonCollectionEntry(
        key as JSONCollectionKey,
        id,
      ) as CollectionEntry<T>
    case 'md':
      return getMarkdownCollectionEntry(
        key as MarkdownCollectionKey,
        id,
      ) as CollectionEntry<T>
    default:
      assertUnreachable(collection)
  }
}

function getJsonCollection<T extends JSONCollectionKey>(
  key: T,
): JSONCollectionEntry<T>[] {
  const collection = collections[key]
  const fileNames = readdirSync(`./${key}`)

  const parsedFiles = fileNames
    .filter((fileName) => fileName.endsWith(collection.extension))
    .map((fileName) => fileName.replace(`.${collection.extension}`, ''))
    .map((fileName) => getJsonCollectionEntry(key, fileName))

  return parsedFiles
}

function getMarkdownCollection<T extends MarkdownCollectionKey>(
  key: T,
): MarkdownCollectionEntry<T>[] {
  const collection = collections[key]
  const fileNames = readdirSync(path.join(__dirname, key))
  const parsedFiles = fileNames
    .filter((fileName) => fileName.endsWith(collection.extension))
    .map((fileName) => fileName.replace(`.${collection.extension}`, ''))
    .map((fileName) => getMarkdownCollectionEntry(key, fileName))

  return parsedFiles
}

function getJsonCollectionEntry<T extends JSONCollectionKey>(
  key: T,
  id: string,
): JSONCollectionEntry<T> {
  const collection = collections[key]
  const file = readFileSync(
    path.join(__dirname, key, `${id}.${collection.extension}`),
  )

  const json: unknown = JSON.parse(file.toString())
  const data = collection.schema.parse(json)

  return {
    id,
    data,
  }
}

function getMarkdownCollectionEntry<T extends MarkdownCollectionKey>(
  key: T,
  id: string,
): MarkdownCollectionEntry<T> {
  const collection = collections[key]
  const file = readFileSync(
    path.join(__dirname, key, `${id}.${collection.extension}`),
  )
  const parsedFile = matter(file.toString())
  const markdown = MarkdownIt().render(parsedFile.content.toString())
  const data = collection.schema.parse(parsedFile.data)

  return {
    id,
    data,
    content: markdown,
  }
}
