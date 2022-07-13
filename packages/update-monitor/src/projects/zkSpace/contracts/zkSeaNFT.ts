import { providers } from 'ethers'

import {
  getEip1967Admin,
  getEip1967Implementation,
} from '../../../common/eip1967'
import { ZkSpaceZkSeaNFT__factory } from '../../../typechain'
import { ContractParameters } from '../../../types'
import { addresses } from '../constants'

export async function getZKSeaNFT(
  provider: providers.JsonRpcProvider,
): Promise<ContractParameters> {
  const zkSeaNFT = ZkSpaceZkSeaNFT__factory.connect(
    addresses.zkSeaNFT,
    provider,
  )

  return {
    name: 'ZKSeaNFT',
    address: zkSeaNFT.address,
    upgradeability: {
      type: 'proxy',
      implementation: await getEip1967Implementation(provider, zkSeaNFT),
    },
    values: {
      admin: await getEip1967Admin(provider, zkSeaNFT),
      owner: await zkSeaNFT.owner(),
      zkSync: await zkSeaNFT.zksCore(),
    },
  }
}
