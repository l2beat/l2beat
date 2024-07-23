import { uniqBy } from 'lodash'

export function withoutDuplicates<T>(arr: T[]): T[] {
  return uniqBy(arr, JSON.stringify)
}
