import { useQuery } from '@tanstack/react-query'
import type { AuditsUnitEntry } from '~/server/features/audits/types'
import { useTRPC } from '~/trpc/React'
import { UnitDiffView } from './UnitDiffView'
import { UnitSourceView } from './UnitSourceView'

/** Loads the unit source or diff on first expand. */
export function UnitDetails({
  slug,
  unit,
  view,
}: {
  slug: string
  unit: AuditsUnitEntry
  view: 'source' | 'diff'
}) {
  const trpc = useTRPC()
  const { data, isLoading, error } = useQuery(
    trpc.audits.unitDetails.queryOptions({
      slug,
      flat: unit.flat,
      unitId: unit.unitId,
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
  if (data.stale) {
    return (
      <div className="px-3 py-2 text-secondary text-xs">
        The deployed source of this contract changed since the audit coverage
        was generated, so its code is not shown. The coverage is regenerated
        with the next discovery update.
      </div>
    )
  }

  return (
    <div className="border-divider border-t bg-surface-secondary px-3 py-2">
      {view === 'diff' && data.diff && unit.match && data.audited ? (
        <>
          <div className="mb-2 text-secondary text-xs">
            Diff from audited{' '}
            <a
              href={data.audited.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono hover:underline"
            >
              {unit.match.path}@{unit.match.commit.slice(0, 8)}
            </a>{' '}
            ({unit.match.report.title}) to the deployed unit. Removed lines are
            audited code missing onchain, added lines are deployed code that was
            not audited. Audited line numbers refer to the dataset's formatted
            copy of the file.
          </div>
          <UnitDiffView diff={data.diff} />
        </>
      ) : (
        <UnitSourceView source={data.source} startLine={data.startLine} />
      )}
    </div>
  )
}
