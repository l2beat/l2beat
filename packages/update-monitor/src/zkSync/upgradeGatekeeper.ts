import { providers } from 'ethers'
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
    roles: [],
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

  let shouldContinue = true
  const managed: string[] = []
  for (let i = 0; shouldContinue; ++i) {
    try {
      const address = await gateKeeper.managedContracts(i)
      managed.push(address)
    } catch {
      shouldContinue = false
    }
  }
  return managed
}
