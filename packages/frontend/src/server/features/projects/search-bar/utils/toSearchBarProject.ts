import pick from 'lodash/pick'
import type { SearchBarProject, SearchBarProjectEntry } from '../types'

export const SEARCH_BAR_PROJECT_KEYS = [
  'category',
  'name',
  'href',
  'type',
  'id',
  'iconUrl',
  'kind',
  'isUpcoming',
  'scalingCategory',
] as const

export function toSearchBarProject(
  entry: SearchBarProjectEntry,
): SearchBarProject {
  return pick(entry, SEARCH_BAR_PROJECT_KEYS)
}
