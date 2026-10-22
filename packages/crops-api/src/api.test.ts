import type { ProjectDefiInfo } from '@l2beat/config'
import { expect } from 'earl'
import { resolveCropsProject } from './api'
import { LEDGER, UNISWAP } from './test/fixtures'

describe(resolveCropsProject.name, () => {
  const { scalingInfo: _, ...defiProject } = {
    ...UNISWAP,
    defiInfo: { category: 'DEX' } as ProjectDefiInfo,
  }

  it('links a DeFi project to its page when ossification shows it', () => {
    expect(resolveCropsProject(defiProject, LEDGER).href).toEqual(
      'https://l2beat.com/defi/projects/uniswap-v3',
    )
  })

  it('does not link a DeFi project without an ossification history', () => {
    const { ossificationHistory: __, ...unmeasured } = defiProject
    expect(resolveCropsProject(unmeasured, LEDGER).href).toEqual(null)
  })
})
