import type { ProjectLiquidStakingMarketQuote } from '@l2beat/config'
import { ChainSpecificAddress, ProjectId } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { getLiquidStakingConfigurationId } from './getLiquidStakingConfigurationId'

const wBETH = ChainSpecificAddress(
  'eth:0x1111111111111111111111111111111111111111',
)
const unwrapToken = ChainSpecificAddress(
  'eth:0x2222222222222222222222222222222222222222',
)
const UNISWAP: ProjectLiquidStakingMarketQuote = { type: 'uniswapV3', fee: 100 }
const CURVE: ProjectLiquidStakingMarketQuote = {
  type: 'curve',
  pool: unwrapToken,
  i: 1,
  j: 0,
}

describe(getLiquidStakingConfigurationId.name, () => {
  it('ignores the order of the config keys and of the pools', () => {
    expect(
      getLiquidStakingConfigurationId(
        ProjectId('wbeth'),
        { type: 'wbeth', wBETH, unwrapToken },
        [UNISWAP, CURVE],
      ),
    ).toEqual(
      getLiquidStakingConfigurationId(
        ProjectId('wbeth'),
        { unwrapToken, wBETH, type: 'wbeth' },
        [{ j: 0, i: 1, pool: unwrapToken, type: 'curve' }, UNISWAP],
      ),
    )
  })

  it('changes with the pools quoted, so their history is read again', () => {
    const contracts = { type: 'wbeth' as const, wBETH, unwrapToken }

    expect(
      getLiquidStakingConfigurationId(ProjectId('wbeth'), contracts, [UNISWAP]),
    ).not.toEqual(
      getLiquidStakingConfigurationId(ProjectId('wbeth'), contracts, [
        UNISWAP,
        CURVE,
      ]),
    )
  })
})
