import type { ContractValue, ProxyDetails } from '@l2beat/discovery-types'
import type { EthereumAddress } from '@l2beat/shared-pure'
import type { IProvider } from '../../provider/IProvider'
import { getPastUpgradesSingleEvent } from '../pastUpgrades'

export async function getEternalStorageProxy(
  provider: IProvider,
  address: EthereumAddress,
): Promise<ProxyDetails | undefined> {
  const implementation = await provider.callMethod<EthereumAddress>(
    address,
    'function implementation() view returns (address)',
    [],
  )
  const admin = await provider.callMethod<EthereumAddress>(
    address,
    'function upgradeabilityOwner() view returns (address)',
    [],
  )
  if (!implementation || !admin) {
    return undefined
  }
  const pastUpgrades = await getPastUpgradesSingleEvent(
    provider,
    address,
    'event Upgraded(uint256 version, address indexed implementation)',
  )
  return {
    type: 'Eternal Storage proxy',
    values: {
      $admin: admin.toString(),
      $implementation: implementation.toString(),
      $pastUpgrades: pastUpgrades as ContractValue,
      $upgradeCount: pastUpgrades.length,
    },
  }
}
