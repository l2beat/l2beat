import type { ProjectDefiCategory } from '@l2beat/config'
import { expect } from 'earl'
import { filterDefiSummaryProjects } from './defiSummaryVisibility'

describe(filterDefiSummaryProjects.name, () => {
  const projects = [
    project('lido', 'Liquid Staking'),
    project('uniswapv3', 'DEX'),
    project('rocketpool', 'Liquid Staking'),
    project('chainlink', 'Oracle'),
  ]

  it('keeps only the listed categories, in the original order', () => {
    const result = filterDefiSummaryProjects(projects, ['Liquid Staking'])

    expect(result.map((p) => p.id)).toEqual(['lido', 'rocketpool'])
  })

  it('hides every non liquid staking project that exists today', () => {
    const hidden = [
      project('chainlink', 'Oracle'),
      project('frankencoin', 'Stablecoin'),
      project('liquityv2', 'Stablecoin'),
      project('polymarket', 'Prediction market'),
      project('uniswapv3', 'DEX'),
      project('uniswapv4', 'DEX'),
    ]
    const shown = [
      project('lido', 'Liquid Staking'),
      project('rocketpool', 'Liquid Staking'),
      project('wbeth', 'Liquid Staking'),
      project('etherfi', 'Liquid Staking'),
    ]

    const result = filterDefiSummaryProjects(
      [...hidden, ...shown],
      ['Liquid Staking'],
    )

    expect(result.map((p) => p.id)).toEqual([
      'lido',
      'rocketpool',
      'wbeth',
      'etherfi',
    ])
  })

  it('keeps every project when no categories are set', () => {
    const result = filterDefiSummaryProjects(projects, undefined)

    expect(result.map((p) => p.id)).toEqual([
      'lido',
      'uniswapv3',
      'rocketpool',
      'chainlink',
    ])
  })
})

function project(id: string, category: ProjectDefiCategory) {
  return { id, defiInfo: { category } }
}
