import type { Project } from '@l2beat/config'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import type { ProjectChanges } from '~/server/features/projects-change-report/getProjectsChangeReport'
import { getProjectVerification } from './getIsProjectVerified'

const becameVerified = ChainSpecificAddress(
  'eth:0x1111111111111111111111111111111111111111',
)
const stillUnverified = ChainSpecificAddress(
  'arb1:0x2222222222222222222222222222222222222222',
)

describe(getProjectVerification.name, () => {
  it('returns only unresolved unverified contracts', () => {
    const project = mockObject<Project<'statuses', 'contracts'>>({
      statuses: mockObject<Project<'statuses'>['statuses']>({
        unverifiedContracts: [becameVerified, stillUnverified],
      }),
      contracts: undefined,
    })
    const changes = mockObject<ProjectChanges>({
      becameVerifiedContracts: {
        ethereum: [ChainSpecificAddress.address(becameVerified)],
      },
    })

    const result = getProjectVerification(project, changes)

    expect(result.unverifiedContracts).toEqual([stillUnverified])
    expect(result.warnings.contracts).toEqual(
      'This project includes unverified contracts.',
    )
  })

  it('removes the warning when every contract became verified', () => {
    const project = mockObject<Project<'statuses', 'contracts'>>({
      statuses: mockObject<Project<'statuses'>['statuses']>({
        unverifiedContracts: [becameVerified],
      }),
      contracts: undefined,
    })
    const changes = mockObject<ProjectChanges>({
      becameVerifiedContracts: {
        ethereum: [ChainSpecificAddress.address(becameVerified)],
      },
    })

    const result = getProjectVerification(project, changes)

    expect(result.unverifiedContracts).toEqual([])
    expect(result.warnings.contracts).toEqual(undefined)
  })
})
