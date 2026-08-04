import type { ProjectScalingProofSystem } from '@l2beat/config'
import { expect } from 'earl'
import { getZkCatalogIds } from './getZkCatalogIds'

describe(getZkCatalogIds.name, () => {
  it('returns the single ZK Catalog id', () => {
    const proofSystem: ProjectScalingProofSystem = {
      type: 'Validity',
      zkCatalogId: 'risc0',
    }

    expect(getZkCatalogIds(proofSystem)).toEqual(['risc0'])
  })

  it('returns all ids used by a multi-proof system', () => {
    const proofSystem: ProjectScalingProofSystem = {
      type: 'Validity',
      name: 'SP1 / RISC0',
      zkCatalogIds: ['sp1hypercube', 'risc0'],
    }

    expect(getZkCatalogIds(proofSystem)).toEqual(['sp1hypercube', 'risc0'])
  })

  it('returns no ids for a named proof system without a catalog entry', () => {
    const proofSystem: ProjectScalingProofSystem = {
      type: 'Validity',
      name: 'Custom prover',
    }

    expect(getZkCatalogIds(proofSystem)).toEqual([])
  })
})
