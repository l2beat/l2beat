import MarkdownIt from 'markdown-it'

import { cn } from '~/utils/cn'
import {
  glossaryPlugin,
  linkGlossaryTerms,
} from '~/utils/markdown/glossary-plugin'
import { outLinksPlugin } from '~/utils/markdown/outlinks-plugin'
import { useGlossaryContext } from './glossary-context'

export interface MarkdownProps {
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

export function Markdown(props: MarkdownProps) {
  const terms = useGlossaryContext()
  const Comp = props.inline ? 'span' : 'div'
  const render = (text: string) =>
    props.inline ? markdown.renderInline(text) : markdown.render(text)

  // This is a hack to remove leading spaces, to prevent the appearance of
  // unwanted code blocks. Use backticks instead.
  // Don't strip spaces if they're followed by a '*' (bullet point in markdown)
  const stripped = props.children.replace(
    /(^|\n)(?:\t|\s{4})(?!\*)(.+)/g,
    '$1$2',
  )

  if (props.ignoreGlossary) {
    const rendered = render(stripped)
    const collapsed = processCollapsibleText(rendered)

    return (
      <Comp
        className={cn('mdc', props.className)}
        dangerouslySetInnerHTML={{ __html: collapsed }}
      />
    )
  }

  // Markdown-it does not support pre-render hooks and token rerendering so
  // we have to the do linking of glossary terms here explicitly.
  const glossaryLinked = linkGlossaryTerms(terms)(stripped)
  const rendered = render(glossaryLinked)
  const collapsed = processCollapsibleText(rendered)

  return (
    <Comp
      className={cn('mdc', props.className)}
      dangerouslySetInnerHTML={{ __html: collapsed }}
    />
  )
}

/**
 * Processes custom markdown syntax for collapsible text using HTML with Tailwind CSS
 * Format: [label: hidden content]
 * Uses the native <details> and <summary> elements with Tailwind classes
 */
export function processCollapsibleText(markdown: string): string {
  // Regular expression to match the pattern [label: content]
  // Using non-greedy matching with .*? to handle nested content properly
  const collapsiblePattern = /\[([^:]+):\s*(.*?)\]/g

  // Replace each match with the HTML details/summary structure with Tailwind classes
  return markdown.replace(collapsiblePattern, (match, label, content) => {
    return `
      <details class="inline">
        <summary class="inline-block text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded px-1 text-sm cursor-pointer select-none hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-600">${label}</summary>
        ${content}
      </details>`
  })
}
