import { providers } from 'ethers'

import { readArray } from '../../../common/array'
import { VotingToken__factory } from '../../../typechain'
import { ContractParameters } from '../../../types'
import { addresses } from '../constants'

export async function getVotingToken(
  provider: providers.JsonRpcProvider,
): Promise<ContractParameters> {
  const contract = VotingToken__factory.connect(addresses.votingToken, provider)

  return {
    name: 'VotingToken',
    address: addresses.votingToken,
    upgradeability: {
      type: 'immutable',
    },
    values: {
      decimals: await contract.decimals(),
      name: await contract.name(),
      symbol: await contract.symbol(),
      totalSupply: (await contract.totalSupply()).toString(),
      members: await readArray((i) => contract.getMember(i)),
    },
  }
}
