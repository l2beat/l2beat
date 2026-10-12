import MarkdownIt from 'markdown-it'

/** The options every renderer starts from, so content reads the same wherever it is rendered. */
export function createMarkdown() {
  return MarkdownIt({ html: true, typographer: true })
}
