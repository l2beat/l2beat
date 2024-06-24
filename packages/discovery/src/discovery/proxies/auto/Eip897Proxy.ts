import { ProxyDetails } from '@l2beat/discovery-types'
import { EthereumAddress } from '@l2beat/shared-pure'
import { BigNumber } from 'ethers'

import { IProvider } from '../../provider/IProvider'

async function getProxyType(
  provider: IProvider,
  address: EthereumAddress,
): Promise<1 | 2 | undefined> {
  const type = await provider.callMethod<BigNumber>(
    address,
    'function proxyType() public pure returns (uint256 proxyTypeId)',
    [],
  )
  if (type?.eq(1)) {
    return 1
  } else if (type?.eq(2)) {
    return 2
  }
}

function getImplementation(
  provider: IProvider,
  address: EthereumAddress,
): Promise<EthereumAddress | undefined> {
  return provider.callMethod<EthereumAddress>(
    address,
    'function implementation() public view returns (address codeAddr)',
    [],
  )
}

export async function detectEip897Proxy(
  provider: IProvider,
  address: EthereumAddress,
): Promise<ProxyDetails | undefined> {
  const type = await getProxyType(provider, address)
  if (!type) {
    return
  }
  const implementation = await getImplementation(provider, address)
  if (!implementation) {
    return
  }
  return {
    implementations: [implementation],
    relatives: [],
    upgradeability: {
      type: 'EIP897 proxy',
      isUpgradable: type === 2,
      implementation,
    },
  }
}
