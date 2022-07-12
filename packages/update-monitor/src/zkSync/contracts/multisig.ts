import { providers } from 'ethers'

import { ZkSyncMultisig__factory } from '../../typechain'
import { ContractParameters } from '../../types'
import { addresses } from '../constants'

export async function getMultisig(
  provider: providers.JsonRpcProvider,
): Promise<ContractParameters> {
  const multisig = ZkSyncMultisig__factory.connect(addresses.multisig, provider)

  return {
    name: 'Multisig',
    address: multisig.address,
    upgradeability: {
      type: 'gnosis safe',
    },
    values: [
      {
        name: 'owners',
        value: await multisig.getOwners(),
      },
      {
        name: 'threshold',
        value: (await multisig.getThreshold()).toNumber(),
      },
    ],
  }
}
