import {
  assert,
  ChainSpecificAddress,
  type EthereumAddress,
} from '@l2beat/shared-pure'
import type { IProvider } from '../../provider/IProvider'
import { getModules } from '../../utils/getSafeModules'
import type { ProxyDetails } from '../types'

async function getMasterCopy(
  provider: IProvider,
  address: ChainSpecificAddress,
): Promise<ChainSpecificAddress | undefined> {
  const [callResult, slot0] = await Promise.all([
    provider.callMethod<EthereumAddress>(
      address,
      'function masterCopy() view returns(address)',
      [],
    ),
    provider.getStorageAsAddress(address, 0),
  ])
  if (
    callResult !== undefined &&
    slot0 === ChainSpecificAddress.fromLong(provider.chain, callResult)
  ) {
    return slot0
  }
}

async function getOwners(
  provider: IProvider,
  address: ChainSpecificAddress,
): Promise<ChainSpecificAddress[]> {
  const owners = await provider.callMethod<EthereumAddress[]>(
    address,
    'function getOwners() view returns (address[])',
    [],
  )
  assert(owners !== undefined, 'Cannot retrieve owners')
  return owners.map((o) => ChainSpecificAddress.fromLong(provider.chain, o))
}

async function getThreshold(
  provider: IProvider,
  address: ChainSpecificAddress,
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
  address: ChainSpecificAddress,
): Promise<ProxyDetails | undefined> {
  const masterCopy = await getMasterCopy(provider, address)
  if (!masterCopy || masterCopy === ChainSpecificAddress.ZERO(provider.chain)) {
    return
  }

  const modules = await getModules(provider, address)
  assert(modules, 'Could not find modules for GnosisSafe at address ' + address)

  const owners = await getOwners(provider, address)
  const ownerCount = owners.length
  const threshold = await getThreshold(provider, address)
  assert(threshold !== undefined, 'Cannot retrieve threshold')

  const thresholdString = `${threshold} of ${ownerCount} (${(
    (threshold / ownerCount) * 100
  ).toFixed()}%)`

  return {
    type: 'gnosis safe',
    values: {
      // TODO: (sz-piotr) Is it always the case for safes?
      $immutable: false,
      $implementation: masterCopy.toString(),
      // TODO: (sz-piotr) Why here, and not in the template?
      multisigThreshold: thresholdString,
      $threshold: Number(threshold),
      $members: owners.map((o) => o.toString()),
      GnosisSafe_modules: modules.map((m) => m.toString()),
    },
  }
}
