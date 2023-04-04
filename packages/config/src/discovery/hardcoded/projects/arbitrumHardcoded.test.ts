import { expect } from 'earl'

import { ProjectDiscovery } from '../../ProjectDiscovery'
import { TESTS_HARDCODED } from '../hardcoded.test'

describe('hardcoded', () => {
  describe('arbitrum', () => {
    const arbitrumDiscovery = new ProjectDiscovery('arbitrum')

    // check whether there were any additional calls to setIsBatchPoster
    // since the last commit of the discovered.json
    it('sequencer', () => {
      const count = arbitrumDiscovery.getContractValue(
        'SequencerInbox',
        'setIsBatchPosterCount',
      )

      expect(count).toEqual(TESTS_HARDCODED.ARBITRUM_SET_SEQUENCER_COUNT)
    })

    // check whether there were any additional calls to setValidator
    // since the last commit of the discovered.json
    it('validators', () => {
      const count = arbitrumDiscovery.getContractValue(
        'RollupProxy',
        'setValidatorCount',
      )

      expect(count).toEqual(TESTS_HARDCODED.ARBITRUM_SET_VALIDATOR_COUNT)
    })
  })
})
