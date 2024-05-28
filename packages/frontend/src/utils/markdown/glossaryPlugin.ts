import MarkdownIt from 'markdown-it'
import { getCollection } from '../../content/getCollection'
import { getGlossaryEntry } from '../../pages/glossary/props/getGlossaryEntry'

const glossary = getCollection('glossary')

const entries = glossary.map(getGlossaryEntry)

export function createGlossaryLink(id: string, term: string) {
  const href = `/glossary#${id}`

  // markdown
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

// Glossary plugin to replace glossary terms with links
export function glossaryPlugin(md: MarkdownIt) {
  // Adding a rule to the inline ruler
  md.core.ruler.after('inline', 'glossary', (state) => {
    // Iterate over all tokens
    state.tokens.forEach((blockToken) => {
      // Only process inline tokens with children
      if (blockToken.type !== 'inline' || !blockToken.children) {
        return
      }

      // Iterate over all child tokens of the inline token
      blockToken.children.forEach((token) => {
        // Process text tokens to replace glossary terms
        if (token.type === 'text') {
          token.content = linkGlossaryTerms(token.content)
        }
      })
    })
  })
}
