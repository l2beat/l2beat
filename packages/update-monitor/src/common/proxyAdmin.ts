import { providers } from 'ethers'

import { ProxyAdmin__factory } from '../typechain'
import { ContractParameters } from '../types'

export async function getProxyAdmin(
  provider: providers.JsonRpcProvider,
  address: string,
  name: string,
): Promise<ContractParameters> {
  const proxyOwner = ProxyAdmin__factory.connect(address, provider)

  return {
    name,
    address,
    upgradeability: {
      type: 'immutable',
    },
    values: {
      owner: await proxyOwner.owner(),
    },
  }
}
