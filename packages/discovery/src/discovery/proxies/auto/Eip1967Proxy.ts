import { ProxyDetails } from '@l2beat/discovery-types'
import { Bytes, EthereumAddress } from '@l2beat/shared-pure'

import { IProvider } from '../../provider/IProvider'

// keccak256('eip1967.proxy.implementation') - 1)
const IMPLEMENTATION_SLOT = Bytes.fromHex(
  '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc',
)

export function getImplementation(
  provider: IProvider,
  address: EthereumAddress,
): Promise<EthereumAddress> {
  return provider.getStorageAsAddress(address, IMPLEMENTATION_SLOT)
}

// keccak256('eip1967.proxy.admin') - 1)
const ADMIN_SLOT = Bytes.fromHex(
  '0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103',
)

export function getAdmin(
  provider: IProvider,
  address: EthereumAddress,
): Promise<EthereumAddress> {
  return provider.getStorageAsAddress(address, ADMIN_SLOT)
}

export async function getOwner(
  provider: IProvider,
  address: EthereumAddress,
): Promise<EthereumAddress> {
  const result = await provider.callMethod<EthereumAddress>(
    address,
    'function owner() view returns (address)',
    [],
  )
  return result ?? EthereumAddress.ZERO
}

export async function detectEip1967Proxy(
  provider: IProvider,
  address: EthereumAddress,
): Promise<ProxyDetails | undefined> {
  const implementation = await getImplementation(provider, address)
  if (implementation === EthereumAddress.ZERO) {
    return
  }
  let admin = await getAdmin(provider, address)
  // TODO: (sz-piotr) potential for errors
  if (admin === EthereumAddress.ZERO) {
    admin = await getOwner(provider, address)
  }
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
