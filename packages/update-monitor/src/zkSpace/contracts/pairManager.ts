import { providers } from 'ethers'

import { getEip1967Admin, getEip1967Implementation } from '../../common/eip1967'
import { ZkSpacePairManager__factory } from '../../typechain'
import { ContractParameters } from '../../types'
import { addresses } from '../constants'

export async function getPairManager(
  provider: providers.JsonRpcProvider,
): Promise<ContractParameters> {
  const pairManager = ZkSpacePairManager__factory.connect(
    addresses.pairManager,
    provider,
  )

  return {
    name: 'PairManager',
    address: pairManager.address,
    upgradeability: {
      type: 'proxy',
      implementation: await getEip1967Implementation(provider, pairManager),
    },
    values: [
      {
        name: 'admin',
        value: await getEip1967Admin(provider, pairManager),
      },
    ],
  }
}
