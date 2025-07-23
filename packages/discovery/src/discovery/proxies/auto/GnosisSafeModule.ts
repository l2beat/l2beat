import {
  Bytes,
  ChainSpecificAddress,
  type EthereumAddress,
} from '@l2beat/shared-pure'
import type { IProvider } from '../../provider/IProvider'
import { getModules } from '../../utils/getSafeModules'
import type { ProxyDetails } from '../types'

// TODO: (sz-piotr) Is this simply equivalent to 0x66 and 0x67?
const AVATAR_SLOT = Bytes.fromHex(
  '0x0000000000000000000000000000000000000000000000000000000000000066',
)
const TARGET_SLOT = Bytes.fromHex(
  '0x0000000000000000000000000000000000000000000000000000000000000067',
)

async function getGuard(
  provider: IProvider,
  address: ChainSpecificAddress,
): Promise<ChainSpecificAddress | undefined> {
  const rawAddress = await provider.callMethod<EthereumAddress>(
    address,
    'function getGuard() external view returns (address)',
    [],
  )

  if (rawAddress === undefined) {
    return
  }

  return ChainSpecificAddress.fromLong(provider.chain, rawAddress)
}

export async function detectGnosisSafeZodiacModule(
  provider: IProvider,
  address: ChainSpecificAddress,
): Promise<ProxyDetails | undefined> {
  const [guard, avatar, target] = await Promise.all([
    getGuard(provider, address),
    provider.getStorageAsAddress(address, AVATAR_SLOT),
    provider.getStorageAsAddress(address, TARGET_SLOT),
  ])

  if (
    guard === undefined ||
    avatar === ChainSpecificAddress.ZERO(provider.chain) ||
    target === ChainSpecificAddress.ZERO(provider.chain)
  ) {
    return
  }

  const modules = await getModules(provider, address)

  return {
    type: 'gnosis safe zodiac module',
    values: {
      // TODO: (sz-piotr) is this correct?
      $immutable: false,
      ZodiacModule_modules: (modules ?? []).map((m) => m.toString()),
      // TODO: (sz-piotr) ignore relative
      ZodiacModule_avatar: avatar.toString(),
      // TODO: (sz-piotr) ignore relative
      ZodiacModule_target: target.toString(),
      // TODO: (sz-piotr) ignore relative
      ZodiacModule_guard: guard.toString(),
    },
  }
}
