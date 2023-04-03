import { expect } from 'earl'

import { ProjectDiscovery } from '../ProjectDiscovery'
import { TESTS_HARDCODED } from './hardcoded'

describe('hardcoded', () => {
  describe('arbitrum', () => {
    const arbitrumDiscovery = new ProjectDiscovery('arbitrum')

    it('sequencer', () => {
      const count = arbitrumDiscovery.getContractValue(
        'SequencerInbox',
        'setIsBatchPosterCount',
      )

      expect(count).toEqual(TESTS_HARDCODED.ARBITRUM_SET_SEQUENCER_COUNT)
    })

    it('validators', () => {
      const count = arbitrumDiscovery.getContractValue(
        'RollupProxy',
        'setValidatorCount',
      )

      expect(count).toEqual(TESTS_HARDCODED.ARBITRUM_SET_VALIDATOR_COUNT)
    })
  })
})
