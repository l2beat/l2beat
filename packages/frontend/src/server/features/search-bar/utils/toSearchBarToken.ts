import pick from 'lodash/pick'
import type { SearchBarToken, SearchBarTokenEntry } from '../types'

export const SEARCH_BAR_TOKEN_KEYS = [
  'category',
  'name',
  'href',
  'type',
  'id',
  'iconUrl',
  'issuer',
] as const satisfies (keyof SearchBarTokenEntry)[]

export function toSearchBarToken(entry: SearchBarTokenEntry): SearchBarToken {
  return pick(entry, SEARCH_BAR_TOKEN_KEYS)
}
