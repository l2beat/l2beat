import MarkdownIt from 'markdown-it'
import React from 'react'

import { cn } from '../utils/cn'
import { outLinksPlugin } from '../utils/markdown/outLinksPlugin'

export interface MarkdownProps {
  children: string
  inline?: boolean
  className?: string
}

const markdown = MarkdownIt({
  html: true,
  typographer: true,
}).use(outLinksPlugin)

export function Markdown(props: MarkdownProps) {
  const Comp = props.inline ? 'span' : 'div'

  // This is a hack to remove leading spaces, to prevent the appearance of
  // unwanted code blocks. Use backticks instead.
  const children = props.children.replace(/(^|\n)(?:\t|\s{4})(.+)/g, '$1$2')

  const rendered = props.inline
    ? markdown.renderInline(children)
    : markdown.render(children)

  return (
    <Comp
      className={cn('mdc', props.className)}
      dangerouslySetInnerHTML={{ __html: rendered }}
    />
  )
}
