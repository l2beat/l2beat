// NOTE(imxeno): This file doesn't match the casing, as the last collection
// definition is linked from the frontend2 package, and there we use
// kebab-case for filenames.

type CollectionType = 'data' | 'content'

interface CollectionInput<T extends CollectionType, S extends Zod.Schema> {
  type: T
  schema: S
}

const typeToExtension = {
  content: 'md',
  data: 'json',
} as const

export function defineCollection<
  T extends CollectionType,
  S extends Zod.Schema,
>(input: CollectionInput<T, S>) {
  return {
    type: input.type,
    schema: input.schema,
    extension: typeToExtension[input.type],
  } as const
}
