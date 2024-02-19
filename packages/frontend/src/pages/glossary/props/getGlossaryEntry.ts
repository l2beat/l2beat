import { CollectionEntry } from "../../../content/getCollection"

export interface GlossaryEntry {
  id: string
  term: string
  definition: string
  isSpicy: boolean
}

export function getGlossaryEntry(
  entry: CollectionEntry<'glossary'>,
): GlossaryEntry {
  return {
    id: entry.id,
    term: entry.data.term,
    definition: entry.data.definition,
    isSpicy: entry.data.isSpicy,
  }
}
