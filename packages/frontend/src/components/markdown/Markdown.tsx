import MarkdownIt from 'markdown-it'
import { useId } from 'react'
import { cn } from '~/utils/cn'
import {
  glossaryPlugin,
  linkGlossaryTerms,
} from '~/utils/markdown/glossaryPlugin'
import { outLinksPlugin } from '~/utils/markdown/outlinksPlugin'
import { useGlossaryContext } from './GlossaryContext'

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

  // Markdown-it does not support pre-render hooks and token rerendering so
  // we have to the do linking of glossary terms here explicitly.
  const rendered = render(
    props.ignoreGlossary ? stripped : linkGlossaryTerms(terms)(stripped),
  )
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
  const collapsiblePattern = /\[([^:]+):\s*(.*?)\]/g

  return markdown.replace(collapsiblePattern, (_match, label, content) => {
    const uniqueId = useId()
    return `<button class="inline text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded px-1 text-sm cursor-pointer select-none hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-600" onclick="document.getElementById('${uniqueId}').classList.toggle('hidden')">${label}</button><span id="${uniqueId}" class="hidden ml-1">${content}</span>`
  })
}
