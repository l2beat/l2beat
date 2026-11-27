import katex from 'katex'
import type MarkdownIt from 'markdown-it'

function renderKatex(tex: string, displayMode: boolean): string {
  return katex.renderToString(tex, {
    displayMode,
    throwOnError: false,
    strict: false,
  })
}

export function mathPlugin(md: MarkdownIt) {
  md.block.ruler.after(
    'blockquote',
    'math_block',
    (state, startLine, endLine, silent) => {
      const bMark = state.bMarks[startLine]
      const tShift = state.tShift[startLine]
      const startMax = state.eMarks[startLine]
      if (
        bMark === undefined ||
        tShift === undefined ||
        startMax === undefined
      ) {
        return false
      }

      const startPos = bMark + tShift
      if (startPos + 2 > startMax) {
        return false
      }
      if (state.src.slice(startPos, startPos + 2) !== '$$') {
        return false
      }

      const firstLineRest = state.src.slice(startPos + 2, startMax).trim()

      // Single-line display math: $$ ... $$
      if (firstLineRest.length > 0 && firstLineRest.endsWith('$$')) {
        const content = firstLineRest.slice(0, -2).trim()
        if (content.length === 0) {
          return false
        }
        if (silent) {
          return true
        }
        const token = state.push('math_block', 'math', 0)
        token.block = true
        token.content = content
        token.map = [startLine, startLine + 1]
        state.line = startLine + 1
        return true
      }

      // Multi-line display math: $$ ... \n ... $$
      let nextLine = startLine
      let foundClosing = false
      let lastLineContent = ''

      while (++nextLine < endLine) {
        const lineBMark = state.bMarks[nextLine]
        const lineTShift = state.tShift[nextLine]
        const max = state.eMarks[nextLine]
        if (
          lineBMark === undefined ||
          lineTShift === undefined ||
          max === undefined
        ) {
          break
        }

        const pos = lineBMark + lineTShift
        if (pos < max && lineTShift < state.blkIndent) {
          break
        }

        const lineText = state.src.slice(pos, max).trim()
        if (lineText.endsWith('$$')) {
          lastLineContent = lineText.slice(0, -2)
          foundClosing = true
          break
        }
      }

      if (!foundClosing) {
        return false
      }

      if (silent) {
        return true
      }

      const lines: string[] = []
      if (firstLineRest.length > 0) {
        lines.push(firstLineRest)
      }
      for (let line = startLine + 1; line < nextLine; line++) {
        const lineBMark = state.bMarks[line]
        const lineTShift = state.tShift[line]
        const max = state.eMarks[line]
        if (
          lineBMark === undefined ||
          lineTShift === undefined ||
          max === undefined
        ) {
          continue
        }
        lines.push(state.src.slice(lineBMark + lineTShift, max))
      }
      if (lastLineContent.trim().length > 0) {
        lines.push(lastLineContent.trimEnd())
      }

      const token = state.push('math_block', 'math', 0)
      token.block = true
      token.content = lines.join('\n').trim()
      token.map = [startLine, nextLine + 1]
      state.line = nextLine + 1
      return true
    },
    { alt: ['paragraph', 'reference', 'blockquote', 'list'] },
  )

  md.inline.ruler.after('escape', 'math_inline', (state, silent) => {
    const start = state.pos
    const max = state.posMax

    if (state.src.charCodeAt(start) !== 0x24 /* $ */) {
      return false
    }

    // Do not open inline math on $$ or on whitespace after $
    if (start + 1 >= max) {
      return false
    }
    const nextChar = state.src.charCodeAt(start + 1)
    if (nextChar === 0x24 || nextChar === 0x20 || nextChar === 0x09) {
      return false
    }

    // Find matching unescaped closing $
    let pos = start + 1
    while (pos < max) {
      const ch = state.src.charCodeAt(pos)
      if (ch === 0x5c /* \ */) {
        pos += 2
        continue
      }
      if (ch === 0x0a /* \n */) {
        return false
      }
      if (ch === 0x24 /* $ */) {
        // Closing $ cannot be preceded by whitespace
        const prevChar = state.src.charCodeAt(pos - 1)
        if (prevChar === 0x20 || prevChar === 0x09) {
          pos++
          continue
        }
        // Closing $ cannot be followed immediately by a digit (avoids "$5 and $10")
        if (pos + 1 < max) {
          const afterChar = state.src.charCodeAt(pos + 1)
          if (afterChar >= 0x30 && afterChar <= 0x39) {
            return false
          }
        }

        const content = state.src.slice(start + 1, pos)
        if (content.length === 0) {
          return false
        }

        if (!silent) {
          const token = state.push('math_inline', 'math', 0)
          token.content = content
        }
        state.pos = pos + 1
        return true
      }
      pos++
    }

    return false
  })

  md.core.ruler.after('smartquotes', 'math_inline_punctuation', (state) => {
    const trailingPunctuation = /^((?:[’'‘]s(?![A-Za-z0-9_]))?[.,:;?!)\]”’]*)/

    for (const blockToken of state.tokens) {
      if (blockToken.type !== 'inline' || !blockToken.children) {
        continue
      }
      const children = blockToken.children
      for (let i = 0; i < children.length - 1; i++) {
        const token = children[i]
        if (token?.type !== 'math_inline') {
          continue
        }

        const next = children[i + 1]
        if (next?.type === 'text') {
          const match = trailingPunctuation.exec(next.content)
          const rawSuffix = match?.[1]
          if (!rawSuffix) {
            continue
          }
          // smartquotes turns 's after a non-text token into an opening ‘s; fix to ’s.
          const suffix = rawSuffix.replace(/^[‘']s/, '’s')
          token.meta = { ...(token.meta ?? {}), suffix }
          next.content = next.content.slice(rawSuffix.length)
          continue
        }

        // Also handle bold/italic ending with inline math followed by punctuation,
        // e.g. `**never recovers $v_0$**.`
        const afterClose = children[i + 2]
        if (
          (next?.type === 'strong_close' || next?.type === 'em_close') &&
          afterClose?.type === 'text'
        ) {
          const match = trailingPunctuation.exec(afterClose.content)
          const rawSuffix = match?.[1]
          if (!rawSuffix) {
            continue
          }
          const suffix = rawSuffix.replace(/^[‘']s/, '’s')
          const tag = next.type === 'strong_close' ? 'strong' : 'em'
          const prefixHtml = new state.Token('html_inline', '', 0)
          prefixHtml.content = `</${tag}><span class="math-nowrap"><${tag}>`
          const suffixHtml = new state.Token('html_inline', '', 0)
          suffixHtml.content = `${md.utils.escapeHtml(suffix)}</span>`
          afterClose.content = afterClose.content.slice(rawSuffix.length)
          // Splice prefixHtml before math_inline, and suffixHtml after strong/em close.
          children.splice(i, 0, prefixHtml)
          children.splice(i + 3, 0, suffixHtml)
          i += 3
        }
      }
    }
  })

  md.renderer.rules.math_inline = (tokens, idx, _options, _env, _self) => {
    const token = tokens[idx]
    if (!token) {
      return ''
    }
    const html = renderKatex(token.content, false)
    const suffix =
      typeof token.meta?.suffix === 'string' ? token.meta.suffix : ''
    if (suffix.length > 0) {
      return `<span class="math-nowrap">${html}${md.utils.escapeHtml(suffix)}</span>`
    }
    return html
  }

  md.renderer.rules.math_block = (tokens, idx) => {
    const token = tokens[idx]
    return token
      ? `<div class="math-block">${renderKatex(token.content, true)}</div>\n`
      : ''
  }
}
