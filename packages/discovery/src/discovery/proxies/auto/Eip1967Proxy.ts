import { Bytes, EthereumAddress, ProxyDetails } from '@l2beat/shared-pure'

import { DiscoveryProvider } from '../../provider/DiscoveryProvider'
import { bytes32ToAddress } from '../../utils/address'

// keccak256('eip1967.proxy.implementation') - 1)
const IMPLEMENTATION_SLOT = Bytes.fromHex(
  '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc',
)

export async function getImplementation(
  provider: DiscoveryProvider,
  address: EthereumAddress,
  blockNumber: number,
) {
  return bytes32ToAddress(
    await provider.getStorage(address, IMPLEMENTATION_SLOT, blockNumber),
  )
}

// keccak256('eip1967.proxy.admin') - 1)
const ADMIN_SLOT = Bytes.fromHex(
  '0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103',
)

export async function getAdmin(
  provider: DiscoveryProvider,
  address: EthereumAddress,
  blockNumber: number,
) {
  return bytes32ToAddress(
    await provider.getStorage(address, ADMIN_SLOT, blockNumber),
  )
}

export async function detectEip1967Proxy(
  provider: DiscoveryProvider,
  address: EthereumAddress,
  blockNumber: number,
): Promise<ProxyDetails | undefined> {
  const implementation = await getImplementation(provider, address, blockNumber)
  if (implementation === EthereumAddress.ZERO) {
    return
  }
  const admin = await getAdmin(provider, address, blockNumber)
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
