export interface GlossaryTerm {
  id: string
  matches: string[]
  description: string
}

/** One of a term's match strings, found as a whole word in any case. */
export interface GlossaryMatch {
  term: GlossaryTerm
  /** Global, for `matchAll`. */
  pattern: RegExp
}

/**
 * Finds which glossary matches occur in a text. The linker and the scan of
 * page data both use it, so they cannot disagree on what a match is.
 *
 * Testing every match against a text compiles and runs ~130 patterns, so it
 * walks the words once and tests only the matches that start with each.
 */
export class GlossaryMatcher {
  /** Longest first, so a longer match claims its text before a shorter one. */
  private readonly matches: IndexedMatch[] = []
  private readonly matchesByFirstWord = new Map<string, IndexedMatch[]>()
  private readonly matchesNotStartingWithWord: IndexedMatch[] = []

  constructor(terms: GlossaryTerm[]) {
    // A later term takes over a match it shares with an earlier one.
    const termByMatch = new Map<string, GlossaryTerm>()
    for (const term of terms) {
      for (const match of term.matches) {
        termByMatch.set(match.toLowerCase(), term)
      }
    }

    const longestFirst = [...termByMatch].sort(
      ([a], [b]) => b.length - a.length,
    )
    for (const [text, term] of longestFirst) {
      const source = `(?<!\\w)${escapeRegExp(text)}(?!\\w)`
      const match = {
        term,
        pattern: new RegExp(source, 'gi'),
        patternAt: new RegExp(source, 'iy'),
      }
      this.matches.push(match)

      const firstWord = /^\w+/.exec(text)?.[0]
      if (firstWord === undefined) {
        this.matchesNotStartingWithWord.push(match)
        continue
      }
      const sameFirstWord = this.matchesByFirstWord.get(firstWord) ?? []
      sameFirstWord.push(match)
      this.matchesByFirstWord.set(firstWord, sameFirstWord)
    }
  }

  /** The matches in the text, longest first. */
  findMatches(text: string): GlossaryMatch[] {
    const found = new Set<IndexedMatch>()
    this.addMatchesIn(text, found)
    return this.matches.filter((match) => found.has(match))
  }

  /** The terms with a match in any of the texts. */
  findTerms(texts: Iterable<string>): Set<GlossaryTerm> {
    const found = new Set<IndexedMatch>()
    for (const text of texts) this.addMatchesIn(text, found)
    return new Set([...found].map((match) => match.term))
  }

  private addMatchesIn(text: string, found: Set<IndexedMatch>) {
    for (const word of text.matchAll(/\w+/g)) {
      const candidates = this.matchesByFirstWord.get(word[0].toLowerCase())
      for (const match of candidates ?? []) {
        if (found.has(match)) continue
        match.patternAt.lastIndex = word.index
        if (match.patternAt.test(text)) found.add(match)
      }
    }
    for (const match of this.matchesNotStartingWithWord) {
      // `search` leaves `lastIndex` alone, which `matchAll` would start from.
      if (!found.has(match) && text.search(match.pattern) !== -1) {
        found.add(match)
      }
    }
  }
}

interface IndexedMatch extends GlossaryMatch {
  /** Sticky, tested where the match could start. */
  patternAt: RegExp
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}
