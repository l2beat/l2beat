import { getCollection } from '~/content/getCollection'
import type { GlossaryTerm } from '~/utils/markdown/glossaryMatcher'

export function getGlossaryTerms(): GlossaryTerm[] {
  return getCollection('glossary').map((term) => ({
    id: term.id,
    matches: [term.data.term, ...(term.data.match ?? [])],
    description: term.data.definition,
  }))
}
