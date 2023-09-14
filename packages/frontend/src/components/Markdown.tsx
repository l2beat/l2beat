import React from 'react'
import MarkdownIt from 'markdown-it'
import cx from 'classnames'
import { renderToStaticMarkup } from 'react-dom/server'
import { Link } from './Link'

export interface MarkdownProps {
  children: string
  inline?: boolean
  className?: string
}

const LINK_CLOSE = '</span></span></a>'
const markdown = MarkdownIt({ html: true })
markdown.renderer.rules.link_open = (tokens, index) => {
  const href = tokens[index].attrGet('href') ?? undefined
  return renderToStaticMarkup(<Link href={href} />).slice(0, -LINK_CLOSE.length)
}
markdown.renderer.rules.link_close = () => LINK_CLOSE

export function Markdown(props: MarkdownProps) {
  if (props.inline) {
    const rendered = markdown.renderInline(props.children)
    return (
      <span
        className={cx('mdc mdc-inline', props.className)}
        dangerouslySetInnerHTML={{ __html: rendered }}
      />
    )
  } else {
    const rendered = markdown.render(props.children)
    return (
      <div
        className={cx('mdc mdc-block', props.className)}
        dangerouslySetInnerHTML={{ __html: rendered }}
      />
    )
  }
}
