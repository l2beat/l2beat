import { useQuery } from '@tanstack/react-query'
import type { AuditsUnitEntry } from '~/server/features/audits/types'
import { useTRPC } from '~/trpc/React'
import { UnitDiffView } from './UnitDiffView'
import { UnitSourceView } from './UnitSourceView'

/** Loads the unit source or diff on first expand. */
export function UnitDetails({
  unit,
  view,
  hideIgnoredChanges,
}: {
  unit: AuditsUnitEntry
  view: 'source' | 'diff'
  hideIgnoredChanges: boolean
}) {
  const trpc = useTRPC()
  const { data, isLoading, error } = useQuery(
    trpc.audits.unitDetails.queryOptions({
      unitHash: unit.unitHash,
      contextKey: unit.contextKey,
      startLine: unit.startLine,
    }),
  )

  if (isLoading) {
    return (
      <div className="px-3 py-2 text-secondary text-xs">Loading source…</div>
    )
  }
  if (error || !data) {
    return (
      <div className="px-3 py-2 text-negative text-xs">
        Could not load the unit source.
      </div>
    )
  }

  return (
    <div className="border-divider border-t bg-surface-secondary px-3 py-2">
      {view === 'diff' && data.diff && unit.match ? (
        <>
          <div className="mb-2 text-secondary text-xs">
            Diff from audited{' '}
            <a
              href={unit.match.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono hover:underline"
            >
              {unit.match.path}@{unit.match.commit.slice(0, 8)}
            </a>{' '}
            ({unit.match.reportTitle}) to the deployed unit. Removed lines are
            audited code missing onchain, added lines are deployed code that was
            not audited.{' '}
            {hideIgnoredChanges
              ? 'Ignored changes (comments, require messages) are hidden.'
              : 'Ignored changes (comments, require messages) are shown too, although they do not count.'}
          </div>
          <UnitDiffView
            diff={data.diff}
            hideIgnoredChanges={hideIgnoredChanges}
          />
        </>
      ) : (
        <UnitSourceView source={data.source} startLine={data.startLine} />
      )}
    </div>
  )
}
