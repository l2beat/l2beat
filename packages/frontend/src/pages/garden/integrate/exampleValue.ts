// Pure: imported by the page's JSON view, so nothing here may touch the server.

/** A JSON value, possibly with parts cut short - see `Elision`. */
export type ExampleValue =
  | null
  | boolean
  | number
  | string
  | ExampleValue[]
  | ExampleObject

export type ExampleObject = { [key: string]: ExampleValue }

export type ElisionKind = 'value' | 'object' | 'array'

/**
 * Where an example leaves something out, kept as data so the page can render
 * `…`, `{ … }` or `[ … ]` without parsing, and tests can assert on the rest.
 * The key is one no response has, since every response schema is strict.
 */
export type Elision = { '…': ElisionKind }

export function elided(kind: ElisionKind): Elision {
  return { '…': kind }
}

export function getElision(value: ExampleValue): ElisionKind | undefined {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return undefined
  }
  const kind = value['…']
  return typeof kind === 'string' ? (kind as ElisionKind) : undefined
}
