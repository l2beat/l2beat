import {
  assert,
  EthereumAddress,
  gatherAddressesFromUpgradeability,
} from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../../../ProjectDiscovery'
import { HARDCODED } from '../../hardcoded'

describe('HARDCODED: zksync2', () => {
  const discovery = new ProjectDiscovery('zksync2')

  // currently UPGRADE_NOTICE_PERIOD is set as a constant inside Config.sol
  // https://etherscan.io/address/0x2a2d6010202B93E727b61a60dfC1d5CF2707c1CE#code#F6#L51
  // if this asset is throwing it means that the zkSync zkSync facets changed
  // read the source code and figure out whether the upgradeability risk is different
  it('upgradeability + proposer failure', () => {
    const upgradeability = discovery.getContract('zkSync').upgradeability
    const facetAddresses = gatherAddressesFromUpgradeability(upgradeability)

    assert(
      facetAddresses.every((f) =>
        HARDCODED.ZKSYNC_2.FACETS.includes(f.toString()),
      ) && facetAddresses.length === HARDCODED.ZKSYNC_2.FACETS.length,
      `Upgrade facet changed, see the source code for the new upgradeability risk. 
      Additionally, the proposer failure risk might have changed.`,
    )
  })

  // currently the security council is set as ZERO address
  // when this test fails it means that the security council changed
  // update the permissions section and updgradeability risk
  it('security council', () => {
    const address = discovery.getAddressFromValue(
      'zkSync',
      'getSecurityCouncil',
    )
    assert(
      address === EthereumAddress(HARDCODED.ZKSYNC_2.SECURITY_COUNCIL),
      'Security Council changed, upgrade returned value and upgradeability risk.',
    )
  })

  // currently the governor is set as a multisig
  // when this test fails it means that the governor changed
  // update the permissions section and updgradeability risk
  it('governor', () => {
    const address = discovery.getAddressFromValue('zkSync', 'getGovernor')
    assert(
      address === EthereumAddress(HARDCODED.ZKSYNC_2.GOVERNOR),
      'Governor changed, upgrade returned value and upgradeability risk.',
    )
  })

  it('upgrade by', () => {
    const multisig = discovery.getContract('zkSync Era Multisig').address
    assert(
      discovery.getContractValue('zkSync', 'getGovernor') ===
        multisig.toString(),
      'zkSync governor changed, upgradeBy in contract.',
    )
    assert(
      discovery.getContractUpgradeabilityParam('L1ERC20Bridge', 'admin') ===
        multisig,
      'L1ERC20Bridge admin changed, upgradeBy in contract.',
    )
  })

  it('security council', () => {
    const securityCouncil = discovery.getContractValue(
      'zkSync',
      'getSecurityCouncil',
    )

    assert(
      securityCouncil === EthereumAddress.ZERO.toString(),
      'Security council changed. Update the upgradeability risk and permissions section (also probably remove this test). https://www.notion.so/l2beat/Zksync-Era-526c899e319e4b2690ec23eb7336e35b?pvs=4 can be useful.',
    )
  })
})
