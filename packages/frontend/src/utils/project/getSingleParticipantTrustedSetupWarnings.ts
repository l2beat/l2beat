import type { TrustedSetup, TrustedSetupPhase } from '@l2beat/config'
import uniqBy from 'lodash/uniqBy'
import type { TechnologyRisk } from '~/components/projects/sections/RiskList'

type SetupCounts = Pick<
  TrustedSetup,
  'participantCount' | 'contributionCount' | 'phases'
>
type NamedSetup = SetupCounts & Pick<TrustedSetup, 'id' | 'name'>

/**
 * Who alone made a trusted setup, e.g. "phase 2 contributor", or undefined
 * when no phase rests on one participant. A phase counting one contribution
 * counts too: one contribution can only come from one participant.
 */
export function getSingleParticipantRole(
  setup: SetupCounts,
): string | undefined {
  const phase1 = setup.phases?.phase1
  const phase2 = setup.phases?.phase2
  if (phase1 || phase2) {
    const single1 = isSingleParticipantPhase(phase1)
    const single2 = isSingleParticipantPhase(phase2)
    if (single1 && single2) return 'contributor in each phase'
    if (single1) return 'phase 1 contributor'
    if (single2) return 'phase 2 contributor'
    return undefined
  }

  const count = setup.participantCount ?? setup.contributionCount
  return count === 1 ? 'participant' : undefined
}

function isSingleParticipantPhase(phase: TrustedSetupPhase | undefined) {
  return phase?.count === 1
}

/** Shown under the setup itself, so it does not repeat the setup's name. */
export function getSingleParticipantSectionRisks(
  setup: SetupCounts,
): TechnologyRisk[] {
  const role = getSingleParticipantRole(setup)
  if (!role) return []
  return [
    nonCriticalRisk(
      `Arbitrary proofs can be forged if the single ${role} retained secrets from the trusted setup ceremony.`,
    ),
  ]
}

/** Shown away from the setup (page header, table row), so it names it. */
export function getSingleParticipantWarnings(setups: NamedSetup[]): string[] {
  return uniqBy(setups, (setup) => setup.id).flatMap((setup) => {
    const role = getSingleParticipantRole(setup)
    if (!role) return []
    return [
      `Arbitrary proofs can be forged if one entity retained secrets from a trusted setup ceremony: ${setup.name} had a single ${role}.`,
    ]
  })
}

/** The same warnings as a risk box, for the card of a prover that uses the setups. */
export function getSingleParticipantRisks(
  setups: NamedSetup[],
): TechnologyRisk[] {
  return getSingleParticipantWarnings(setups).map(nonCriticalRisk)
}

function nonCriticalRisk(text: string): TechnologyRisk {
  return { text, isCritical: false }
}
