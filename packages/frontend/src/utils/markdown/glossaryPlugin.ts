import MarkdownIt from 'markdown-it'
import { getCollection } from '../../content/getCollection'
import { getGlossaryEntry } from '../../pages/glossary/props/getGlossaryEntry'

const glossary = getCollection('glossary')
const entries = glossary.map(getGlossaryEntry)

const termToId = new Map(
  entries.flatMap((entry) =>
    [entry.term]
      .concat(entry.match ?? [])
      .map((term) => [term.toLowerCase(), entry.id]),
  ),
)

const glossaryTerms = [...termToId.keys()].map(escapeRegExp)

/**
 * \\b: Word boundary to ensure whole word matching.
 * (${glossaryTerms.join('|')}): Matches any term in the glossary.
 */
const pattern = new RegExp(`\\b(${glossaryTerms.join('|')})\\b`, 'gi')

export function linkGlossaryTerms(text: string): string {
  const linkOffsets = getAllLinksOffsets(text)

  const isWithinExistingLink = (position: number) => {
    return linkOffsets.some(
      (link) => position >= link.start && position <= link.end,
    )
  }

  // Replace glossary terms with links, avoiding existing markdown links
  return text.replace(pattern, (matchedTerm, ...maybeOffset) => {
    // Since we are using a regex with a single capture group, the last two arguments are the offset and the full string, rest of the arguments are the matched term where the amount of terms is unknown and potentially empty
    const offset = maybeOffset.at(-2)

    if (isWithinExistingLink(offset)) {
      return matchedTerm // Don't replace if within an existing link
    }
    const glossaryTermId = termToId.get(matchedTerm.toLowerCase())

    return glossaryTermId
      ? createGlossaryLink(glossaryTermId, matchedTerm)
      : matchedTerm
  })
}

export function glossaryPlugin(md: MarkdownIt) {
  const defaultRender =
    md.renderer.rules.link_open ??
    function (tokens, idx, options, _env, self) {
      return self.renderToken(tokens, idx, options)
    }

  md.renderer.rules.link_open = (tokens, index, options, env, self) => {
    const token = tokens[index]
    if (isGlossaryLink(token.attrGet('href'))) {
      token.attrSet('data-link-role', 'glossary')
    }
    return defaultRender(tokens, index, options, env, self)
  }
}

function createGlossaryLink(id: string, term: string) {
  const href = `/glossary#${id}`

  return `[${term}](${href})`
}

// Escape special characters in the term to use it in a regex pattern
function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

function getAllLinksOffsets(text: string) {
  const p = /\[([^\]]+)\]\(([^)]+)\)/g
  return [...text.matchAll(p)].map((match) => ({
    start: match.index,
    end: match.index + match[0].length,
  }))
}

function isGlossaryLink(href: string | null) {
  return href?.includes('/glossary#')
}
