import { providers } from 'ethers'

import { Eip1967Proxy } from '../../../common/proxies/Eip1967Proxy'
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
    upgradeability: await Eip1967Proxy.getUpgradeability(provider, zkSeaNFT),
    values: {
      owner: await zkSeaNFT.owner(),
      zkSync: await zkSeaNFT.zksCore(),
    },
  }
}
