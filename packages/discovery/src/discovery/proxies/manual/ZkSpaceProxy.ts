import { ProxyDetails } from '@l2beat/discovery-types'
import { EthereumAddress } from '@l2beat/shared-pure'

import { IProvider } from '../../provider/IProvider'
import { detectEip1967Proxy } from '../auto/Eip1967Proxy'

export async function getZkSpaceProxy(
  provider: IProvider,
  address: EthereumAddress,
): Promise<ProxyDetails | undefined> {
  const detection = await detectEip1967Proxy(provider, address)
  if (!detection || detection.upgradeability.type !== 'EIP1967 proxy') {
    return undefined
  }

  const zkSea = await provider.callMethod<EthereumAddress>(
    address,
    'function zkSeaAddress() view returns (address)',
    [],
  )

  const zkSyncCommitBlock = await provider.callMethod<EthereumAddress>(
    address,
    'function zkSyncCommitBlockAddress() view returns (address)',
    [],
  )

  const zkSyncExit = await provider.callMethod<EthereumAddress>(
    address,
    'function zkSyncExitAddress() view returns (address)',
    [],
  )

  const additional = [zkSea, zkSyncCommitBlock, zkSyncExit]
  if (additional.some((a) => a === undefined)) {
    throw new Error('zkSpace proxy: missing additional addresses')
  }
  const implementations = additional as EthereumAddress[]

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
