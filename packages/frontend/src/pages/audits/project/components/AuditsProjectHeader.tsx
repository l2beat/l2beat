import type { AuditsProjectDetails } from '~/server/features/audits/types'
import { formatTimestamp } from '~/utils/dates'

export function AuditsProjectHeader({
  details,
}: {
  details: AuditsProjectDetails
}) {
  return (
    <div className="flex flex-col gap-2">
      <a
        href="/audits/summary"
        className="text-secondary text-xs hover:text-primary"
      >
        ← All audited projects
      </a>
      <div className="flex items-center gap-3">
        <img
          src={details.icon}
          alt={`${details.name} logo`}
          width={32}
          height={32}
          className="size-8 rounded-full"
        />
        <h1 className="font-bold text-2xl">{details.name}</h1>
        <span className="rounded bg-surface-secondary px-1.5 py-0.5 font-medium text-secondary text-xs">
          Audit coverage
        </span>
      </div>
      <p className="text-secondary text-xs">
        Deployed sources ({details.contractSelection} contracts) as of{' '}
        {formatTimestamp(details.discoveryTimestamp, { mode: 'date' })}.
        Comparison generated{' '}
        {formatTimestamp(details.generatedAt, { mode: 'date' })}
        {details.datasetRevision && (
          <>
            {' '}
            from dataset revision{' '}
            <span className="font-mono">
              {details.datasetRevision.slice(0, 8)}
            </span>
          </>
        )}
        .
      </p>
    </div>
  )
}
