import type { GlossaryTerm } from '~/components/markdown/GlossaryContext'
import { escapeRegExp } from '~/utils/markdown/glossaryPlugin'

/**
 * The glossary terms the client needs to link markdown exactly as the server
 * did, instead of the whole glossary.
 *
 * The client links markdown twice: when it hydrates what the server rendered,
 * and when it mounts markdown the server never rendered (closed collapsibles,
 * dialogs, tooltips). The first needs
 * the terms the server linked. The second always renders strings from the
 * page data, so every term the data mentions covers it.
 *
 * Linking with this subset gives the same output as with the whole glossary,
 * because a term that does not occur in the text never claims any of it.
 */
export function getClientGlossaryTerms(
  terms: GlossaryTerm[],
  linkedTermIds: ReadonlySet<string>,
  pageData: unknown,
): GlossaryTerm[] {
  const mentioned = findMentionedTermIds(terms, collectStrings(pageData))
  // Keeps the glossary order, so a match shared by two terms resolves to the
  // same term as on the server.
  return terms.filter(
    (term) => linkedTermIds.has(term.id) || mentioned.has(term.id),
  )
}

/**
 * Finds the terms with a match in any text, by the same rule as
 * `linkGlossaryTerms` (whole words, any case) but ignoring links and code, so
 * it returns a superset of the terms that linking would use.
 *
 * Testing every match against every string costs ~10 ms on a project page, so
 * it walks the words once and tests only the matches that start with each.
 */
function findMentionedTermIds(
  terms: GlossaryTerm[],
  texts: Iterable<string>,
): Set<string> {
  const matchesByFirstWord = new Map<string, TermMatch[]>()
  const matchesNotStartingWithWord: TermMatch[] = []
  for (const term of terms) {
    for (const match of term.matches) {
      const firstWord = /^\w+/.exec(match)?.[0].toLowerCase()
      if (firstWord === undefined) {
        matchesNotStartingWithWord.push({
          termId: term.id,
          pattern: new RegExp(`(?<!\\w)${escapeRegExp(match)}(?!\\w)`, 'i'),
        })
        continue
      }
      const sameFirstWord = matchesByFirstWord.get(firstWord) ?? []
      // Sticky: tested only at the start of a word, which also stands in for
      // the `(?<!\w)` before a match.
      sameFirstWord.push({
        termId: term.id,
        pattern: new RegExp(`${escapeRegExp(match)}(?!\\w)`, 'iy'),
      })
      matchesByFirstWord.set(firstWord, sameFirstWord)
    }
  }

  const found = new Set<string>()
  for (const text of texts) {
    for (const word of text.matchAll(/\w+/g)) {
      for (const match of matchesByFirstWord.get(word[0].toLowerCase()) ?? []) {
        if (found.has(match.termId)) continue
        match.pattern.lastIndex = word.index
        if (match.pattern.test(text)) found.add(match.termId)
      }
    }
    for (const match of matchesNotStartingWithWord) {
      if (!found.has(match.termId) && match.pattern.test(text)) {
        found.add(match.termId)
      }
    }
  }
  return found
}

interface TermMatch {
  termId: string
  pattern: RegExp
}

function collectStrings(value: unknown, strings = new Set<string>()) {
  if (typeof value === 'string') {
    strings.add(value)
  } else if (value !== null && typeof value === 'object') {
    for (const child of Object.values(value)) collectStrings(child, strings)
  }
  return strings
}
