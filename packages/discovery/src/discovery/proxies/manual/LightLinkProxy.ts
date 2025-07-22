import { assert, ChainSpecificAddress } from '@l2beat/shared-pure'
import type { ContractValue } from '../../output/types'
import type { IProvider } from '../../provider/IProvider'
import { getImplementation } from '../auto/Eip1967Proxy'
import { getPastUpgradesSingleEvent } from '../pastUpgrades'
import type { ProxyDetails } from '../types'

async function getRegistryAddress(
  provider: IProvider,
  address: ChainSpecificAddress,
): Promise<ChainSpecificAddress> {
  const registry = await provider.callMethod<string>(
    address,
    'function bridgeRegistry() view returns (address)',
    [],
  )
  if (registry === undefined) {
    // Assume we're the registry
    return address
  }

  return ChainSpecificAddress(registry)
}

async function getAdminMultisig(
  provider: IProvider,
  address: ChainSpecificAddress,
): Promise<ChainSpecificAddress> {
  const registry = await getRegistryAddress(provider, address)
  const multisig = await provider.callMethod<string>(
    registry,
    'function getMultisig() view returns (address)',
    [],
  )
  assert(multisig !== undefined, 'Multisig not found')

  return ChainSpecificAddress(multisig.toString())
}

export async function getLightLinkProxy(
  provider: IProvider,
  address: ChainSpecificAddress,
): Promise<ProxyDetails | undefined> {
  const implementation = await getImplementation(provider, address)
  if (implementation === ChainSpecificAddress.ZERO(provider.chain)) {
    return
  }
  const admin = await getAdminMultisig(provider, address)
  const pastUpgrades = await getPastUpgradesSingleEvent(
    provider,
    address,
    'event Upgraded(address indexed implementation)',
  )

  return {
    type: 'LightLink proxy',
    values: {
      $admin: admin.toString(),
      $implementation: implementation.toString(),
      $pastUpgrades: pastUpgrades as ContractValue,
      $upgradeCount: pastUpgrades.length,
    },
  }
}
