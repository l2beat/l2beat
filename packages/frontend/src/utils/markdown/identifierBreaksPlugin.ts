import type MarkdownIt from 'markdown-it'

const LONG_IDENTIFIER = /(?<![A-Za-z0-9])[A-Za-z][A-Za-z0-9]{15,}/g
const CAMEL_HUMP = /(?<=[a-z0-9])(?=[A-Z])/g

/**
 * Contract names like `SecurityCouncilMemberElectionGovernor` are one word to
 * the browser, so on phones they break at whatever letter hits the edge.
 * A `<wbr>` at each camel-case hump lets them wrap between the words instead.
 */
export function identifierBreaksPlugin(md: MarkdownIt) {
  const renderText = md.renderer.rules.text
  md.renderer.rules.text = (tokens, idx, options, env, self) => {
    const html = renderText
      ? renderText(tokens, idx, options, env, self)
      : md.utils.escapeHtml(tokens[idx]?.content ?? '')
    return html.replace(LONG_IDENTIFIER, (word) =>
      word.replace(CAMEL_HUMP, '<wbr>'),
    )
  }
}
