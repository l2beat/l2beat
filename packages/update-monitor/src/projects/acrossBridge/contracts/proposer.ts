import { providers } from 'ethers'

import { Proposer__factory } from '../../../typechain'
import { ContractParameters } from '../../../types'
import { addresses } from '../constants'

export async function getProposer(
  provider: providers.JsonRpcProvider,
): Promise<ContractParameters> {
  const contract = Proposer__factory.connect(addresses.proposer, provider)

  return {
    name: 'Proposer',
    address: addresses.proposer,
    upgradeability: {
      type: 'immutable',
    },
    values: {
      bond: (await contract.bond()).toString(),
      finder: await contract.finder(),
      governor: await contract.governor(),
      owner: await contract.owner(),
      timerAddress: await contract.timerAddress(),
      token: await contract.token(),
    },
  }
}
