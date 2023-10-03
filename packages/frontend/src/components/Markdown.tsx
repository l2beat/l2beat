import cx from 'classnames'
import MarkdownIt from 'markdown-it'
import React from 'react'

import { isOutLink } from './Link'

export interface MarkdownProps {
  children: string
  inline?: boolean
  className?: string
}

const markdown = MarkdownIt({
  html: true,
  typographer: true,
}).use(outLinksPlugin)

function outLinksPlugin(md: MarkdownIt) {
  const defaultRender =
    md.renderer.rules.link_open ??
    function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options)
    }

  md.renderer.rules.link_open = (tokens, index, options, env, self) => {
    const token = tokens[index]
    if (isOutLink(token.attrGet('href'))) {
      token.attrSet('target', '_blank')
      token.attrSet('rel', 'noreferrer noopener')
    }
    return defaultRender(tokens, index, options, env, self)
  }
}

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
