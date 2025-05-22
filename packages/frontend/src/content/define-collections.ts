import { z } from 'zod/v4'
type CollectionType = 'data' | 'content'

interface CollectionInput<T extends CollectionType, S extends z.Schema> {
  type: T
  schema: S
}

const typeToExtension = {
  content: 'md',
  data: 'json',
} as const

export function defineCollection<
  T extends CollectionType,
  S extends z.Schema,
>(input: CollectionInput<T, S>) {
  return {
    type: input.type,
    schema: input.schema,
    extension: typeToExtension[input.type],
  } as const
}
