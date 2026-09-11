import { createElement, Fragment, type ReactNode } from 'react'
import { DatalogView } from './DatalogView'
import { SolidityView } from './SolidityView'

export type CodeRenderer = (text: string) => ReactNode

/**
 * Enough Markdown for report.md and for a model's answer: headings, paragraphs, lists (nested),
 * tables, fenced code, block quotes, rules; inline code, bold, italic, links. Renders React
 * elements, never HTML, so nothing in the text can inject markup. `code` decides what an inline
 * code span becomes (step 7 turns atoms, ids and line numbers into links).
 */
export function Markdown({
  text,
  code,
}: {
  text: string
  code?: CodeRenderer
}) {
  return (
    <div className="md">
      {renderBlocks(parseBlocks(text.split(/\r?\n/)), code)}
    </div>
  )
}

type Block =
  | { kind: 'heading'; level: number; text: string }
  | { kind: 'para'; text: string }
  | { kind: 'code'; lang: string; text: string }
  | { kind: 'quote'; blocks: Block[] }
  | { kind: 'list'; ordered: boolean; items: ListItem[] }
  | { kind: 'table'; header: string[]; rows: string[][] }
  | { kind: 'hr' }

interface ListItem {
  text: string
  children?: Block[]
}

const LIST_RE = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/
const FENCE_RE = /^\s*(`{3,}|~{3,})\s*(\w*)/
const HEADING_RE = /^(#{1,6})\s+(.*?)\s*#*\s*$/
const HR_RE = /^\s*([-*_])(\s*\1){2,}\s*$/
const QUOTE_RE = /^\s*>/
const TABLE_SEP_RE = /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)*\|?\s*$/

const indentOf = (line: string) => /^\s*/.exec(line)?.[0].length ?? 0

function startsBlock(line: string): boolean {
  return (
    FENCE_RE.test(line) ||
    HEADING_RE.test(line) ||
    HR_RE.test(line) ||
    QUOTE_RE.test(line) ||
    LIST_RE.test(line)
  )
}

/** Splits a table row on unescaped pipes; `\|` stays a pipe. */
function splitRow(line: string): string[] {
  const cells: string[] = []
  let current = ''
  let i = 0
  const trimmed = line.trim()
  const body = trimmed.startsWith('|') ? trimmed.slice(1) : trimmed
  while (i < body.length) {
    const c = body[i] ?? ''
    if (c === '\\' && body[i + 1] === '|') {
      current += '|'
      i += 2
      continue
    }
    if (c === '|') {
      cells.push(current.trim())
      current = ''
    } else current += c
    i++
  }
  if (current.trim() !== '' || !body.endsWith('|')) cells.push(current.trim())
  return cells
}

function parseBlocks(lines: string[]): Block[] {
  const blocks: Block[] = []
  let i = 0
  while (i < lines.length) {
    const line = lines[i] ?? ''
    if (line.trim() === '') {
      i++
      continue
    }
    const fence = FENCE_RE.exec(line)
    if (fence) {
      const marker = fence[1] ?? '```'
      const body: string[] = []
      i++
      while (i < lines.length && !(lines[i] ?? '').trim().startsWith(marker)) {
        body.push(lines[i] ?? '')
        i++
      }
      i++
      blocks.push({ kind: 'code', lang: fence[2] ?? '', text: body.join('\n') })
      continue
    }
    const heading = HEADING_RE.exec(line)
    if (heading) {
      blocks.push({
        kind: 'heading',
        level: heading[1]?.length ?? 1,
        text: heading[2] ?? '',
      })
      i++
      continue
    }
    if (HR_RE.test(line)) {
      blocks.push({ kind: 'hr' })
      i++
      continue
    }
    if (line.includes('|') && TABLE_SEP_RE.test(lines[i + 1] ?? '')) {
      const header = splitRow(line)
      i += 2
      const rows: string[][] = []
      while (i < lines.length && (lines[i] ?? '').includes('|')) {
        rows.push(splitRow(lines[i] ?? ''))
        i++
      }
      blocks.push({ kind: 'table', header, rows })
      continue
    }
    if (QUOTE_RE.test(line)) {
      const inner: string[] = []
      while (i < lines.length && QUOTE_RE.test(lines[i] ?? '')) {
        inner.push((lines[i] ?? '').replace(/^\s*>\s?/, ''))
        i++
      }
      blocks.push({ kind: 'quote', blocks: parseBlocks(inner) })
      continue
    }
    const list = LIST_RE.exec(line)
    if (list) {
      const baseIndent = (list[1] ?? '').length
      const ordered = /\d/.test(list[2] ?? '')
      const items: ListItem[] = []
      while (i < lines.length) {
        const m = LIST_RE.exec(lines[i] ?? '')
        if (
          !m ||
          (m[1] ?? '').length !== baseIndent ||
          /\d/.test(m[2] ?? '') !== ordered
        )
          break
        const sub: string[] = []
        i++
        while (i < lines.length) {
          const next = lines[i] ?? ''
          if (next.trim() === '') {
            const after = lines[i + 1] ?? ''
            if (after.trim() !== '' && indentOf(after) > baseIndent) {
              sub.push('')
              i++
              continue
            }
            const sibling = LIST_RE.exec(after)
            if (
              sibling &&
              (sibling[1] ?? '').length === baseIndent &&
              /\d/.test(sibling[2] ?? '') === ordered
            )
              i++
            break
          }
          if (indentOf(next) > baseIndent) {
            sub.push(next.slice(Math.min(indentOf(next), baseIndent + 2)))
            i++
            continue
          }
          break
        }
        items.push({
          text: m[3] ?? '',
          children: sub.length > 0 ? parseBlocks(sub) : undefined,
        })
      }
      blocks.push({ kind: 'list', ordered, items })
      continue
    }
    const para: string[] = [line]
    i++
    while (i < lines.length) {
      const next = lines[i] ?? ''
      if (next.trim() === '' || startsBlock(next)) break
      if (next.includes('|') && TABLE_SEP_RE.test(lines[i + 1] ?? '')) break
      para.push(next)
      i++
    }
    blocks.push({ kind: 'para', text: para.join(' ') })
  }
  return blocks
}

function renderBlocks(blocks: Block[], code?: CodeRenderer): ReactNode[] {
  return blocks.map((b, i) => {
    switch (b.kind) {
      case 'heading':
        return createElement(
          `h${Math.min(6, b.level)}`,
          { key: i },
          inline(b.text, code),
        )
      case 'para':
        return <p key={i}>{inline(b.text, code)}</p>
      case 'code':
        if (/^(solidity|sol)$/i.test(b.lang))
          return <SolidityView key={i} text={b.text} gutter={false} />
        if (/^(datalog|dl|souffle|soufflé)$/i.test(b.lang))
          return (
            <div key={i} className="code-dl">
              <DatalogView text={b.text} gutter={false} />
            </div>
          )
        return (
          <pre key={i} data-lang={b.lang || undefined}>
            <code>{b.text}</code>
          </pre>
        )
      case 'quote':
        return <blockquote key={i}>{renderBlocks(b.blocks, code)}</blockquote>
      case 'hr':
        return <hr key={i} />
      case 'table':
        return (
          <table key={i}>
            <thead>
              <tr>
                {b.header.map((h, j) => (
                  <th key={j}>{inline(h, code)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((row, r) => (
                <tr key={r}>
                  {b.header.map((_, j) => (
                    <td key={j}>{inline(row[j] ?? '', code)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )
      case 'list': {
        const items = b.items.map((item, j) => (
          <li key={j}>
            {inline(item.text, code)}
            {item.children && renderBlocks(item.children, code)}
          </li>
        ))
        return b.ordered ? <ol key={i}>{items}</ol> : <ul key={i}>{items}</ul>
      }
      default:
        return null
    }
  })
}

// inline code | **bold** | *italic* | [text](url) | <url>
const INLINE_RE =
  /(`+)([\s\S]*?[^`])\1(?!`)|\*\*(.+?)\*\*|(?<![\w*])\*([^*\n]+?)\*(?![\w*])|\[([^\]]+)\]\(([^)\s]+)\)|<(https?:\/\/[^>\s]+)>/g

function inline(text: string, code?: CodeRenderer): ReactNode {
  const parts: ReactNode[] = []
  let last = 0
  let key = 0
  for (const m of text.matchAll(INLINE_RE)) {
    const start = m.index ?? 0
    if (start > last) parts.push(text.slice(last, start))
    last = start + m[0].length
    if (m[2] !== undefined) {
      const inner = m[2].trim()
      parts.push(
        <Fragment key={key++}>
          {code ? code(inner) : <code>{inner}</code>}
        </Fragment>,
      )
    } else if (m[3] !== undefined) {
      parts.push(<b key={key++}>{inline(m[3], code)}</b>)
    } else if (m[4] !== undefined) {
      parts.push(<em key={key++}>{inline(m[4], code)}</em>)
    } else if (m[5] !== undefined && m[6] !== undefined) {
      parts.push(
        <a key={key++} href={m[6]} target="_blank" rel="noreferrer">
          {inline(m[5], code)}
        </a>,
      )
    } else if (m[7] !== undefined) {
      parts.push(
        <a key={key++} href={m[7]} target="_blank" rel="noreferrer">
          {m[7]}
        </a>,
      )
    }
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts.length === 1 ? parts[0] : parts
}
