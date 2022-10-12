import { providers } from 'ethers'

import { ProxyAdmin__factory } from '../../../typechain'
import { ContractParameters } from '../../../types'
import { addresses } from '../constants'

export async function getProxyAdmin(
  provider: providers.JsonRpcProvider,
): Promise<ContractParameters> {
  const proxyOwner = ProxyAdmin__factory.connect(addresses.proxyAdmin, provider)

  return {
    name: 'ProxyAdmin',
    address: proxyOwner.address,
    upgradeability: {
      type: 'immutable',
    },
    values: {
      owner: await proxyOwner.owner(),
    },
  }
}
