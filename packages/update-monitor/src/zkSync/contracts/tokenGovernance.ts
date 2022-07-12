import { providers } from 'ethers'

import { ZkSyncTokenGovernance__factory } from '../../typechain'
import { ContractParameters } from '../../types'
import { addresses } from '../constants'

export async function getTokenGovernance(
  provider: providers.JsonRpcProvider,
): Promise<ContractParameters> {
  const tokenGovernance = ZkSyncTokenGovernance__factory.connect(
    addresses.tokenGovernance,
    provider,
  )

  return {
    name: 'TokenGovernance',
    address: tokenGovernance.address,
    upgradeability: {
      type: 'immutable',
    },
    values: {
      treasury: await tokenGovernance.treasury(),
    },
  }
}
