import { Bytes, ChainSpecificAddress } from '@l2beat/shared-pure'
import type { ContractValue } from '../../output/types'
import type { IProvider } from '../../provider/IProvider'
import { getPastUpgradesSingleEvent } from '../pastUpgrades'
import type { ProxyDetails } from '../types'

// keccak256("matic.network.proxy.implementation")
const IMPLEMENTATION_SLOT = Bytes.fromHex(
  '0xbaab7dbf64751104133af04abc7d9979f0fda3b059a322a8333f533d3f32bf7f',
)

// keccak256("matic.network.proxy.owner")
const ADMIN_SLOT = Bytes.fromHex(
  '0x44f6e2e8884cba1236b7f22f351fa5d88b17292b7e0225ca47e5ecdf6055cdd6',
)

export async function detectPolygonProxy(
  provider: IProvider,
  address: ChainSpecificAddress,
): Promise<ProxyDetails | undefined> {
  const implementation = await provider.getStorageAsAddress(
    address,
    IMPLEMENTATION_SLOT,
  )
  if (implementation === ChainSpecificAddress.ZERO(provider.chain)) {
    return
  }
  const admin = await provider.getStorageAsAddress(address, ADMIN_SLOT)
  const pastUpgrades = await getPastUpgradesSingleEvent(
    provider,
    address,
    'event ProxyUpdated(address indexed implementation, address indexed _old)',
  )
  return {
    type: 'Polygon proxy',
    values: {
      $admin: admin.toString(),
      $implementation: implementation.toString(),
      $pastUpgrades: pastUpgrades as ContractValue,
      $upgradeCount: pastUpgrades.length,
    },
  }
}
