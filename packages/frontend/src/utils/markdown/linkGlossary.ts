import { getCollection } from '../../content/getCollection'
import { getGlossaryEntry } from '../../pages/glossary/props/getGlossaryEntry'

const glossary = getCollection('glossary')
const entries = glossary.map(getGlossaryEntry)

export function createGlossaryLink(id: string, term: string) {
  const href = `/glossary#${id}`

  return `[${term}](${href})`
}

export function linkGlossaryTerms(text: string): string {
  const glossaryTerms = entries.map((item) => item.term)
  const pattern = new RegExp(`\\b(${glossaryTerms.join('|')})\\b`, 'gi')

  return text.replace(pattern, (match) => {
    const glossaryItem = entries.find((item) =>
      new RegExp(`^${item.term}$`, 'i').test(match),
    )
    return glossaryItem ? createGlossaryLink(glossaryItem.id, match) : match
  })
}
