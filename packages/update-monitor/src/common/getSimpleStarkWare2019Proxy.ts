import { providers } from 'ethers'

import { ContractParameters } from '../types'
import { getStarkWare2019Implementation } from './starkWareProxy'

export async function getSimpleStarkWare2019Proxy(
  provider: providers.JsonRpcProvider,
  address: string,
  name: string,
): Promise<ContractParameters> {
  return {
    name,
    address,
    upgradeability: {
      type: 'proxy',
      implementation: await getStarkWare2019Implementation(provider, address),
    },
    values: {},
  }
}
