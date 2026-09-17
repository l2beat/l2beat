import type { Project } from '@l2beat/config'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { describe, expect, it } from 'vitest'
import type { ProjectChanges } from '~/server/features/projects-change-report/getProjectsChangeReport'
import { getProjectVerification } from './getIsProjectVerified'

const becameVerified = ChainSpecificAddress(
  'eth:0x1111111111111111111111111111111111111111',
)
const stillUnverified = ChainSpecificAddress(
  'arb1:0x2222222222222222222222222222222222222222',
)

describe(getProjectVerification.name, () => {
  it('filters out contracts that became verified', () => {
    const project = {
      statuses: {
        unverifiedContracts: [becameVerified, stillUnverified],
      } as unknown as Project<'statuses'>['statuses'],
      contracts: undefined,
    } as unknown as Project<'statuses', 'contracts'>
    const changes = {
      becameVerifiedContracts: {
        ethereum: [ChainSpecificAddress.address(becameVerified)],
      },
    } as unknown as ProjectChanges

    const result = getProjectVerification(project, changes)

    expect(result.unverifiedContracts).toEqual([stillUnverified])
    expect(result.warnings.contracts).toBe(
      'This project includes unverified contracts.',
    )
  })

  it('removes the warning when every contract became verified', () => {
    const project = {
      statuses: {
        unverifiedContracts: [becameVerified],
      } as unknown as Project<'statuses'>['statuses'],
      contracts: undefined,
    } as unknown as Project<'statuses', 'contracts'>
    const changes = {
      becameVerifiedContracts: {
        ethereum: [ChainSpecificAddress.address(becameVerified)],
      },
    } as unknown as ProjectChanges

    const result = getProjectVerification(project, changes)

    expect(result.unverifiedContracts).toEqual([])
    expect(result.warnings.contracts).toBe(undefined)
  })
})
