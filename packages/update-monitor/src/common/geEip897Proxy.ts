import { providers } from 'ethers'

import { ContractParameters } from '../types'
import { getEip897Implementation } from './eip897'

export async function getEip897Proxy(
  provider: providers.JsonRpcProvider,
  address: string,
  name: string,
): Promise<ContractParameters> {
  return {
    name,
    address,
    upgradeability: {
      type: 'proxy',
      implementation: await getEip897Implementation(provider, address),
    },
    values: {},
  }
}
