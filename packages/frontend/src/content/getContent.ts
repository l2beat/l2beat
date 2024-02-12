import { readdirSync, readFileSync } from 'fs'
import path from 'path'
import { z } from 'zod'

import { content } from './content'

type Content = typeof content
type ContentKey = keyof Content

export interface ContentEntry<T extends ContentKey> {
  id: string
  data: z.output<Content[T]['schema']>
}

export function getContent<T extends ContentKey>(key: T): ContentEntry<T>[] {
  const fileNames = readdirSync(path.join(__dirname, key))

  const parsedFiles = fileNames
    .filter((fileName) => fileName.endsWith('json'))
    .map((fileName) => fileName.replace(`.json`, ''))
    .map((fileName) => getContentEntry(key, fileName))

  return parsedFiles
}

export function getContentEntry<T extends ContentKey>(
  key: T,
  id: string,
): ContentEntry<T> {
  const contentEntry = content[key]
  const file = readFileSync(path.join(__dirname, key, `${id}.json`))

  const json: unknown = JSON.parse(file.toString())
  const parsedJson = contentEntry.schema.safeParse(json)

  if (!parsedJson.success) {
    throw new Error(
      `Failed to parse ${key}/${id}.json: ${parsedJson.error.message}`,
    )
  }

  return {
    id,
    data: parsedJson.data,
  }
}
