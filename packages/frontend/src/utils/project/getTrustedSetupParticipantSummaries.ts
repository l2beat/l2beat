import type { TrustedSetup, TrustedSetupPhase } from '@l2beat/config'
import { formatNumberWithCommas } from '@l2beat/shared-pure'

export interface TrustedSetupParticipantSummary {
  label: string
  /** Absent for legacy totals that no phase claims. */
  phase?: 1 | 2
  value: string
  unit?: string
  description?: string
}

export function getTrustedSetupParticipantSummaries(
  setup: Pick<
    TrustedSetup,
    'participantCount' | 'contributionCount' | 'phases'
  >,
): TrustedSetupParticipantSummary[] {
  if (setup.phases?.phase1 || setup.phases?.phase2) {
    return [
      ...(setup.phases.phase1
        ? [
            {
              ...summarizePhase('Phase 1', setup.phases.phase1),
              phase: 1 as const,
            },
          ]
        : []),
      ...(setup.phases.phase2
        ? [
            {
              ...summarizePhase('Phase 2', setup.phases.phase2),
              phase: 2 as const,
            },
          ]
        : []),
    ]
  }

  const count = setup.participantCount ?? setup.contributionCount
  const unit =
    setup.participantCount !== undefined ? 'participants' : 'contributions'
  return count !== undefined
    ? [
        summarizePhase(
          unit === 'participants' ? 'Participants' : 'Contributions',
          {
            count,
            unit,
          },
        ),
      ]
    : []
}

function summarizePhase(
  label: string,
  phase: TrustedSetupPhase,
): TrustedSetupParticipantSummary {
  const count = phase.count
  if (count === undefined) {
    return {
      label,
      value: 'Unknown',
      unit: `number of ${phase.unit}`,
      description: phase.description,
    }
  }

  return {
    label,
    value:
      typeof count === 'number'
        ? formatNumberWithCommas(count)
        : `${formatNumberWithCommas(count.min)}–${formatNumberWithCommas(count.max)}`,
    unit: count === 1 ? phase.unit.slice(0, -1) : phase.unit,
    description: phase.description,
  }
}
