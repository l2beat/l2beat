import { ProjectId } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { ps } from '~/server/projects'
import { getSearchBarProjects } from './getSearchBarProjects'

describe(getSearchBarProjects.name, () => {
  const originalGetProjects = ps.getProjects.bind(ps)

  afterEach(() => {
    ps.getProjects = originalGetProjects
  })

  it('keeps only direct project matches when they exist', async () => {
    ps.getProjects = async () =>
      [
        scalingProject('ethereal', 'Ethereal', 'Other', 'layer3'),
        scalingProject('jetstreamchain', 'Jetstream'),
        daLayerProject('ethereum', 'Ethereum'),
        daBridgeProject('enshrined-bridge', 'Enshrined Bridge', 'ethereum'),
      ] as never

    const result = await getSearchBarProjects('ethere')

    expect(result.map((entry) => entry.name)).toEqual([
      'Ethereal',
      'Ethereum with Enshrined Bridge',
    ])
    expect(result.map((entry) => entry.searchMatchKind)).toEqual([
      'direct',
      'direct',
    ])
  })

  it('falls back to fuzzy project matches when there are no direct matches', async () => {
    ps.getProjects = async () =>
      [scalingProject('jetstreamchain', 'Jetstream')] as never

    const result = await getSearchBarProjects('jtsrm')

    expect(result.map((entry) => entry.name)).toEqual(['Jetstream'])
    expect(result[0]?.searchMatchKind).toEqual('fuzzy')
  })
})

function scalingProject(
  slug: string,
  name: string,
  scalingCategory: 'Other' | 'Optimistic Rollup' = 'Other',
  layer: 'layer2' | 'layer3' = 'layer2',
) {
  return {
    id: ProjectId(slug),
    slug,
    name,
    isScaling: true,
    scalingInfo: {
      layer,
      type: scalingCategory,
    },
  }
}

function daLayerProject(slug: string, name: string) {
  return {
    id: ProjectId(slug),
    slug,
    name,
    daLayer: {
      usedWithoutBridgeIn: [],
    },
  }
}

function daBridgeProject(slug: string, name: string, daLayerSlug: string) {
  return {
    id: ProjectId(slug),
    slug,
    name,
    daBridge: {
      name,
      daLayer: ProjectId(daLayerSlug),
    },
  }
}
