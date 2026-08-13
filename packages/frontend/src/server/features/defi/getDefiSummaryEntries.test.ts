import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { env } from '~/env'
import {
  buildDefiSummaryEntries,
  type DefiProject,
  getDefiSummaryEntries,
} from './getDefiSummaryEntries'

describe(buildDefiSummaryEntries.name, () => {
  it('keeps missing TVL undefined instead of zero', () => {
    const projects = [
      defiProject({
        id: 'liquityv2',
        name: 'Liquity V2 (BOLD)',
        category: 'Stablecoin',
        tvsConfig: [],
      }),
      defiProject({
        id: 'chainlink',
        name: 'Chainlink',
        category: 'Oracle',
      }),
      defiProject({
        id: 'uniswapv3',
        name: 'Uniswap V3',
        category: 'DEX',
      }),
    ]
    const entries = buildDefiSummaryEntries(
      projects,
      new Map([['liquityv2', 1_000]]),
      defiDependencyProjectsById(projects),
    )

    expect(entries.map((entry) => entry.id)).toEqual([
      'liquityv2',
      'chainlink',
      'uniswapv3',
    ])
    expect(entries[0]?.totalValueLockedUsd).toEqual(1_000)
    expect(entries[1]?.totalValueLockedUsd).toEqual(undefined)
    expect(entries[2]?.totalValueLockedUsd).toEqual(undefined)
  })

  it('sorts by TVL descending and puts missing values last', () => {
    const projects = [
      defiProject({
        id: 'uniswapv3',
        name: 'Uniswap V3',
        category: 'DEX',
      }),
      defiProject({
        id: 'small',
        name: 'Small',
        category: 'DEX',
        tvsConfig: [],
      }),
      defiProject({
        id: 'chainlink',
        name: 'Chainlink',
        category: 'Oracle',
      }),
      defiProject({
        id: 'large',
        name: 'Large',
        category: 'Stablecoin',
        tvsConfig: [],
      }),
    ]
    const entries = buildDefiSummaryEntries(
      projects,
      new Map([
        ['small', 10],
        ['large', 50],
      ]),
      defiDependencyProjectsById(projects),
    )

    expect(entries.map((entry) => entry.id)).toEqual([
      'large',
      'small',
      'chainlink',
      'uniswapv3',
    ])
  })

  it('breaks equal TVLs by name', () => {
    const projects = [
      defiProject({
        id: 'beta',
        name: 'Beta',
        category: 'DEX',
        tvsConfig: [],
      }),
      defiProject({
        id: 'alpha',
        name: 'Alpha',
        category: 'DEX',
        tvsConfig: [],
      }),
    ]
    const entries = buildDefiSummaryEntries(
      projects,
      new Map([
        ['beta', 10],
        ['alpha', 10],
      ]),
      defiDependencyProjectsById(projects),
    )

    expect(entries.map((entry) => entry.id)).toEqual(['alpha', 'beta'])
  })

  it('resolves BOLD dependencies, Uniswap as none, and Chainlink as unknown', () => {
    const chainlink = defiProject({
      id: 'chainlink',
      name: 'Chainlink',
      category: 'Oracle',
    })
    const liquity = defiProject({
      id: 'liquityv2',
      name: 'Liquity V2 (BOLD)',
      category: 'Stablecoin',
      tvsConfig: [],
      externalDependencies: [
        {
          type: 'tracked',
          projectId: ProjectId('chainlink'),
          description: 'Price feeds',
        },
        {
          type: 'not-tracked',
          name: 'Rocket Pool rETH',
          icon: 'reth',
          description: 'rETH rate',
        },
        {
          type: 'not-tracked',
          name: 'Lido wstETH',
          icon: 'wsteth',
          description: 'wstETH rate',
        },
      ],
    })
    const uniswap = defiProject({
      id: 'uniswapv3',
      name: 'Uniswap V3',
      category: 'DEX',
      externalDependencies: [],
    })

    const entries = buildDefiSummaryEntries(
      [chainlink, liquity, uniswap],
      new Map(),
      defiDependencyProjectsById([chainlink, liquity, uniswap]),
    )
    const bold = entries.find((entry) => entry.id === 'liquityv2')
    const uni = entries.find((entry) => entry.id === 'uniswapv3')
    const link = entries.find((entry) => entry.id === 'chainlink')

    expect(bold?.dependencies).toEqual([
      {
        name: 'Chainlink',
        icon: '/icons/chainlink.png',
        description: 'Price feeds',
        href: '/defi/projects/chainlink',
        reviewed: true,
      },
      {
        name: 'Rocket Pool rETH',
        icon: '/icons/reth.png',
        description: 'rETH rate',
        reviewed: false,
      },
      {
        name: 'Lido wstETH',
        icon: '/icons/wsteth.png',
        description: 'wstETH rate',
        reviewed: false,
      },
    ])
    expect(uni?.dependencies).toEqual([])
    expect(link?.dependencies).toEqual(undefined)
  })
})

describe(getDefiSummaryEntries.name, () => {
  const originalMock = env.MOCK

  afterEach(() => {
    env.MOCK = originalMock
  })

  it('generates mock TVL only for projects with tvsConfig', async () => {
    env.MOCK = true

    const entries = await getDefiSummaryEntries([
      defiProject({
        id: 'liquityv2',
        name: 'Liquity V2 (BOLD)',
        category: 'Stablecoin',
        tvsConfig: [],
      }),
      defiProject({
        id: 'chainlink',
        name: 'Chainlink',
        category: 'Oracle',
      }),
      defiProject({
        id: 'uniswapv3',
        name: 'Uniswap V3',
        category: 'DEX',
      }),
    ])

    const byId = new Map(entries.map((entry) => [entry.id, entry]))
    expect(byId.get('liquityv2')?.totalValueLockedUsd).not.toEqual(undefined)
    expect(byId.get('chainlink')?.totalValueLockedUsd).toEqual(undefined)
    expect(byId.get('uniswapv3')?.totalValueLockedUsd).toEqual(undefined)
  })
})

function defiProject({
  id,
  name,
  category,
  tvsConfig,
  externalDependencies,
}: {
  id: string
  name: string
  category: DefiProject['defiInfo']['category']
  tvsConfig?: DefiProject['tvsConfig']
  externalDependencies?: DefiProject['externalDependencies']
}): DefiProject {
  return {
    id: ProjectId(id),
    slug: id,
    name,
    shortName: undefined,
    addedAt: UnixTime(0),
    display: {
      description: `${name} description`,
      links: {},
      badges: [],
    },
    defiInfo: { category },
    statuses: {
      yellowWarning: undefined,
      redWarning: undefined,
      emergencyWarning: undefined,
      reviewStatus: undefined,
      unverifiedContracts: [],
    },
    tvsConfig,
    externalDependencies,
  }
}

function defiDependencyProjectsById(projects: DefiProject[]) {
  return new Map(
    projects.map((project) => [
      project.id,
      { name: project.name, slug: project.slug, isDefi: true },
    ]),
  )
}
