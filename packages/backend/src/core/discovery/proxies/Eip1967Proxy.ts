import { Bytes, EthereumAddress } from '@l2beat/types'

import { DiscoveryProvider } from '../provider/DiscoveryProvider'
import { bytes32ToAddress } from '../utils/address'
import { ProxyDetection } from './types'

// keccak256('eip1967.proxy.implementation') - 1)
const IMPLEMENTATION_SLOT = Bytes.fromHex(
  '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc',
)

async function getImplementation(
  provider: DiscoveryProvider,
  address: EthereumAddress,
) {
  return bytes32ToAddress(
    await provider.getStorage(address, IMPLEMENTATION_SLOT),
  )
}

// keccak256('eip1967.proxy.admin') - 1)
const ADMIN_SLOT = Bytes.fromHex(
  '0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103',
)

async function getAdmin(provider: DiscoveryProvider, address: EthereumAddress) {
  return bytes32ToAddress(await provider.getStorage(address, ADMIN_SLOT))
}

async function detect(
  provider: DiscoveryProvider,
  address: EthereumAddress,
): Promise<ProxyDetection | undefined> {
  const implementation = await getImplementation(provider, address)
  if (implementation === EthereumAddress.ZERO) {
    return
  }
  const admin = await getAdmin(provider, address)
  return {
    implementations: [implementation],
    relatives: [admin],
    upgradeability: {
      type: 'EIP1967 proxy',
      implementation,
      admin,
    },
  }
}

export const Eip1967Proxy = {
  getImplementation,
  getAdmin,
  detect,
}
