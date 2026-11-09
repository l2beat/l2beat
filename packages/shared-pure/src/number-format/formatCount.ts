import { pluralize } from '../utils/pluralize.js'
import { formatInteger } from './formatInteger.js'

export function formatCount(count: number, word: string, plural?: string) {
  return `${formatInteger(count)} ${pluralize(count, word, plural)}`
}
