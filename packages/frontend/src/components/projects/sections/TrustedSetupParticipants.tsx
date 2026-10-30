import type { TrustedSetup } from '@l2beat/config'
import { cn } from '~/utils/cn'
import { getTrustedSetupParticipantSummaries } from '~/utils/project/getTrustedSetupParticipantSummaries'

export function TrustedSetupParticipants(
  setup: Pick<TrustedSetup, 'participantCount' | 'phases'>,
) {
  const summaries = getTrustedSetupParticipantSummaries(setup)
  if (summaries.length === 0) return null

  return (
    <dl className={cn('grid gap-4', summaries.length > 1 && 'sm:grid-cols-2')}>
      {summaries.map((summary) => (
        <div
          key={summary.label}
          className="rounded-lg bg-surface-secondary p-4 dark:bg-header-secondary"
        >
          <dt className="font-semibold text-secondary text-subtitle-12 uppercase">
            {summary.label}
          </dt>
          <dd className="mt-1 flex flex-wrap items-baseline gap-x-2">
            <span className="font-bold text-heading-24 tabular-nums">
              {summary.value}
            </span>
            {summary.unit && (
              <span className="text-paragraph-15">{summary.unit}</span>
            )}
          </dd>
          {summary.description && (
            <dd className="mt-1 text-paragraph-13 text-secondary">
              {summary.description}
            </dd>
          )}
        </div>
      ))}
    </dl>
  )
}
