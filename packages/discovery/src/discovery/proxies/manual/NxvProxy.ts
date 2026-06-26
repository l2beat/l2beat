import {
  assert,
  ChainSpecificAddress,
  type EthereumAddress,
} from '@l2beat/shared-pure'
import type { IProvider } from '../../provider/IProvider'
import type { ProxyDetails } from '../types'

// NXVProxy is a fork of the Gnosis Safe proxy: the singleton (implementation)
// is stored at slot 0 and exposed via masterCopy(). The NXV singleton (NexVault)
// is a stripped Safe fork that keeps Safe's getOwners()/getThreshold() but drops
// modules, guards and EIP-1271. We read slot 0 directly (= masterCopy()) and
// emit the same $members/$threshold/multisigThreshold values as detectGnosisSafe
// so NXV wallets get modeled as multisigs downstream. There is no module support,
// so GnosisSafe_modules is omitted.
export async function getNxvProxy(
  provider: IProvider,
  address: ChainSpecificAddress,
): Promise<ProxyDetails | undefined> {
  const singleton = await provider.getStorageAsAddress(address, 0)
  if (singleton === ChainSpecificAddress.ZERO(provider.chain)) {
    return undefined
  }

  const owners = await getOwners(provider, address)
  const threshold = await provider.callMethod<number>(
    address,
    'function getThreshold() view returns (uint256)',
    [],
  )
  assert(threshold !== undefined, 'Cannot retrieve NXV threshold')

  const thresholdString = `${threshold} of ${owners.length} (${(
    (threshold / owners.length) * 100
  ).toFixed()}%)`

  return {
    type: 'NXV proxy',
    values: {
      $immutable: false,
      $implementation: singleton.toString(),
      multisigThreshold: thresholdString,
      $threshold: Number(threshold),
      $members: owners.map((o) => o.toString()),
    },
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
  assert(owners !== undefined, 'Cannot retrieve NXV owners')
  return owners.map((o) => ChainSpecificAddress.fromLong(provider.chain, o))
}
