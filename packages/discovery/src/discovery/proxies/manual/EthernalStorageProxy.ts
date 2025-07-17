import { ChainSpecificAddress, type EthereumAddress } from '@l2beat/shared-pure'
import type { ContractValue } from '../../output/types'
import type { IProvider } from '../../provider/IProvider'
import { getPastUpgradesSingleEvent } from '../pastUpgrades'
import type { ProxyDetails } from '../types'

export async function getEternalStorageProxy(
  provider: IProvider,
  address: ChainSpecificAddress,
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
      $admin: ChainSpecificAddress.fromLong(provider.chain, admin).toString(),
      $implementation: ChainSpecificAddress.fromLong(
        provider.chain,
        implementation,
      ).toString(),
      $pastUpgrades: pastUpgrades as ContractValue,
      $upgradeCount: pastUpgrades.length,
    },
  }
}
