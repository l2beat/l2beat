import type { TrustedSetup } from '@l2beat/config'
import { getTrustedSetupParticipantSummaries } from '~/utils/project/getTrustedSetupParticipantSummaries'

export function TrustedSetupParticipants(
  setup: Pick<
    TrustedSetup,
    'participantCount' | 'contributionCount' | 'phases'
  >,
) {
  const summaries = getTrustedSetupParticipantSummaries(setup)
  if (summaries.length === 0) return null

  return (
    <dl className="grid min-w-0 gap-4 sm:grid-cols-2 sm:gap-x-8 lg:flex-1">
      {summaries.map((summary) => (
        <div key={summary.label} className="min-w-0">
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
