import { EthereumAddress, ProxyDetails } from '@l2beat/shared-pure'

import { DiscoveryProvider } from '../../provider/DiscoveryProvider'
import { getCallResult } from '../../utils/getCallResult'
import { detectEip1967Proxy } from '../auto/Eip1967Proxy'

export async function getZkSpaceProxy(
  provider: DiscoveryProvider,
  address: EthereumAddress,
  blockNumber: number,
): Promise<ProxyDetails | undefined> {
  const detection = await detectEip1967Proxy(provider, address, blockNumber)
  if (!detection || detection.upgradeability.type !== 'EIP1967 proxy') {
    return undefined
  }

  const zkSea = await getCallResult<string>(
    provider,
    address,
    'function zkSeaAddress() view returns (address)',
    [],
    blockNumber,
  )

  const zkSyncCommitBlock = await getCallResult<string>(
    provider,
    address,
    'function zkSyncCommitBlockAddress() view returns (address)',
    [],
    blockNumber,
  )

  const zkSyncExit = await getCallResult<string>(
    provider,
    address,
    'function zkSyncExitAddress() view returns (address)',
    [],
    blockNumber,
  )

  const additional = [zkSea, zkSyncCommitBlock, zkSyncExit]

  if (additional.some((a) => a === undefined)) {
    throw new Error('zkSpace proxy: missing additional addresses')
  }

  const implementations = (additional as string[]).map((a) =>
    EthereumAddress(a),
  )

  return {
    implementations: [...detection.implementations, ...implementations],
    relatives: [detection.upgradeability.admin],
    upgradeability: {
      type: 'zkSpace proxy',
      admin: detection.upgradeability.admin,
      implementation: detection.upgradeability.implementation,
      additional: implementations,
    },
  }
}
