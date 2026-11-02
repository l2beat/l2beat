import { ChainSpecificAddress, ProjectId } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { getLiquidStakingConfigurationId } from './getLiquidStakingConfigurationId'

describe(getLiquidStakingConfigurationId.name, () => {
  it('ignores the order of the config keys', () => {
    const wBETH = ChainSpecificAddress(
      'eth:0x1111111111111111111111111111111111111111',
    )
    const unwrapToken = ChainSpecificAddress(
      'eth:0x2222222222222222222222222222222222222222',
    )
    expect(
      getLiquidStakingConfigurationId(ProjectId('wbeth'), {
        type: 'wbeth',
        wBETH,
        unwrapToken,
        marketQuotes: [],
      }),
    ).toEqual(
      getLiquidStakingConfigurationId(ProjectId('wbeth'), {
        marketQuotes: [],
        unwrapToken,
        wBETH,
        type: 'wbeth',
      }),
    )
  })

  it('keeps the id when the quoted pools change', () => {
    const rETH = ChainSpecificAddress(
      'eth:0x1111111111111111111111111111111111111111',
    )
    expect(
      getLiquidStakingConfigurationId(ProjectId('rocketpool'), {
        type: 'rocketpool',
        rETH,
        marketQuotes: [],
      }),
    ).toEqual(
      getLiquidStakingConfigurationId(ProjectId('rocketpool'), {
        type: 'rocketpool',
        rETH,
        marketQuotes: [{ type: 'uniswapV3', fee: 100 }],
      }),
    )
  })
})
