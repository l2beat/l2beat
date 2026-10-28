import type { Project } from '@l2beat/config'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { getProjectCategory } from './getProjects'

describe(getProjectCategory.name, () => {
  it('splits scaling projects like the main site tabs', () => {
    expect(getProjectCategory('a', scaling('ZK Rollup'))).toEqual('rollups')
    expect(getProjectCategory('a', scaling('Optimistic Rollup'))).toEqual(
      'rollups',
    )
    expect(getProjectCategory('a', scaling('Validium'))).toEqual(
      'validiumsAndOptimiums',
    )
    expect(getProjectCategory('a', scaling('Plasma'))).toEqual(
      'validiumsAndOptimiums',
    )
    expect(getProjectCategory('a', scaling('Other'))).toEqual('others')
  })

  it('prefers scaling over interop', () => {
    const project = { ...scaling('ZK Rollup'), interopConfig: {} as never }
    expect(getProjectCategory('a', project)).toEqual('rollups')
  })

  it('prefers privacy over the ZK catalog', () => {
    const project = {
      ...base(),
      privacyInfo: {} as never,
      zkCatalogInfo: {} as never,
    }
    expect(getProjectCategory('a', project)).toEqual('privacy')
  })

  it('puts archived projects last, whatever they were', () => {
    const project = { ...scaling('ZK Rollup'), archivedAt: UnixTime(1) }
    expect(getProjectCategory('a', project)).toEqual('archived')
  })

  it('groups shared modules and projects without a page', () => {
    expect(getProjectCategory('shared-sp1', undefined)).toEqual('sharedModules')
    expect(getProjectCategory('hop', undefined)).toEqual('unlisted')
    expect(getProjectCategory('gateway', base())).toEqual('unlisted')
  })
})

function base(): Parameters<typeof getProjectCategory>[1] & {} {
  return {
    id: ProjectId('a'),
    slug: 'a',
    name: 'A',
    shortName: undefined,
    addedAt: UnixTime(0),
    scalingInfo: undefined,
    interopConfig: undefined,
    zkCatalogInfo: undefined,
    privacyInfo: undefined,
    defiInfo: undefined,
    archivedAt: undefined,
  }
}

function scaling(
  type: NonNullable<Project<'scalingInfo'>['scalingInfo']>['type'],
) {
  return { ...base(), scalingInfo: { type } as never }
}
