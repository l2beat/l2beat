import MarkdownIt from 'markdown-it'
import { useId } from 'react'
import { cn } from '~/utils/cn'
import {
  glossaryPlugin,
  linkGlossaryTerms,
} from '~/utils/markdown/glossaryPlugin'
import { outLinksPlugin } from '~/utils/markdown/outlinksPlugin'
import { useGlossaryContext } from './GlossaryContext'
import { GlossaryTooltipWrapper } from './GlossaryTooltipWrapper'

interface MarkdownProps {
  children: string
  inline?: boolean
  className?: string
  ignoreGlossary?: boolean
}

const markdown = MarkdownIt({
  html: true,
  typographer: true,
})
  .use(outLinksPlugin)
  .use(glossaryPlugin)

function dedent(text: string): string {
  const lines = text.split('\n')
  let minIndent = Number.POSITIVE_INFINITY
  for (const line of lines) {
    if (line.trim() === '') continue
    const match = line.match(/^[ \t]*/)
    if (match) minIndent = Math.min(minIndent, match[0].length)
    if (minIndent === 0) break
  }
  if (!Number.isFinite(minIndent) || minIndent === 0) return text
  return lines.map((l) => l.slice(minIndent)).join('\n')
}

export function Markdown(props: MarkdownProps) {
  const terms = useGlossaryContext()
  const Comp = props.inline ? 'span' : 'div'
  const render = (text: string) =>
    props.inline ? markdown.renderInline(text) : markdown.render(text)

  // Template-literal markdown is usually written indented inside TS source.
  // Strip the common leading indent from every line so list items and
  // **bold** paragraphs aren't interpreted as indented code blocks.
  const stripped = dedent(props.children)

  // Markdown-it does not support pre-render hooks and token rerendering so
  // we have to the do linking of glossary terms here explicitly.
  const rendered = render(
    props.ignoreGlossary ? stripped : linkGlossaryTerms(terms)(stripped),
  )
  const collapsed = processCollapsibleText(rendered)

  return (
    <GlossaryTooltipWrapper>
      <Comp
        className={cn('mdc', props.className)}
        dangerouslySetInnerHTML={{ __html: collapsed }}
      />
    </GlossaryTooltipWrapper>
  )
}

/**
 * Processes custom markdown syntax for collapsible text using HTML with Tailwind CSS
 * Format: [label: hidden content]
 * Uses the native <details> and <summary> elements with Tailwind classes
 */
function processCollapsibleText(markdown: string): string {
  const collapsiblePattern = /\[([^:]+):\s*(.*?)\]/g

  return markdown.replace(collapsiblePattern, (_match, label, content) => {
    const uniqueId = useId()
    return `<button class="inline text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded px-1 text-sm cursor-pointer select-none hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-600" onclick="document.getElementById('${uniqueId}').classList.toggle('hidden')">${label}</button><span id="${uniqueId}" class="hidden ml-1">${content}</span>`
  })
}
