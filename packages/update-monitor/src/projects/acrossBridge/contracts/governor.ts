import { providers } from 'ethers'

import { readArray } from '../../../common/array'
import { Governor__factory } from '../../../typechain'
import { ContractParameters } from '../../../types'
import { addresses } from '../constants'

export async function getGovernor(
  provider: providers.JsonRpcProvider,
): Promise<ContractParameters> {
  const contract = Governor__factory.connect(addresses.governor, provider)

  return {
    name: 'Governor',
    address: addresses.governor,
    upgradeability: {
      type: 'immutable',
    },
    values: {
      timerAddress: await contract.timerAddress(),
      members: await readArray((i) => contract.getMember(i)),
    },
  }
}
