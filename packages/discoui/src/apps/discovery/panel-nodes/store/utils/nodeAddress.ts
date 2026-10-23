// A graph can draw one address more than once, each copy in its own scope,
// e.g. once per permission role. Copies are keyed `scope|address`.
const COPY_SEPARATOR = '|'

export function toCopyId(scope: string, address: string): string {
  return `${scope}${COPY_SEPARATOR}${address}`
}

export function nodeAddress(id: string): string {
  return id.slice(id.lastIndexOf(COPY_SEPARATOR) + 1)
}
