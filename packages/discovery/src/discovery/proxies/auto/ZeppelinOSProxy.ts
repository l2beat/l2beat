import { Bytes, ChainSpecificAddress } from '@l2beat/shared-pure'
import type { ContractValue } from '../../output/types'
import type { IProvider } from '../../provider/IProvider'
import { getPastUpgradesSingleEvent } from '../pastUpgrades'
import type { ProxyDetails } from '../types'

// keccak256('org.zeppelinos.proxy.implementation')
const IMPLEMENTATION_SLOT = Bytes.fromHex(
  '0x7050c9e0f4ca769c69bd3a8ef740bc37934f8e2c036e5a723fd8ee048ed3f8c3',
)

// keccak256("org.zeppelinos.proxy.owner")
const OWNER_SLOT = Bytes.fromHex(
  '0x337c729c04082e3bdd94ba7d2b5a8a642f3a138702366a91707825373a2029ba',
)

// keccak256("org.zeppelinos.proxy.admin")
const ADMIN_SLOT = Bytes.fromHex(
  '0x10d6a54a4754c8869d6886b5f5d7fbfa5b4522237ea5c60d11bc4e7a1ff9390b',
)

export async function detectZeppelinOSProxy(
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
  const [owner, admin] = await Promise.all([
    provider.getStorageAsAddress(address, OWNER_SLOT),
    provider.getStorageAsAddress(address, ADMIN_SLOT),
  ])

  const admins = [owner, admin].filter(
    (a) => a !== ChainSpecificAddress.ZERO(provider.chain),
  )
  const pastUpgrades = []
  try {
    pastUpgrades.push(
      ...(await getPastUpgradesSingleEvent(
        provider,
        address,
        'event Upgraded(address indexed implementation)',
      )),
    )
  } catch {
    pastUpgrades.push(
      ...(await getPastUpgradesSingleEvent(
        provider,
        address,
        'event Upgraded(address implementation)',
      )),
    )
  }

  return {
    type: 'ZeppelinOS proxy',
    values: {
      $immutable: admins.length === 0,
      $implementation: implementation.toString(),
      $admin: admins.map((a) => a.toString()),
      $pastUpgrades: pastUpgrades as ContractValue,
      $upgradeCount: pastUpgrades.length,
    },
  }
}
