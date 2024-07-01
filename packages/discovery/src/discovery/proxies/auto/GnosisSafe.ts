import { assert } from '@l2beat/backend-tools'
import { ProxyDetails } from '@l2beat/discovery-types'
import { EthereumAddress } from '@l2beat/shared-pure'

import { IProvider } from '../../provider/IProvider'
import { getModules } from '../../utils/getSafeModules'

async function getMasterCopy(
  provider: IProvider,
  address: EthereumAddress,
): Promise<EthereumAddress | undefined> {
  const [callResult, slot0] = await Promise.all([
    provider.callMethod<EthereumAddress>(
      address,
      'function masterCopy() view returns(address)',
      [],
    ),
    provider.getStorageAsAddress(address, 0),
  ])
  if (slot0 === callResult) {
    return slot0
  }
}

async function getOwnersCount(
  provider: IProvider,
  address: EthereumAddress,
): Promise<number | undefined> {
  const owners = await provider.callMethod<string[]>(
    address,
    'function getOwners() view returns (address[])',
    [],
  )
  return owners?.length
}

async function getThreshold(
  provider: IProvider,
  address: EthereumAddress,
): Promise<number | undefined> {
  // TODO: (sz-piotr) Shouldn't this be BigNumber!?
  return await provider.callMethod<number>(
    address,
    'function getThreshold() view returns (uint256)',
    [],
  )
}

export async function detectGnosisSafe(
  provider: IProvider,
  address: EthereumAddress,
): Promise<ProxyDetails | undefined> {
  const masterCopy = await getMasterCopy(provider, address)
  if (!masterCopy) {
    return
  }

  const modules = await getModules(provider, address)
  assert(modules, 'Could not find modules for GnosisSafe')

  const ownerCount = await getOwnersCount(provider, address)
  const threshold = await getThreshold(provider, address)
  assert(ownerCount !== undefined, 'Cannot retrieve owner count')
  assert(threshold !== undefined, 'Cannot retrieve threshold')

  const thresholdString = `${threshold} of ${ownerCount} (${(
    (threshold / ownerCount) *
    100
  ).toFixed()}%)`

  return {
    implementations: [masterCopy],
    relatives: modules,
    upgradeability: {
      type: 'gnosis safe',
      masterCopy,
      modules,
      threshold: thresholdString,
    },
  }
}
