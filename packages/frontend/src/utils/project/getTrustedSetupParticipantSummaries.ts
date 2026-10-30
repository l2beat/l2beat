import type { TrustedSetup, TrustedSetupPhase } from '@l2beat/config'
import { formatNumberWithCommas } from '@l2beat/shared-pure'

export interface TrustedSetupParticipantSummary {
  label: string
  value: string
  unit?: string
  description?: string
}

export function getTrustedSetupParticipantSummaries(
  setup: Pick<TrustedSetup, 'participantCount' | 'phases'>,
): TrustedSetupParticipantSummary[] {
  if (setup.phases?.phase1 || setup.phases?.phase2) {
    return [
      ...(setup.phases.phase1
        ? [summarizePhase('Phase 1', setup.phases.phase1)]
        : []),
      ...(setup.phases.phase2
        ? [summarizePhase('Phase 2', setup.phases.phase2)]
        : []),
    ]
  }

  return setup.participantCount !== undefined
    ? [
        summarizePhase('Participants', {
          count: setup.participantCount,
          unit: 'participants',
        }),
      ]
    : []
}

function summarizePhase(
  label: string,
  phase: TrustedSetupPhase,
): TrustedSetupParticipantSummary {
  const count = phase.count
  if (count === undefined) {
    return { label, value: 'Unknown', description: phase.description }
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
