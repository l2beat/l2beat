import type { ContractValue, ProxyDetails } from '@l2beat/discovery-types'
import { Bytes, EthereumAddress } from '@l2beat/shared-pure'
import type { IProvider } from '../../provider/IProvider'
import { getPastUpgradesSingleEvent } from '../pastUpgrades'

// keccak256('eip1967.proxy.beacon') - 1)
const BEACON_SLOT = Bytes.fromHex(
  '0xa3f0ad74e5423aebfd80d3ef4346578335a9a72aeaee59ff6cb3582b35133d50',
)

function getBeacon(
  provider: IProvider,
  address: EthereumAddress,
): Promise<EthereumAddress> {
  return provider.getStorageAsAddress(address, BEACON_SLOT)
}

async function getImplementation(
  provider: IProvider,
  address: EthereumAddress,
): Promise<EthereumAddress | undefined> {
  const implementationMethod =
    'function implementation() external view returns (address)'
  const implementation = await provider.callMethod<EthereumAddress>(
    address,
    implementationMethod,
    [],
  )

  return implementation
}

async function getOwner(
  provider: IProvider,
  address: EthereumAddress,
): Promise<EthereumAddress> {
  const ownerMethod = 'function owner() public view returns (address)'
  const owner = await provider.callMethod<EthereumAddress>(
    address,
    ownerMethod,
    [],
  )
  return owner ?? EthereumAddress.ZERO
}

export async function detectBeaconProxy(
  provider: IProvider,
  address: EthereumAddress,
): Promise<ProxyDetails | undefined> {
  const beacon = await getBeacon(provider, address)
  if (beacon === EthereumAddress.ZERO) {
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
