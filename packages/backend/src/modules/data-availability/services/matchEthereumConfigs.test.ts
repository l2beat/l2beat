import type { EthereumDaTrackingConfig } from '@l2beat/config'
import { ProjectId } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { matchEthereumConfigs } from './matchEthereumConfigs'

describe(matchEthereumConfigs.name, () => {
  const SEQUENCER = '0xSequencer'
  const INBOX = '0xInbox'

  it('matches by inbox and sequencer, ignoring case', () => {
    const config = ethereumConfig({ inbox: INBOX, sequencers: [SEQUENCER] })

    const matched = matchEthereumConfigs([config], 100, {
      inbox: INBOX.toLowerCase(),
      sequencer: SEQUENCER.toUpperCase(),
      topics: [],
    })

    expect(matched).toEqual([config])
  })

  it('matches an Aztec-style project by an event topic alone', () => {
    const config = ethereumConfig({ topics: ['0xTopic'] })

    const matched = matchEthereumConfigs([config], 100, {
      inbox: '0xelsewhere',
      sequencer: '0xanyone',
      topics: ['0xtopic'],
    })

    expect(matched).toEqual([config])
  })

  it('considers only configs in force at the block, both ends included', () => {
    // The same inbox moved between projects at block 200
    const before = ethereumConfig({
      projectId: 'before',
      inbox: INBOX,
      sinceBlock: 100,
      untilBlock: 199,
    })
    const after = ethereumConfig({
      projectId: 'after',
      inbox: INBOX,
      sinceBlock: 200,
    })
    const tx = { inbox: INBOX, sequencer: SEQUENCER, topics: [] }

    expect(matchEthereumConfigs([before, after], 99, tx)).toEqual([])
    expect(matchEthereumConfigs([before, after], 100, tx)).toEqual([before])
    expect(matchEthereumConfigs([before, after], 199, tx)).toEqual([before])
    expect(matchEthereumConfigs([before, after], 200, tx)).toEqual([after])
  })
})

function ethereumConfig(
  overrides: Partial<EthereumDaTrackingConfig> & { projectId?: string },
): EthereumDaTrackingConfig & { projectId: ProjectId } {
  return {
    type: 'ethereum',
    daLayer: ProjectId('ethereum'),
    inbox: '0xnone',
    sinceBlock: 0,
    ...overrides,
    projectId: ProjectId(overrides.projectId ?? 'project'),
  }
}
