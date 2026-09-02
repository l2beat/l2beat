import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { getDefiTvlConfigurationId } from './getDefiTvlConfigurationId'

describe(getDefiTvlConfigurationId.name, () => {
  const config = {
    projectId: ProjectId('uniswapv3'),
    protocolSlug: 'uniswap-v3',
    sinceTimestamp: UnixTime(1_620_172_800),
    chains: [
      { chain: 'ethereum', providerChain: 'Ethereum' },
      { chain: 'arbitrum', providerChain: 'Arbitrum' },
    ],
  }

  it('is stable across chain ordering', () => {
    const first = getDefiTvlConfigurationId(config)
    const second = getDefiTvlConfigurationId({
      ...config,
      chains: [...config.chains].reverse(),
    })

    expect(first).toEqual(second)
    expect(first).toHaveLength(12)
  })

  it('changes when provider semantics change', () => {
    const first = getDefiTvlConfigurationId(config)
    const second = getDefiTvlConfigurationId({
      ...config,
      chains: [
        { chain: 'ethereum', providerChain: 'Ethereum-staking' },
        config.chains[1],
      ],
    })

    expect(first).not.toEqual(second)
  })
})
