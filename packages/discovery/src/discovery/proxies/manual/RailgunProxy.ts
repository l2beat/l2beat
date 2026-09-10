import { Bytes, ChainSpecificAddress } from '@l2beat/shared-pure'
import type { ContractValue } from '../../output/types'
import type { IProvider } from '../../provider/IProvider'
import { getAdmin, getImplementation, getOwner } from '../auto/Eip1967Proxy'
import { getPastUpgradesSingleEvent } from '../pastUpgrades'
import type { ProxyDetails } from '../types'

// bytes32(uint256(keccak256('eip1967.proxy.paused')) - 1)
// Used by Railgun's PausableUpgradableProxy. When set to true all calls
// forwarded to the implementation revert.
export const PAUSED_SLOT = Bytes.fromHex(
  '0x8dea8703c3cf94703383ce38a9c894669dccd4ca8e65ddb43267aa0248711450',
)

async function getPaused(
  provider: IProvider,
  address: ChainSpecificAddress,
): Promise<boolean> {
  const paused = await provider.getStorageAsBigint(address, PAUSED_SLOT)
  return paused !== 0n
}

export async function getRailgunProxy(
  provider: IProvider,
  address: ChainSpecificAddress,
): Promise<ProxyDetails | undefined> {
  const implementation = await getImplementation(provider, address)
  if (implementation === ChainSpecificAddress.ZERO(provider.chain)) {
    return
  }
  const pastUpgrades = await getPastUpgradesSingleEvent(
    provider,
    address,
    'event ProxyUpgrade(address previousImplementation, address implementation)',
  )
  let admin = await getAdmin(provider, address)
  if (admin === ChainSpecificAddress.ZERO(provider.chain)) {
    admin = await getOwner(provider, address)
  }
  const paused = await getPaused(provider, address)

  return {
    type: 'Railgun proxy',
    values: {
      $admin: admin.toString(),
      $implementation: implementation.toString(),
      $paused: paused,
      $pastUpgrades: pastUpgrades as ContractValue,
      $upgradeCount: pastUpgrades.length,
    },
  }
}
