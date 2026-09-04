// Shiki, loaded once, with the pure-JS regex engine (no WASM to ship) and only the two grammars we need.

import { createHighlighterCore, type HighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
import { bundledLanguages } from 'shiki/langs'
import { bundledThemes } from 'shiki/themes'

export const THEME = 'github-light'
export type Lang = 'solidity' | 'json'

export interface Token {
  text: string
  color?: string
  /** char offset of the token in the whole text */
  offset: number
}

let promise: Promise<HighlighterCore> | undefined

export function getHighlighter(): Promise<HighlighterCore> {
  if (!promise) {
    promise = createHighlighterCore({
      themes: [bundledThemes[THEME]],
      langs: [bundledLanguages.solidity, bundledLanguages.json],
      engine: createJavaScriptRegexEngine({ forgiving: true }),
    })
  }
  return promise
}

const cache = new Map<string, Promise<Token[][]>>()

/** Tokens per line with absolute offsets. Cached per text, so switching steps does not re-tokenize. */
export function tokenize(text: string, lang: Lang): Promise<Token[][]> {
  const key = `${lang}\n${text}`
  let hit = cache.get(key)
  if (!hit) {
    hit = getHighlighter().then((highlighter) =>
      highlighter.codeToTokensBase(text, { lang, theme: THEME }).map((line) =>
        line.map((t) => ({
          text: t.content,
          color: t.color,
          offset: t.offset,
        })),
      ),
    )
    cache.set(key, hit)
  }
  return hit
}

/** Plain tokens (one per line) used until Shiki is ready. */
export function plainTokens(text: string): Token[][] {
  const out: Token[][] = []
  let offset = 0
  for (const line of text.split('\n')) {
    out.push([{ text: line, offset }])
    offset += line.length + 1
  }
  return out
}
