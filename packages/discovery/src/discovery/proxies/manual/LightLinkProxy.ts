import { ProxyDetails } from '@l2beat/discovery-types'
import { assert, EthereumAddress } from '@l2beat/shared-pure'

import { utils } from 'ethers'
import { callMethod } from '../../handlers/utils/callMethod'
import { toFunctionFragment } from '../../handlers/utils/toFunctionFragment'
import { DiscoveryProvider } from '../../provider/DiscoveryProvider'
import { getImplementation } from '../auto/Eip1967Proxy'

async function getRegistryAddress(
  provider: DiscoveryProvider,
  address: EthereumAddress,
  blockNumber: number,
): Promise<EthereumAddress> {
  const registryFragment = toFunctionFragment(
    'function bridgeRegistry() view returns (address)',
  )
  const registry = await callMethod(
    provider,
    address,
    registryFragment,
    [],
    blockNumber,
  )
  if (registry.value === undefined) {
    // Assume we're the registry
    return address
  }

  return EthereumAddress(registry.value.toString())
}

async function getAdminMultisig(
  provider: DiscoveryProvider,
  address: EthereumAddress,
  blockNumber: number,
): Promise<EthereumAddress> {
  const registry = await getRegistryAddress(provider, address, blockNumber)
  const multisigFragment = toFunctionFragment(
    'function getMultisig() view returns (address)',
  )

  const multisig = await callMethod(
    provider,
    registry,
    multisigFragment,
    [],
    blockNumber,
  )
  assert(multisig.value !== undefined, 'Multisig not found')

  return EthereumAddress(multisig.value.toString())
}

export async function getOwner(
  provider: DiscoveryProvider,
  address: EthereumAddress,
  blockNumber: number,
): Promise<EthereumAddress> {
  const iface = new utils.Interface(['function owner() view returns (address)'])
  const result = await callMethod(
    provider,
    address,
    iface.getFunction('owner'),
    [],
    blockNumber,
  )
  if (result.value !== undefined) {
    return EthereumAddress(result.value.toString())
  }
  return EthereumAddress.ZERO
}

export async function getLightLinkProxy(
  provider: DiscoveryProvider,
  address: EthereumAddress,
  blockNumber: number,
): Promise<ProxyDetails | undefined> {
  const implementation = await getImplementation(provider, address, blockNumber)
  if (implementation === EthereumAddress.ZERO) {
    return
  }
  const admin = await getAdminMultisig(provider, address, blockNumber)
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
