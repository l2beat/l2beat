import { cn } from '~/utils/cn'
import { extractDiffBlockSpans } from '~/utils/diffHistory/diffHistoryMarkdown'

interface DiffLine {
  marker: ' ' | '+' | '-' | 'meta' | 'hunk'
  text: string
}

type DiffBodySegment =
  | { type: 'text'; content: string }
  | { type: 'diff'; lines: DiffLine[] }

export function DiffBody({ body }: { body: string }) {
  const segments = splitDiffBody(body)

  return (
    <div className="flex min-w-0 flex-col gap-3 text-xs">
      {segments.map((segment, index) =>
        segment.type === 'diff' ? (
          <DiffFence key={index} lines={segment.lines} />
        ) : (
          <pre
            key={index}
            className="whitespace-pre-wrap break-words font-mono text-secondary"
          >
            {segment.content}
          </pre>
        ),
      )}
    </div>
  )
}

function splitDiffBody(body: string): DiffBodySegment[] {
  const spans = extractDiffBlockSpans(body)
  if (spans.length === 0) {
    const text = body.trim()
    return text.length > 0 ? [{ type: 'text', content: text }] : []
  }

  const segments: DiffBodySegment[] = []
  let offset = 0

  for (const span of spans) {
    const text = body.slice(offset, span.start).trim()
    if (text.length > 0) {
      segments.push({ type: 'text', content: text })
    }

    segments.push({ type: 'diff', lines: parseDiffLines(span.content) })
    offset = span.end
  }

  const text = body.slice(offset).trim()
  if (text.length > 0) {
    segments.push({ type: 'text', content: text })
  }

  return segments
}

function DiffFence({ lines }: { lines: DiffLine[] }) {
  return (
    <div className="min-w-0 overflow-x-auto rounded-md border border-divider bg-surface-primary font-mono">
      <table className="w-full border-collapse">
        <tbody>
          {lines.map((line, index) => (
            <tr
              key={index}
              className={cn(
                'align-top',
                line.marker === '+' && 'bg-positive/10',
                line.marker === '-' && 'bg-negative/10',
              )}
            >
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

function parseDiffLines(diff: string): DiffLine[] {
  return diff.split('\n').map((raw) => {
    if (raw.startsWith('+++') || raw.startsWith('---')) {
      return { marker: 'meta', text: raw }
    }
    if (raw.startsWith('@@')) {
      return { marker: 'hunk', text: raw }
    }
    if (raw.startsWith('+')) {
      return { marker: '+', text: raw.slice(1) }
    }
    if (raw.startsWith('-')) {
      return { marker: '-', text: raw.slice(1) }
    }
    return { marker: ' ', text: raw }
  })
}
