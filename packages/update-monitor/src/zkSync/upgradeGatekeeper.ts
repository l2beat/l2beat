import { providers } from 'ethers'
import { readArray } from '../common/array'
import { ZkSyncUpgradeGatekeeper__factory } from '../typechain'
import { ContractParameters } from '../types'
import { addresses } from './constants'

export async function getUpgradeGatekeeper(
  provider: providers.JsonRpcProvider,
): Promise<ContractParameters> {
  return {
    name: 'UpgradeGatekeeper',
    address: addresses.upgradeGatekeeper,
    upgradeability: { type: 'immutable' },
    values: [
      {
        name: 'managedContracts',
        value: await getManagedContracts(provider),
      },
    ],
  }
}

async function getManagedContracts(provider: providers.JsonRpcProvider) {
  const gateKeeper = ZkSyncUpgradeGatekeeper__factory.connect(
    addresses.upgradeGatekeeper,
    provider,
  )
  return readArray((i) => gateKeeper.managedContracts(i))
}
