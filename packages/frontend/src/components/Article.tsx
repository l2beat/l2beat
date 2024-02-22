import MarkdownIt from 'markdown-it'
import React from 'react'

import { cn } from '../utils/cn'
import { outLinksPlugin } from '../utils/markdown/outLinksPlugin'

export interface ArticleProps {
  children: string
  className?: string
}

const markdown = MarkdownIt({
  html: true,
  typographer: true,
}).use(outLinksPlugin)

export function Article(props: ArticleProps) {
  return (
    <article
      className={cn('article', props.className)}
      dangerouslySetInnerHTML={{ __html: markdown.render(props.children) }}
    />
  )
}
