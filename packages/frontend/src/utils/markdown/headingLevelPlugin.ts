import type MarkdownIt from 'markdown-it'

export interface HeadingLevelEnv {
  /** Level of the heading the markdown is rendered under; 0 at page level. */
  parentHeadingLevel?: number
}

/**
 * Authors write `#` for the top heading of a markdown snippet, but inside a
 * project section that would compete with the page's h1. Tags are pushed below
 * the parent heading so the outline stays nested, while the `mdc-h{n}` class
 * keeps the look of the level the author wrote.
 */
export function headingLevelPlugin(md: MarkdownIt) {
  md.core.ruler.push('heading_level', (state) => {
    const { parentHeadingLevel = 0 } = state.env as HeadingLevelEnv
    for (const token of state.tokens) {
      if (token.type !== 'heading_open' && token.type !== 'heading_close') {
        continue
      }
      const authoredLevel = Number(token.tag.slice(1))
      if (token.type === 'heading_open') {
        token.attrJoin('class', `mdc-h${authoredLevel}`)
      }
      token.tag = `h${Math.min(authoredLevel + parentHeadingLevel, 6)}`
    }
  })
}
