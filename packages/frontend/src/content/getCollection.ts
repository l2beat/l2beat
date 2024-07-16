import { readFileSync, readdirSync } from 'fs'
import path from 'path'
import { z } from 'zod'
import { collections } from './collections'

type Collection = typeof collections
type CollectionKey = keyof Collection

type DataCollectionKey = {
  [K in CollectionKey]: Collection[K]['type'] extends 'data' ? K : never
}[CollectionKey]

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

export function getCollection<T extends CollectionKey>(
  key: T,
): CollectionEntry<T>[] {
  const collection = collections[key]

  switch (collection.type) {
    case 'data':
      return getDataCollection(key as DataCollectionKey) as CollectionEntry<T>[]
  }
}
function getDataCollection<T extends DataCollectionKey>(
  key: T,
): DataCollectionEntry<T>[] {
  const collection = collections[key]
  const fileNames = readdirSync(path.join(__dirname, key))

  const parsedFiles = fileNames
    .filter((fileName) => fileName.endsWith(collection.extension))
    .map((fileName) => fileName.replace(`.${collection.extension}`, ''))
    .map((fileName) => getDataCollectionEntry(key, fileName))

  return parsedFiles
}

function getDataCollectionEntry<T extends DataCollectionKey>(
  key: T,
  id: string,
): DataCollectionEntry<T> {
  const contentEntry = collections[key]
  const file = readFileSync(
    path.join(__dirname, key, `${id}.${contentEntry.extension}`),
  )

  const json: unknown = JSON.parse(file.toString())
  const data = contentEntry.schema.parse(json)

  return {
    id,
    data,
  }
}
