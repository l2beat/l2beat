import { cn } from '~/utils/cn'

interface Props {
  body: string
  className?: string
}

const FENCE_RE = /```diff\n([\s\S]*?)\n```/g

interface DiffLine {
  number: number
  marker: ' ' | '+' | '-' | 'meta' | 'hunk'
  text: string
}

/**
 * Parses a `body` string containing one or more fenced ```diff blocks plus
 * optional surrounding markdown text. Renders each fenced block as a
 * line-numbered table with red/green row coloring (matching the Figma).
 * Anything outside fenced ```diff blocks is rendered as plain text.
 */
export function DiffBlock({ body, className }: Props) {
  const segments = splitFencedDiffs(body)
  if (segments.length === 0) return null
  return (
    <div className={cn('flex flex-col gap-3 text-xs', className)}>
      {segments.map((segment, i) =>
        segment.kind === 'diff' ? (
          <DiffFence key={i} lines={segment.lines} />
        ) : (
          <pre
            key={i}
            className="whitespace-pre-wrap break-words font-mono text-secondary"
          >
            {segment.text}
          </pre>
        ),
      )}
    </div>
  )
}

function DiffFence({ lines }: { lines: DiffLine[] }) {
  return (
    <div className="overflow-x-auto rounded-md border border-divider bg-surface-primary font-mono">
      <table className="w-full border-collapse">
        <tbody>
          {lines.map((line, i) => (
            <tr
              key={i}
              className={cn(
                'align-top',
                line.marker === '+' && 'bg-positive/10',
                line.marker === '-' && 'bg-negative/10',
              )}
            >
              <td
                className={cn(
                  'select-none pr-2 pl-2 text-right text-secondary',
                  'w-10 min-w-10 tabular-nums',
                )}
              >
                {line.number}
              </td>
              <td
                className={cn(
                  'w-5 min-w-5 select-none pr-2 text-center',
                  line.marker === '+' && 'text-positive',
                  line.marker === '-' && 'text-negative',
                  line.marker === 'meta' && 'text-secondary',
                  line.marker === 'hunk' && 'text-brand',
                )}
              >
                {line.marker === '+' || line.marker === '-' ? line.marker : ''}
              </td>
              <td
                className={cn(
                  'whitespace-pre pr-3',
                  line.marker === '+' && 'text-positive',
                  line.marker === '-' && 'text-negative',
                  line.marker === 'meta' && 'text-secondary',
                  line.marker === 'hunk' && 'text-brand',
                )}
              >
                {line.text || ' '}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

type Segment =
  | { kind: 'text'; text: string }
  | { kind: 'diff'; lines: DiffLine[] }

function splitFencedDiffs(body: string): Segment[] {
  const segments: Segment[] = []
  let lastIndex = 0
  FENCE_RE.lastIndex = 0
  for (const match of body.matchAll(FENCE_RE)) {
    const start = match.index ?? 0
    if (start > lastIndex) {
      const text = body.slice(lastIndex, start).trim()
      if (text.length > 0) segments.push({ kind: 'text', text })
    }
    const inner = match[1] ?? ''
    segments.push({ kind: 'diff', lines: parseDiffLines(inner) })
    lastIndex = start + match[0].length
  }
  if (lastIndex < body.length) {
    const text = body.slice(lastIndex).trim()
    if (text.length > 0) segments.push({ kind: 'text', text })
  }
  return segments
}

function parseDiffLines(inner: string): DiffLine[] {
  const rawLines = inner.split('\n')
  return rawLines.map((raw, i) => {
    const number = i + 1
    if (raw.startsWith('+++') || raw.startsWith('---')) {
      return { number, marker: 'meta', text: raw }
    }
    if (raw.startsWith('@@')) {
      return { number, marker: 'hunk', text: raw }
    }
    if (raw.startsWith('+')) {
      return { number, marker: '+', text: raw.slice(1) }
    }
    if (raw.startsWith('-')) {
      return { number, marker: '-', text: raw.slice(1) }
    }
    return { number, marker: ' ', text: raw }
  })
}
