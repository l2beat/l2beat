import { DiscoveryConfig, DiscoveryEngine } from '@l2beat/discovery'
import { expect, mockObject } from 'earl'

import { DiscoveryRunner } from './DiscoveryRunner'

describe(DiscoveryRunner.name, () => {
  describe(DiscoveryRunner.prototype.discover.name, () => {
    it('runs discovery twice', async () => {
      const engine = mockObject<DiscoveryEngine>({ discover: async () => [] })
      const runner = new DiscoveryRunner(engine)
      await runner.run(config, 1)

      expect(engine.discover).toHaveBeenCalledTimes(2)
    })
  })
})

const config: DiscoveryConfig = new DiscoveryConfig({
  name: 'project-a',
  initialAddresses: [],
})
