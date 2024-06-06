import { CollectionEntry } from '../../../content/getCollection'

export interface GlossaryEntry {
  id: string
  term: string
  definition: string
  isSpicy: boolean
  match?: string[]
}

export function getGlossaryEntry(
  entry: CollectionEntry<'glossary'>,
): GlossaryEntry {
  return {
    id: entry.id,
    term: entry.data.term,
    definition: entry.data.definition,
    isSpicy: entry.data.isSpicy,
    match: entry.data.match,
  }
}
