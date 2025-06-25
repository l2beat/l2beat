import type { Parser, Validator } from '@l2beat/validate'

type CollectionType = 'data' | 'content'

interface CollectionInput<
  T extends CollectionType,
  P,
  S extends Validator<P> | Parser<P>,
> {
  type: T
  schema: S
}

const typeToExtension = {
  content: 'md',
  data: 'json',
} as const

export function defineCollection<
  T extends CollectionType,
  P,
  S extends Validator<P> | Parser<P>,
>(input: CollectionInput<T, P, S>) {
  return {
    type: input.type,
    schema: input.schema,
    extension: typeToExtension[input.type],
  } as const
}
