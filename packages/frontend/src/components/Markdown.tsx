import MarkdownIt from 'markdown-it'
import React from 'react'

import { cn } from '../utils/cn'
import {
  glossaryPlugin,
  linkGlossaryTerms,
} from '../utils/markdown/glossaryPlugin'
import { outLinksPlugin } from '../utils/markdown/outLinksPlugin'

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
  const Comp = props.inline ? 'span' : 'div'
  const render = props.inline ? markdown.renderInline : markdown.render

  // This is a hack to remove leading spaces, to prevent the appearance of
  // unwanted code blocks. Use backticks instead.
  const stripped = props.children.replace(/(^|\n)(?:\t|\s{4})(.+)/g, '$1$2')

  if (props.ignoreGlossary) {
    const rendered = render(stripped)

    return (
      <Comp
        className={cn('mdc', props.className)}
        dangerouslySetInnerHTML={{ __html: rendered }}
      />
    )
  }

  // Markdown-it does not support pre-render hooks and token rerendering so
  // we have to the do linking of glossary terms here explicitly.
  const glossaryLinked = linkGlossaryTerms(stripped)
  const rendered = render(glossaryLinked)

  return (
    <Comp
      className={cn('mdc', props.className)}
      dangerouslySetInnerHTML={{ __html: rendered }}
    />
  )
}
