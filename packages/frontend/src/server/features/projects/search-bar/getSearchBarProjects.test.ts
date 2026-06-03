import { ProjectId } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { env } from '~/env'
import { ps } from '~/server/projects'
import { getSearchBarProjects } from './getSearchBarProjects'

describe(getSearchBarProjects.name, () => {
  const originalGetProjects = ps.getProjects.bind(ps)
  const originalMock = env.MOCK

  beforeEach(() => {
    env.MOCK = true
  })

  afterEach(() => {
    ps.getProjects = originalGetProjects
    env.MOCK = originalMock
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

  it('allows searching interop tokens by symbol', async () => {
    ps.getProjects = async () => [] as never

    const result = await getSearchBarProjects('usdc')

    expect(result.map(({ searchScore, ...entry }) => entry)).toEqual([
      {
        category: 'tokens',
        name: 'USDC',
        href: '/interop/tokens/circle-usdc',
        type: 'token',
        id: 'usdc01',
        iconUrl:
          'https://assets.coingecko.com/coins/images/6319/large/usdc.png?1696506694',
        issuer: 'circle',
        searchMatchKind: 'direct',
      },
    ])
    expect(result[0]?.searchScore).toBeA(Number)
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
