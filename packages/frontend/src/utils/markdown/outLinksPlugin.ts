import MarkdownIt from 'markdown-it'

import { isOutLink } from '../isOutLink'

export function outLinksPlugin(md: MarkdownIt) {
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
