import { ProxyDetails } from '@l2beat/discovery-types'

import { Bytes } from '../../../utils/Bytes'
import { EthereumAddress } from '../../../utils/EthereumAddress'
import { DiscoveryProvider } from '../../provider/DiscoveryProvider'
import { bytes32ToAddress } from '../../utils/address'
import { getModules } from './GnosisSafe'

const GUARD_SLOT = Bytes.fromHex(
  '0x0000000000000000000000000000000000000000000000000000000000000065',
)
const AVATAR_SLOT = Bytes.fromHex(
  '0x0000000000000000000000000000000000000000000000000000000000000066',
)
const TARGET_SLOT = Bytes.fromHex(
  '0x0000000000000000000000000000000000000000000000000000000000000067',
)

interface AvatarAndTarget {
  avatar: EthereumAddress
  target: EthereumAddress
}

async function getAvatarAndTarget(
  provider: DiscoveryProvider,
  address: EthereumAddress,
  blockNumber: number,
): Promise<AvatarAndTarget> {
  const [avatarBytes, targetBytes] = await Promise.all([
    provider.getStorage(address, AVATAR_SLOT, blockNumber),
    provider.getStorage(address, TARGET_SLOT, blockNumber),
  ])
  return {
    avatar: bytes32ToAddress(avatarBytes),
    target: bytes32ToAddress(targetBytes),
  }
}

async function getGuard(
  provider: DiscoveryProvider,
  address: EthereumAddress,
  blockNumber: number,
): Promise<EthereumAddress> {
  return bytes32ToAddress(
    await provider.getStorage(address, GUARD_SLOT, blockNumber),
  )
}

export async function detectGnosisSafeZodiacModule(
  provider: DiscoveryProvider,
  address: EthereumAddress,
  blockNumber: number,
): Promise<ProxyDetails | undefined> {
  const { avatar, target } = await getAvatarAndTarget(
    provider,
    address,
    blockNumber,
  )
  if (avatar === EthereumAddress.ZERO || target === EthereumAddress.ZERO) {
    return
  }
  const [guard, modules] = await Promise.all([
    getGuard(provider, address, blockNumber),
    getModules(provider, address, blockNumber),
  ])

  return {
    implementations: [],
    relatives: modules,
    upgradeability: {
      type: 'gnosis safe zodiac module',
      avatar,
      target,
      guard,
      modules,
    },
  }
}
