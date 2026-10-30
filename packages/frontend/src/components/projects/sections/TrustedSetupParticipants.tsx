import type { TrustedSetup } from '@l2beat/config'
import { getTrustedSetupParticipantSummaries } from '~/utils/project/getTrustedSetupParticipantSummaries'

const PHASE_KINDS = { 1: 'Universal', 2: 'Circuit-specific' } as const

export function TrustedSetupParticipants(
  setup: Pick<
    TrustedSetup,
    'participantCount' | 'contributionCount' | 'phases'
  >,
) {
  const summaries = getTrustedSetupParticipantSummaries(setup)
  if (summaries.length === 0) return null

  return (
    <ol>
      {summaries.map((summary, index) => (
        <li key={summary.label} className="relative flex gap-3 pb-4 last:pb-0">
          {index < summaries.length - 1 && (
            <span
              aria-hidden
              className="absolute top-7 bottom-1 left-3 w-px bg-divider"
            />
          )}
          {summary.phase && (
            <span
              aria-hidden
              className="flex size-6 shrink-0 items-center justify-center rounded-full bg-surface-tertiary font-bold text-label-12"
            >
              {summary.phase}
            </span>
          )}
          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline gap-x-3">
              <span className="font-semibold text-paragraph-15">
                {summary.label}
                {summary.phase && (
                  <span className="font-normal text-secondary">
                    {` · ${PHASE_KINDS[summary.phase]}`}
                  </span>
                )}
              </span>
              <span className="flex flex-wrap items-baseline gap-x-1.5">
                <span className="font-bold text-heading-20 tabular-nums">
                  {summary.value}
                </span>
                {summary.unit && (
                  <span className="text-paragraph-14">{summary.unit}</span>
                )}
              </span>
            </div>
            {summary.description && (
              <p className="mt-0.5 text-paragraph-13 text-secondary">
                {summary.description}
              </p>
            )}
          </div>
        </li>
      ))}
    </ol>
  )
}
