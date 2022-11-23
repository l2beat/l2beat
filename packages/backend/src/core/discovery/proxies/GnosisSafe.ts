import { EthereumAddress } from '@l2beat/types'

import { DiscoveryProvider } from '../provider/DiscoveryProvider'
import { bytes32ToAddress } from '../utils/address'
import { getCallResult } from '../utils/getCallResult'
import { ProxyDetection } from './types'

async function detect(
  provider: DiscoveryProvider,
  address: EthereumAddress,
): Promise<ProxyDetection | undefined> {
  const masterCopy = await getMasterCopy(provider, address)
  if (!masterCopy) {
    return
  }
  return {
    implementations: [masterCopy],
    relatives: [],
    upgradeability: {
      type: 'gnosis safe',
    },
  }
}

async function getMasterCopy(
  provider: DiscoveryProvider,
  address: EthereumAddress,
) {
  const [callResult, slot0] = await Promise.all([
    getCallResult<string>(
      provider,
      address,
      'function masterCopy() view returns(address)',
    ),
    provider.getStorage(address, 0),
  ])
  const slot0Address = bytes32ToAddress(slot0)
  if (callResult && slot0Address === EthereumAddress(callResult)) {
    return slot0Address
  }
}

export const GnosisSafe = {
  getMasterCopy,
  detect,
}
