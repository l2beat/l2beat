import { assert, gatherAddressesFromUpgradeability } from '@l2beat/shared'

import { ProjectDiscovery } from '../../../ProjectDiscovery'
import { HARDCODED } from '../../hardcoded'

describe('HARDCODED: zksync2', () => {
  const discovery = new ProjectDiscovery('zksync2')

  // currently UPGRADE_NOTICE_PERIOD is set as a constant inside Config.sol
  // https://etherscan.io/address/0x2a2d6010202B93E727b61a60dfC1d5CF2707c1CE#code#F6#L51
  // if this asset is throwing it means that the zkSync DiamondProxy facets changed
  // read the source code and figure out whether the upgradeability risk is different
  it('upgradeability', () => {
    const upgradeability = discovery.getContract('DiamondProxy').upgradeability
    const facetAddresses = gatherAddressesFromUpgradeability(upgradeability)

    assert(
      facetAddresses.every((f) =>
        HARDCODED.ZKSYNC_2.FACETS.includes(f.toString()),
      ) && facetAddresses.length === HARDCODED.ZKSYNC_2.FACETS.length,
      'Upgrade facet changed, see the source code for the new upgradeability params',
    )
  })
})
