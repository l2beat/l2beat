import { expect } from 'earl'

import { ProjectDiscovery } from '../../../ProjectDiscovery'
import { HARDCODED } from '../../hardcoded'

describe('HARDCODED: arbitrum', () => {
  const arbitrumDiscovery = new ProjectDiscovery('arbitrum')

  // check whether there were any additional calls to setIsBatchPoster
  // since the last commit of the discovered.json
  it('sequencer', () => {
    const count = arbitrumDiscovery.getContractValue(
      'SequencerInbox',
      'setIsBatchPosterCount',
    )

    expect(count).toEqual(HARDCODED.ARBITRUM.SET_SEQUENCER_COUNT)
  })

  // check whether there were any additional calls to setValidator
  // since the last commit of the discovered.json
  it('validators', () => {
    const count = arbitrumDiscovery.getContractValue(
      'RollupProxy',
      'setValidatorCount',
    )

    expect(count).toEqual(HARDCODED.ARBITRUM.SET_VALIDATOR_COUNT)
  })
})
