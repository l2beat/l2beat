import type { TrustedSetup } from '@l2beat/config'
import { expect } from 'earl'
import {
  getSingleParticipantRole,
  getSingleParticipantSectionWarning,
  getSingleParticipantWarnings,
} from './getSingleParticipantTrustedSetupWarnings'

describe(getSingleParticipantRole.name, () => {
  it('names the phase with one contribution', () => {
    expect(
      getSingleParticipantRole({
        phases: {
          phase1: { count: 61, unit: 'contributions' },
          phase2: { count: 1, unit: 'contributions' },
        },
      }),
    ).toEqual('phase 2 contributor')
  })

  it('names phase 1 with one participant', () => {
    expect(
      getSingleParticipantRole({
        phases: {
          phase1: { count: 1, unit: 'participants' },
          phase2: { count: 20, unit: 'participants' },
        },
      }),
    ).toEqual('phase 1 contributor')
  })

  it('covers both phases with one contribution each', () => {
    expect(
      getSingleParticipantRole({
        phases: {
          phase1: { count: 1, unit: 'participants' },
          phase2: { count: 1, unit: 'contributions' },
        },
      }),
    ).toEqual('contributor in each phase')
  })

  it('ignores phase totals when phases are given', () => {
    expect(
      getSingleParticipantRole({
        participantCount: 1,
        phases: { phase1: { count: 54, unit: 'contributions' } },
      }),
    ).toEqual(undefined)
  })

  it('ignores unknown and ranged counts', () => {
    expect(
      getSingleParticipantRole({
        phases: {
          phase1: { unit: 'contributions' },
          phase2: { count: { min: 1, max: 16 }, unit: 'contributions' },
        },
      }),
    ).toEqual(undefined)
  })

  it('falls back to the totals without phases', () => {
    expect(getSingleParticipantRole({ participantCount: 1 })).toEqual(
      'participant',
    )
    expect(getSingleParticipantRole({ contributionCount: 1 })).toEqual(
      'participant',
    )
    expect(
      getSingleParticipantRole({ participantCount: 2, contributionCount: 1 }),
    ).toEqual(undefined)
    expect(getSingleParticipantRole({})).toEqual(undefined)
  })
})

describe(getSingleParticipantSectionWarning.name, () => {
  it('describes the single contributor', () => {
    expect(
      getSingleParticipantSectionWarning({
        phases: { phase2: { count: 1, unit: 'contributions' } },
      }),
    ).toEqual(
      'Arbitrary proofs can be forged if the single phase 2 contributor retained secrets from the trusted setup ceremony.',
    )
  })

  it('returns nothing for a multi-party setup', () => {
    expect(
      getSingleParticipantSectionWarning({ participantCount: 176 }),
    ).toEqual(undefined)
  })
})

describe(getSingleParticipantWarnings.name, () => {
  const single: Pick<TrustedSetup, 'id' | 'name' | 'participantCount'> = {
    id: 'single',
    name: 'Single',
    participantCount: 1,
  }

  it('names each single-participant setup once', () => {
    expect(
      getSingleParticipantWarnings([
        single,
        single,
        { id: 'many', name: 'Many', participantCount: 100 },
      ]),
    ).toEqual([
      'Arbitrary proofs can be forged if one entity retained secrets from a trusted setup ceremony: Single had a single participant.',
    ])
  })
})
