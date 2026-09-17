import { useMemo } from 'react'
import type { AuditsUnitDetails } from '~/server/features/audits/types'
import { cn } from '~/utils/cn'

type Diff = NonNullable<AuditsUnitDetails['diff']>
type Hunk = Diff['hunks'][number]

/**
 * Unified diff rendered from precomputed hunks; no diffing happens here.
 * With `hideIgnoredChanges` the ignored changed lines are dropped, together
 * with hunks that keep no significant change. Line numbers are preserved.
 */
export function UnitDiffView({
  diff,
  hideIgnoredChanges,
}: {
  diff: Diff
  hideIgnoredChanges: boolean
}) {
  const hunks = useMemo(
    () => (hideIgnoredChanges ? withoutIgnored(diff.hunks) : diff.hunks),
    [diff.hunks, hideIgnoredChanges],
  )
  if (diff.hunks.length === 0) {
    return (
      <p className="text-secondary text-xs">
        No textual difference after normalization.
      </p>
    )
  }
  if (hunks.length === 0) {
    return (
      <p className="text-secondary text-xs">
        Only ignored changes (comments, require messages). Turn off "Hide
        ignored changes" to see them.
      </p>
    )
  }
  return (
    <div className="max-h-[600px] overflow-auto rounded-md border border-divider bg-surface-primary font-mono text-xs">
      <table className="w-full border-collapse">
        <tbody>
          {hunks.map((hunk, h) => (
            <HunkRows key={h} hunk={hunk} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

function withoutIgnored(hunks: Hunk[]): Hunk[] {
  return hunks.flatMap((hunk) => {
    const lines = hunk.lines.filter((l) => l.type === ' ' || !l.ignored)
    const significant = lines.some((l) => l.type !== ' ')
    return significant ? [{ ...hunk, lines }] : []
  })
}

function HunkRows({ hunk }: { hunk: Hunk }) {
  return (
    <>
      <tr className="bg-brand/10 text-brand">
        <td colSpan={3} className="px-3 py-0.5">
          @@ audited line {hunk.oldStart} · deployed line {hunk.newStart} @@
        </td>
      </tr>
      {hunk.lines.map((line, i) => (
        <tr
          key={i}
          className={cn(
            'align-top',
            line.type === '+' && 'bg-positive/10 text-positive',
            line.type === '-' && 'bg-negative/10 text-negative',
          )}
        >
          <td className="w-10 min-w-10 select-none pr-2 text-right text-secondary">
            {line.oldLine ?? ''}
          </td>
          <td className="w-10 min-w-10 select-none pr-2 text-right text-secondary">
            {line.newLine ?? ''}
          </td>
          <td className="whitespace-pre pr-3">
            <span className="inline-block w-4 select-none">
              {line.type === ' ' ? '' : line.type}
            </span>
            {line.text || ' '}
          </td>
        </tr>
      ))}
    </>
  )
}
