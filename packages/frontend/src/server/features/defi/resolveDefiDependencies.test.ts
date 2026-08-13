import type { ProjectExternalDependency } from '@l2beat/config'
import { ProjectId } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { resolveDefiDependencies } from './resolveDefiDependencies'

describe(resolveDefiDependencies.name, () => {
  const projectsById = new Map([
    ['chainlink', { name: 'Chainlink', slug: 'chainlink', isDefi: true }],
    ['acrossv3', { name: 'Across v3', slug: 'acrossv3', isDefi: false }],
  ])

  it('links tracked dependencies that exist as DeFi projects', () => {
    const dependencies: ProjectExternalDependency[] = [
      {
        type: 'tracked',
        projectId: ProjectId('chainlink'),
        description: 'Price feeds',
      },
    ]

    expect(resolveDefiDependencies(dependencies, projectsById)).toEqual([
      {
        name: 'Chainlink',
        icon: '/icons/chainlink.png',
        description: 'Price feeds',
        href: '/defi/projects/chainlink',
        reviewed: true,
      },
    ])
  })

  it('does not link untracked dependencies', () => {
    const dependencies: ProjectExternalDependency[] = [
      {
        type: 'not-tracked',
        name: 'Rocket Pool rETH',
        icon: 'reth',
        description: 'rETH rate',
      },
    ]

    expect(resolveDefiDependencies(dependencies, projectsById)).toEqual([
      {
        name: 'Rocket Pool rETH',
        icon: '/icons/reth.png',
        description: 'rETH rate',
        reviewed: false,
      },
    ])
  })

  it('shows tracked non-DeFi projects without a DeFi link', () => {
    const dependencies: ProjectExternalDependency[] = [
      {
        type: 'tracked',
        projectId: ProjectId('acrossv3'),
        description: 'Bridge',
      },
    ]

    expect(resolveDefiDependencies(dependencies, projectsById)).toEqual([
      {
        name: 'Across v3',
        icon: '/icons/acrossv3.png',
        description: 'Bridge',
        reviewed: true,
      },
    ])
  })

  it('keeps tracked dependencies reviewed even if the project is missing', () => {
    const dependencies: ProjectExternalDependency[] = [
      {
        type: 'tracked',
        projectId: ProjectId('unknown-oracle'),
        description: 'Missing from config',
      },
    ]

    expect(resolveDefiDependencies(dependencies, projectsById)).toEqual([
      {
        name: 'unknown-oracle',
        icon: '/images/token-placeholder.png',
        description: 'Missing from config',
        reviewed: true,
      },
    ])
  })

  it('returns an empty list when there are no dependencies', () => {
    expect(resolveDefiDependencies([], projectsById)).toEqual([])
  })
})
