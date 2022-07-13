import { providers } from 'ethers'

import { readArray } from '../../common/array'
import { ZkSpaceUpgradeGatekeeper__factory } from '../../typechain'
import { ContractParameters } from '../../types'
import { addresses } from '../constants'

export async function getUpgradeGatekeeper(
  provider: providers.JsonRpcProvider,
): Promise<ContractParameters> {
  const gatekeeper = ZkSpaceUpgradeGatekeeper__factory.connect(
    addresses.upgradeGatekeeper,
    provider,
  )

  return {
    name: 'UpgradeGatekeeper',
    address: gatekeeper.address,
    upgradeability: { type: 'immutable' },
    values: {
      managedContracts: await readArray((i) => gatekeeper.managedContracts(i)),
      master: await gatekeeper.getMaster(),
      mainContract: await gatekeeper.mainContract(),
    },
  }
}
