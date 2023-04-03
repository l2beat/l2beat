import { expect } from 'earl'

import { ProjectDiscovery } from '../ProjectDiscovery'

describe('hardcoded', () => {
  describe('arbitrum', () => {
    const arbitrumDiscovery = new ProjectDiscovery('arbitrum')

    it('sequencer', () => {
      const count = arbitrumDiscovery.getContractValue(
        'SequencerInbox',
        'setIsBatchPosterCount',
      )

      expect(count).toEqual(
        arbitrumDiscovery.getHardcoded('SET_IS_BATCH_POSTER_COUNT'),
      )
    })
  })
})
