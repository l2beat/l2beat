import {
  GlossaryMatcher,
  type GlossaryTerm,
} from '~/utils/markdown/glossaryMatcher'

/**
 * The glossary terms the client needs to link markdown exactly as the server
 * did, instead of the whole glossary.
 *
 * The client links markdown twice: when it hydrates what the server rendered,
 * and when it mounts markdown the server never rendered (closed collapsibles,
 * dialogs, tooltips). The second always renders strings from the page data,
 * so every term the data mentions covers it. Most of the first does too, but
 * a page can render markdown it imports instead of receiving it (the FAQ
 * answers), so this adds the terms the server linked.
 *
 * Linking with this subset gives the same output as with the whole glossary,
 * because a term that does not occur in the text never claims any of it.
 */
export function getClientGlossaryTerms(
  terms: GlossaryTerm[],
  linkedTermIds: ReadonlySet<string>,
  pageData: unknown,
): GlossaryTerm[] {
  const mentioned = new GlossaryMatcher(terms).findTerms(
    collectStrings(pageData),
  )
  return terms.filter(
    (term) => linkedTermIds.has(term.id) || mentioned.has(term),
  )
}

function collectStrings(value: unknown, strings = new Set<string>()) {
  if (typeof value === 'string') {
    strings.add(value)
  } else if (value !== null && typeof value === 'object') {
    for (const child of Object.values(value)) collectStrings(child, strings)
  }
  return strings
}
