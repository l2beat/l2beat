import MarkdownIt from 'markdown-it'
import { cn } from '../utils/cn'

interface MarkdownProps {
  children: string
  inline?: boolean
  className?: string
}

function highlightDiff(str: string, escapeHtml: (s: string) => string): string {
  const lines = str.split('\n').map((line) => {
    const escaped = escapeHtml(line)
    // File markers (+++ / ---) are not add/remove lines; check first.
    if (line.startsWith('+++') || line.startsWith('---')) {
      return `<span class="mdc-diff-meta">${escaped}</span>`
    }
    if (line.startsWith('+')) {
      return `<span class="mdc-diff-add">${escaped}</span>`
    }
    if (line.startsWith('-')) {
      return `<span class="mdc-diff-del">${escaped}</span>`
    }
    if (line.startsWith('@@')) {
      return `<span class="mdc-diff-hunk">${escaped}</span>`
    }
    return escaped
  })
  return `<pre class="mdc-diff"><code>${lines.join('\n')}</code></pre>`
}

const markdown: MarkdownIt = MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: (str, lang) =>
    lang === 'diff' ? highlightDiff(str, markdown.utils.escapeHtml) : '',
})

// Render every markdown anchor as a safe external link (new tab, no referrer).
const defaultLinkOpen =
  markdown.renderer.rules.link_open ??
  ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options))

markdown.renderer.rules.link_open = (tokens, idx, options, env, self) => {
  const token = tokens[idx]
  if (token) {
    const setAttr = (name: string, value: string) => {
      const i = token.attrIndex(name)
      if (i < 0) {
        token.attrPush([name, value])
      } else {
        const attr = token.attrs?.[i]
        if (attr) {
          attr[1] = value
        }
      }
    }
    setAttr('target', '_blank')
    setAttr('rel', 'noopener noreferrer')
  }
  return defaultLinkOpen(tokens, idx, options, env, self)
}

export function Markdown(props: MarkdownProps) {
  const Comp = props.inline ? 'span' : 'div'
  const render = (text: string) =>
    props.inline ? markdown.renderInline(text) : markdown.render(text)

  const rendered = render(props.children)

  return (
    <Comp
      className={cn('mdc', props.className)}
      dangerouslySetInnerHTML={{ __html: rendered }}
    />
  )
}
