import type { TrustedSetup, ZkCatalogTag } from '@l2beat/config'
import { expect } from 'earl'
import { getTrustedSetupsSectionFromTrustedSetups } from './getTrustedSetupsSection'

describe(getTrustedSetupsSectionFromTrustedSetups.name, () => {
  it('preserves phase metadata when combining proof systems for the same setup', () => {
    const setup: TrustedSetup = {
      id: 'setup',
      name: 'Setup',
      risk: 'yellow',
      shortDescription: 'Short description.',
      longDescription: 'Long description.',
      contributionCount: 30,
      phases: {
        phase1: { count: 30, unit: 'contributions' },
        phase2: { count: 1114, unit: 'contributions' },
      },
    }
    const first: ZkCatalogTag = {
      id: 'first',
      type: 'Groth16',
      name: 'First',
      description: '',
    }
    const second: ZkCatalogTag = { ...first, id: 'second', name: 'Second' }
    const result = getTrustedSetupsSectionFromTrustedSetups([
      { ...setup, proofSystem: first },
      { ...setup, proofSystem: second },
    ])

    expect(result.trustedSetups).toEqual([
      {
        name: setup.name,
        risk: setup.risk,
        description: setup.longDescription,
        participantCount: undefined,
        contributionCount: 30,
        phases: setup.phases,
        proofSystems: [first, second],
      },
    ])
  })
})
