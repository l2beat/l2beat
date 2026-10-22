import type { ProjectDefiInfo } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { resolveCropsProject } from './api'
import { LEDGER, UNISWAP } from './test/fixtures'

describe(resolveCropsProject.name, () => {
  const { scalingInfo: _, ...defiProject } = {
    ...UNISWAP,
    defiInfo: { category: 'DEX' } as ProjectDefiInfo,
  }
  const now = UnixTime(1_800_000_000)

  it('links a DeFi project to its page when ossification shows it', () => {
    expect(resolveCropsProject(defiProject, LEDGER, now).href).toEqual(
      'https://l2beat.com/defi/projects/uniswap-v3',
    )
  })

  it('does not link a DeFi project without an ossification history', () => {
    const { ossificationHistory: __, ...unmeasured } = defiProject
    expect(resolveCropsProject(unmeasured, LEDGER, now).href).toEqual(null)
  })
})
