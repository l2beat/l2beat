import { assert } from '@l2beat/shared-pure'

export function languageJoin(items: string[]) {
  assert(items.length > 0, 'Cannot join empty array')

  if (items.length === 1) {
    return items[0]
  }
  items = [...items]
  // biome-ignore lint/style/noNonNullAssertion: we know it's there
  const last = items.pop()!
  return `${items.join(', ')} and ${last}`
}
