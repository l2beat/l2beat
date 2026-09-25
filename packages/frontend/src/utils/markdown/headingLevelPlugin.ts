import type MarkdownIt from 'markdown-it'
import type Token from 'markdown-it/lib/token.mjs'

export interface HeadingLevelEnv {
  /** Level of the heading the markdown is rendered under; 0 at page level. */
  parentHeadingLevel?: number
}

/**
 * Inside a project section, a snippet's top heading would otherwise compete
 * with the page's h1 or skip levels, depending on whether its author started
 * at `#` or `##`. Tags are moved so the snippet's top heading sits one level
 * below the parent, while the `mdc-h{n}` class keeps the look of the level
 * the author wrote.
 */
export function headingLevelPlugin(md: MarkdownIt) {
  md.core.ruler.push('heading_level', (state) => {
    const { parentHeadingLevel = 0 } = state.env as HeadingLevelEnv
    const headings = state.tokens.filter(
      (token) =>
        token.type === 'heading_open' || token.type === 'heading_close',
    )
    const shift = levelShift(headings, parentHeadingLevel)
    for (const token of headings) {
      const authoredLevel = headingLevel(token)
      if (token.type === 'heading_open') {
        token.attrJoin('class', `mdc-h${authoredLevel}`)
      }
      token.tag = `h${Math.min(authoredLevel + shift, 6)}`
    }
  })
}

/** At page level the authored levels are kept as they are. */
function levelShift(headings: Token[], parentHeadingLevel: number): number {
  if (parentHeadingLevel === 0 || headings.length === 0) {
    return 0
  }
  const topAuthoredLevel = Math.min(...headings.map(headingLevel))
  return parentHeadingLevel + 1 - topAuthoredLevel
}

function headingLevel(token: Token): number {
  return Number(token.tag.slice(1))
}
