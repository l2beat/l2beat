import { ProjectId } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { getProjects } from '../../processing/getProjects'
import type { BaseProject } from '../../types'
import { findMissingDaTracking, missingMessage } from './missing'

describe(findMissingDaTracking.name, () => {
  it('every project posting to a tracked DA layer declares daTracking', () => {
    const missing = findMissingDaTracking(getProjects())
    if (missing.length > 0) {
      throw new Error(missingMessage(missing))
    }
  })

  const project = (overrides: Partial<BaseProject>): BaseProject => ({
    id: ProjectId('test'),
    slug: 'test',
    name: 'Test',
    shortName: undefined,
    addedAt: 0,
    scalingInfo: {} as BaseProject['scalingInfo'],
    scalingDa: [
      {
        layer: { value: 'Ethereum (blobs)', projectId: ProjectId('ethereum') },
        bridge: { value: 'Enshrined' },
        mode: { value: 'Transaction data (compressed)' },
      },
    ],
    ...overrides,
  })

  it('flags a live project on a tracked layer with no daTracking', () => {
    expect(findMissingDaTracking([project({})], [])).toEqual(['test'])
    expect(missingMessage(['test'])).toInclude('- test')
  })

  it('accepts tracked, archived, allowlisted and untracked-layer projects', () => {
    const tracked = project({
      daTrackingConfig: [
        {
          type: 'ethereum',
          daLayer: ProjectId('ethereum'),
          inbox: '0x1',
          sinceBlock: 100,
        },
      ],
    })
    const archived = project({ archivedAt: 1 })
    const dac = project({
      scalingDa: [
        {
          layer: { value: 'DAC' },
          bridge: { value: 'DAC Members' },
          mode: { value: 'Transaction data (compressed)' },
        },
      ],
    })
    expect(findMissingDaTracking([tracked, archived, dac], [])).toEqual([])
    expect(findMissingDaTracking([project({})], ['test'])).toEqual([])
  })
})
