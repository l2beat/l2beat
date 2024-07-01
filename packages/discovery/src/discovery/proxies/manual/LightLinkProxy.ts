import { ProxyDetails } from '@l2beat/discovery-types'
import { assert, EthereumAddress } from '@l2beat/shared-pure'

import { IProvider } from '../../provider/IProvider'
import { getImplementation } from '../auto/Eip1967Proxy'

async function getRegistryAddress(
  provider: IProvider,
  address: EthereumAddress,
): Promise<EthereumAddress> {
  const registry = await provider.callMethod<string>(
    address,
    'function bridgeRegistry() view returns (address)',
    [],
  )
  if (registry === undefined) {
    // Assume we're the registry
    return address
  }

  return EthereumAddress(registry)
}

async function getAdminMultisig(
  provider: IProvider,
  address: EthereumAddress,
): Promise<EthereumAddress> {
  const registry = await getRegistryAddress(provider, address)
  const multisig = await provider.callMethod<string>(
    registry,
    'function getMultisig() view returns (address)',
    [],
  )
  assert(multisig !== undefined, 'Multisig not found')

  return EthereumAddress(multisig.toString())
}

export async function getLightLinkProxy(
  provider: IProvider,
  address: EthereumAddress,
): Promise<ProxyDetails | undefined> {
  const implementation = await getImplementation(provider, address)
  if (implementation === EthereumAddress.ZERO) {
    return
  }
  const admin = await getAdminMultisig(provider, address)
  return {
    implementations: [implementation],
    relatives: [admin],
    upgradeability: {
      type: 'LightLink proxy',
      implementation,
      admin,
    },
  }
}
