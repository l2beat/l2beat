import {
  Bytes,
  ChainSpecificAddress,
  EthereumAddress,
} from '@l2beat/shared-pure'
import type { ContractValue } from '../../output/types'
import type { IProvider } from '../../provider/IProvider'
import { getPastUpgradesSingleEvent } from '../pastUpgrades'
import type { ProxyDetails } from '../types'

// keccak256('eip1967.proxy.beacon') - 1)
const BEACON_SLOT = Bytes.fromHex(
  '0xa3f0ad74e5423aebfd80d3ef4346578335a9a72aeaee59ff6cb3582b35133d50',
)

function getBeacon(
  provider: IProvider,
  address: ChainSpecificAddress,
): Promise<ChainSpecificAddress> {
  return provider.getStorageAsAddress(address, BEACON_SLOT)
}

async function getImplementation(
  provider: IProvider,
  address: ChainSpecificAddress,
): Promise<ChainSpecificAddress | undefined> {
  const implementationMethod =
    'function implementation() external view returns (address)'
  const implementation = await provider.callMethod<EthereumAddress>(
    address,
    implementationMethod,
    [],
  )

  if (implementation === undefined) {
    return
  }

  return ChainSpecificAddress.fromLong(provider.chain, implementation)
}

async function getOwner(
  provider: IProvider,
  address: ChainSpecificAddress,
): Promise<ChainSpecificAddress> {
  const ownerMethod = 'function owner() public view returns (address)'
  const owner = await provider.callMethod<EthereumAddress>(
    address,
    ownerMethod,
    [],
  )
  return ChainSpecificAddress.fromLong(
    provider.chain,
    owner ?? EthereumAddress.ZERO,
  )
}

export async function detectBeaconProxy(
  provider: IProvider,
  address: ChainSpecificAddress,
): Promise<ProxyDetails | undefined> {
  const beacon = await getBeacon(provider, address)
  if (beacon === ChainSpecificAddress.ZERO(provider.chain)) {
    return
  }

  const owner = await getOwner(provider, beacon)
  const implementation = await getImplementation(provider, beacon)
  if (implementation === undefined) {
    return
  }

  const pastUpgrades = await getPastUpgradesSingleEvent(
    provider,
    beacon,
    'event Upgraded(address indexed implementation)',
  )

  return {
    type: 'Beacon proxy',
    values: {
      $admin: owner,
      $implementation: implementation.toString(),
      $beacon: beacon.toString(),
      $pastUpgrades: pastUpgrades as ContractValue,
      $upgradeCount: pastUpgrades.length,
    },
  }
}
