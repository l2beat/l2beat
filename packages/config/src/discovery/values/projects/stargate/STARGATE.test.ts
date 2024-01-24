import { assert } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { ProjectDiscovery } from '../../../ProjectDiscovery'
import { HARDCODED } from '../../hardcoded'

describe('HARDCODED: stargate', () => {
  const discovery = new ProjectDiscovery('stargate')

  // check whether new oracles appeared in discovered.json
  it('oracles', () => {
    const oracles = discovery.getContractValue(
      'UltraLightNodeV2',
      'stargateOracles',
    )

    assert(Array.isArray(oracles), 'oracles is not an array')

    expect(oracles.length).toEqual(HARDCODED.STARGATE.ORACLE_COUNT)
  })

  // check whether new relayers appeared in discovered.json
  it('relayers', () => {
    const relayers = discovery.getContractValue(
      'UltraLightNodeV2',
      'stargateRelayers',
    )

    assert(Array.isArray(relayers), 'relayers is not an array')

    expect(relayers.length).toEqual(HARDCODED.STARGATE.RELAYER_COUNT)
  })
})
