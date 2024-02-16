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
  const rendered = props.inline
    ? markdown.renderInline(props.children)
    : markdown.render(props.children)

  return (
    <Comp
      className={cn('mdc', props.className)}
      dangerouslySetInnerHTML={{ __html: rendered }}
    />
  )
}
