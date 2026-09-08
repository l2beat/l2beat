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

  it('is stable across chain and property ordering', () => {
    const first = getDefiTvlConfigurationId(config)
    const second = getDefiTvlConfigurationId({
      ...config,
      chains: [
        { providerChain: 'Arbitrum', chain: 'arbitrum' },
        { providerChain: 'Ethereum', chain: 'ethereum' },
      ],
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

  it('does not change when the import boundary changes', () => {
    const first = getDefiTvlConfigurationId(config)
    const changedConfig = {
      ...config,
      sinceTimestamp: UnixTime(config.sinceTimestamp + UnixTime.DAY),
    }
    const second = getDefiTvlConfigurationId(changedConfig)

    expect(first).toEqual(second)
  })
})
