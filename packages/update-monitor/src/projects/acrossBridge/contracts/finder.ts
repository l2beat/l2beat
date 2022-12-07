import { providers } from 'ethers'

import { Finder__factory } from '../../../typechain'
import { ContractParameters } from '../../../types'
import { addresses } from '../constants'

export async function getFinder(
  provider: providers.JsonRpcProvider,
): Promise<ContractParameters> {
  const contract = Finder__factory.connect(addresses.finder, provider)

  return {
    name: 'Finder',
    address: addresses.finder,
    upgradeability: {
      type: 'immutable',
    },
    values: {
      owner: await contract.owner(),
    },
  }
}
