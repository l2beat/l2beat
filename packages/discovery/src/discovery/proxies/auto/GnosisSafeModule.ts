import { ProxyDetails } from '@l2beat/discovery-types'
import { Bytes, EthereumAddress } from '@l2beat/shared-pure'

import { IProvider } from '../../provider/IProvider'
import { getModules } from '../../utils/getSafeModules'

// TODO: (sz-piotr) Is this simply equivalent to 0x66 and 0x67?
const AVATAR_SLOT = Bytes.fromHex(
  '0x0000000000000000000000000000000000000000000000000000000000000066',
)
const TARGET_SLOT = Bytes.fromHex(
  '0x0000000000000000000000000000000000000000000000000000000000000067',
)

async function getGuard(
  provider: IProvider,
  address: EthereumAddress,
): Promise<EthereumAddress | undefined> {
  return await provider.callMethod<EthereumAddress>(
    address,
    'function getGuard() external view returns (address)',
    [],
  )
}

export async function detectGnosisSafeZodiacModule(
  provider: IProvider,
  address: EthereumAddress,
): Promise<ProxyDetails | undefined> {
  const [guard, avatar, target] = await Promise.all([
    getGuard(provider, address),
    provider.getStorageAsAddress(address, AVATAR_SLOT),
    provider.getStorageAsAddress(address, TARGET_SLOT),
  ])

  if (
    guard === undefined ||
    avatar === EthereumAddress.ZERO ||
    target === EthereumAddress.ZERO
  ) {
    return
  }

  const modules = await getModules(provider, address)

  return {
    implementations: [],
    relatives: modules ?? [],
    upgradeability: {
      type: 'gnosis safe zodiac module',
      avatar,
      target,
      guard,
      modules,
    },
  }
}
