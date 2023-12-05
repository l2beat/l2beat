import { assert } from '@l2beat/backend-tools'
import { ProxyDetails } from '@l2beat/discovery-types'

import { EthereumAddress } from '../../../utils/EthereumAddress'
import { DiscoveryProvider } from '../../provider/DiscoveryProvider'
import { bytes32ToAddress } from '../../utils/address'
import { getCallResult } from '../../utils/getCallResult'
import { getModules } from '../../utils/getSafeModules'

async function getMasterCopy(
  provider: DiscoveryProvider,
  address: EthereumAddress,
  blockNumber: number,
): Promise<EthereumAddress | undefined> {
  const [callResult, slot0] = await Promise.all([
    getCallResult<string>(
      provider,
      address,
      'function masterCopy() view returns(address)',
      [],
      blockNumber,
    ),
    provider.getStorage(address, 0, blockNumber),
  ])
  const slot0Address = bytes32ToAddress(slot0)
  if (callResult && slot0Address === EthereumAddress(callResult)) {
    return slot0Address
  }
}

export async function detectGnosisSafe(
  provider: DiscoveryProvider,
  address: EthereumAddress,
  blockNumber: number,
): Promise<ProxyDetails | undefined> {
  const masterCopy = await getMasterCopy(provider, address, blockNumber)
  if (!masterCopy) {
    return
  }

  const modules = await getModules(provider, address, blockNumber)
  assert(modules, 'Could not find modules for GnosisSafe')

  return {
    implementations: [masterCopy],
    relatives: modules,
    upgradeability: {
      type: 'gnosis safe',
      masterCopy,
      modules,
    },
  }
}
