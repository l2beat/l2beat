import type { GlossaryTerm } from '~/components/markdown/GlossaryContext'
import { getCollection } from '~/content/getCollection'

export function getGlossaryTerms(): GlossaryTerm[] {
  return getCollection('glossary').map((term) => ({
    id: term.id,
    matches: [term.data.term, ...(term.data.match ?? [])],
    description: term.data.definition,
  }))
}
