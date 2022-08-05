import { providers } from 'ethers'

import { ContractParameters } from '../types'
import { getEip1967Admin, getEip1967Implementation } from './eip1967'

export async function getSimpleEip1967Proxy(
  provider: providers.JsonRpcProvider,
  address: string,
  name: string,
): Promise<ContractParameters> {
  return {
    name,
    address,
    upgradeability: {
      type: 'proxy',
      implementation: await getEip1967Implementation(provider, address),
    },
    values: {
      admin: await getEip1967Admin(provider, address),
    },
  }
}
