import type { ProjectExternalDependency } from '@l2beat/config'
import { ProjectId } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { resolveDefiDependencies } from './resolveDefiDependencies'

describe(resolveDefiDependencies.name, () => {
  const chainlink = {
    name: 'Chainlink',
    slug: 'chainlink',
  }
  const defiProjectsById = new Map([['chainlink', chainlink]])

  it('links tracked dependencies that exist as DeFi projects', () => {
    const dependencies: ProjectExternalDependency[] = [
      {
        type: 'tracked',
        projectId: ProjectId('chainlink'),
        description: 'Price feeds',
      },
    ]

    expect(resolveDefiDependencies(dependencies, defiProjectsById)).toEqual([
      {
        name: 'Chainlink',
        icon: '/icons/chainlink.png',
        description: 'Price feeds',
        href: '/defi/projects/chainlink',
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

    expect(resolveDefiDependencies(dependencies, defiProjectsById)).toEqual([
      {
        name: 'Rocket Pool rETH',
        icon: '/icons/reth.png',
        description: 'rETH rate',
      },
    ])
  })

  it('does not link tracked dependencies that are not DeFi projects', () => {
    const dependencies: ProjectExternalDependency[] = [
      {
        type: 'tracked',
        projectId: ProjectId('unknown-oracle'),
        description: 'Missing from DeFi',
      },
    ]

    expect(resolveDefiDependencies(dependencies, defiProjectsById)).toEqual([
      {
        name: 'unknown-oracle',
        icon: '/icons/unknown-oracle.png',
        description: 'Missing from DeFi',
      },
    ])
  })

  it('returns an empty list when there are no dependencies', () => {
    expect(resolveDefiDependencies([], defiProjectsById)).toEqual([])
  })
})
