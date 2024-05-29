import type MarkdownIt from 'markdown-it'

export function outLinksPlugin(md: MarkdownIt) {
  const defaultRender =
    md.renderer.rules.link_open ??
    function (tokens, idx, options, _env, self) {
      return self.renderToken(tokens, idx, options)
    }

  md.renderer.rules.link_open = (tokens, index, options, env, self) => {
    const token = tokens[index]
    if (token?.attrGet('href')?.startsWith('http')) {
      token.attrSet('target', '_blank')
      token.attrSet('rel', 'noreferrer noopener')
    }
    return defaultRender(tokens, index, options, env, self)
  }
}
