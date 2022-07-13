import { providers } from 'ethers'

import { GnosisSafe__factory } from '../typechain'
import { ContractParameters } from '../types'

export async function getGnosisSafe(
  provider: providers.JsonRpcProvider,
  address: string,
  name: string,
): Promise<ContractParameters> {
  const GnosisSafe = GnosisSafe__factory.connect(address, provider)

  return {
    name,
    address: GnosisSafe.address,
    upgradeability: {
      type: 'gnosis safe',
    },
    values: {
      owners: await GnosisSafe.getOwners(),
      threshold: (await GnosisSafe.getThreshold()).toNumber(),
    },
  }
}
