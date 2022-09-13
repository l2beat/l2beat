import { providers } from 'ethers'

import { NovaProxyAdmin__factory } from '../../typechain'
import { ContractParameters } from '../../types'

export async function getProxyAdmin(
  provider: providers.JsonRpcProvider,
  address: string,
  name: string,
): Promise<ContractParameters> {
  const proxyAdmin = NovaProxyAdmin__factory.connect(address, provider)
  return {
    name,
    address: proxyAdmin.address,
    upgradeability: {
      type: 'immutable',
    },
    values: {
      owner: await proxyAdmin.owner(),
    },
  }
}
