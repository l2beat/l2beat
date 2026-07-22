import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import type { ProjectChanges } from '~/server/features/projects-change-report/getProjectsChangeReport'
import { getUnresolvedUnverifiedContracts } from './getIsProjectVerified'

describe(getUnresolvedUnverifiedContracts.name, () => {
  it('removes contracts that recently became verified', () => {
    const becameVerified = ChainSpecificAddress(
      'eth:0x1111111111111111111111111111111111111111',
    )
    const stillUnverified = ChainSpecificAddress(
      'arb1:0x2222222222222222222222222222222222222222',
    )
    const changes = mockObject<ProjectChanges>({
      becameVerifiedContracts: {
        ethereum: [ChainSpecificAddress.address(becameVerified)],
        arbitrum: [],
      },
    })

    const result = getUnresolvedUnverifiedContracts(
      [becameVerified, stillUnverified],
      changes,
    )

    expect(result).toEqual([stillUnverified])
  })

  it('keeps every contract when there is no change report', () => {
    const contract = ChainSpecificAddress(
      'eth:0x1111111111111111111111111111111111111111',
    )

    const result = getUnresolvedUnverifiedContracts([contract], undefined)

    expect(result).toEqual([contract])
  })
})
