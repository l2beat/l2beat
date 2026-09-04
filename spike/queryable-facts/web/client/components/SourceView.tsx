import {
  memo,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { type Lang, plainTokens, type Token, tokenize } from '../lib/highlight'
import type { Range } from '../lib/run'

export type HighlightKind = 'primary' | 'secondary' | 'hover'
export interface Highlight extends Range {
  kind: HighlightKind
}

interface LineInfo {
  n: number
  start: number
  end: number
  tokens: Token[]
}

interface Props {
  text: string
  lang: Lang
  highlights?: Highlight[]
  /** line → number shown in the gutter badge */
  badges?: Map<number, number>
  activeLine?: number
  scrollTo?: { line: number; nonce: number }
  onLineEnter?: (line: number) => void
  onLineLeave?: () => void
  onLineClick?: (line: number) => void
  onBadgeClick?: (line: number) => void
  onOffsetClick?: (offset: number) => void
  className?: string
  style?: React.CSSProperties
}

export function SourceView({
  text,
  lang,
  highlights,
  badges,
  activeLine,
  scrollTo,
  onLineEnter,
  onLineLeave,
  onLineClick,
  onBadgeClick,
  onOffsetClick,
  className,
  style,
}: Props) {
  const [tokens, setTokens] = useState<Token[][]>(() => plainTokens(text))
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    setTokens(plainTokens(text))
    tokenize(text, lang).then((t) => {
      if (!cancelled) setTokens(t)
    })
    return () => {
      cancelled = true
    }
  }, [text, lang])

  const lines = useMemo<LineInfo[]>(() => {
    const out: LineInfo[] = []
    let offset = 0
    const raw = text.split('\n')
    raw.forEach((line, i) => {
      out.push({
        n: i + 1,
        start: offset,
        end: offset + line.length,
        tokens: tokens[i] ?? [],
      })
      offset += line.length + 1
    })
    return out
  }, [text, tokens])

  // Which lines have highlights: everything else renders the cheap path.
  const perLine = useMemo(() => {
    const map = new Map<number, Highlight[]>()
    if (!highlights || highlights.length === 0) return map
    for (const line of lines) {
      const hs = highlights.filter(
        (h) => h.start < line.end + 1 && h.end > line.start,
      )
      if (hs.length > 0) map.set(line.n, hs)
    }
    return map
  }, [highlights, lines])

  useEffect(() => {
    if (!scrollTo || !ref.current) return
    const el = ref.current.querySelector(`[data-line="${scrollTo.line}"]`)
    el?.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }, [scrollTo])

  const lineFromEvent = (e: React.MouseEvent): number | undefined => {
    const el = (e.target as HTMLElement).closest('[data-line]')
    const n = el?.getAttribute('data-line')
    return n ? Number(n) : undefined
  }

  return (
    <div
      ref={ref}
      className={`src ${onOffsetClick ? 'clickable' : ''} ${className ?? ''}`}
      style={style}
      onMouseOver={(e) => {
        const n = lineFromEvent(e)
        if (n !== undefined) onLineEnter?.(n)
      }}
      onMouseLeave={() => onLineLeave?.()}
      onClick={(e) => {
        const target = e.target as HTMLElement
        if (target.closest('.badge')) {
          const n = lineFromEvent(e)
          if (n !== undefined) onBadgeClick?.(n)
          return
        }
        const off = target.getAttribute('data-off')
        if (off !== null && onOffsetClick) {
          onOffsetClick(Number(off))
          return
        }
        const n = lineFromEvent(e)
        if (n !== undefined) onLineClick?.(n)
      }}
    >
      {lines.map((line) => (
        <Line
          key={line.n}
          line={line}
          highlights={perLine.get(line.n)}
          badge={badges?.get(line.n)}
          active={activeLine === line.n}
          hasBadges={badges !== undefined}
        />
      ))}
    </div>
  )
}

const Line = memo(function Line({
  line,
  highlights,
  badge,
  active,
  hasBadges,
}: {
  line: LineInfo
  highlights?: Highlight[]
  badge?: number
  active: boolean
  hasBadges: boolean
}) {
  return (
    <div className={`ln ${active ? 'active' : ''}`} data-line={line.n}>
      <span className="gutter">{line.n}</span>
      {hasBadges && (
        <span
          className="badge"
          title={badge ? `${badge} fact(s) start on this line` : undefined}
        >
          {badge ? <span className={active ? 'hot' : ''}>{badge}</span> : null}
        </span>
      )}
      <span className="code">{renderTokens(line, highlights)}</span>
    </div>
  )
})

function renderTokens(line: LineInfo, highlights?: Highlight[]): ReactNode[] {
  if (!highlights || highlights.length === 0) {
    return line.tokens.map((t) => (
      <span key={t.offset} style={{ color: t.color }} data-off={t.offset}>
        {t.text}
      </span>
    ))
  }
  const cuts = new Set<number>()
  for (const h of highlights) {
    if (h.start > line.start && h.start < line.end) cuts.add(h.start)
    if (h.end > line.start && h.end < line.end) cuts.add(h.end)
  }
  const out: ReactNode[] = []
  const tokens =
    line.tokens.length > 0 ? line.tokens : [{ text: ' ', offset: line.start }]
  for (const t of tokens) {
    const a = t.offset
    const b = t.offset + t.text.length
    const points = [...cuts].filter((c) => c > a && c < b).sort((x, y) => x - y)
    const bounds = [a, ...points, b]
    for (let i = 0; i < bounds.length - 1; i++) {
      const s = bounds[i] ?? a
      const e = bounds[i + 1] ?? b
      const cls = highlights
        .filter((h) => h.start <= s && h.end >= e && !(h.end === s && s !== a))
        .map((h) => `hl-${h.kind}`)
        .join(' ')
      out.push(
        <span
          key={s}
          className={cls || undefined}
          style={{ color: t.color }}
          data-off={s}
        >
          {t.text.slice(s - a, e - a)}
        </span>,
      )
    }
  }
  return out
}
