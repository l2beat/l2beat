import { providers } from 'ethers'

import { getCallResultWithRevert } from '../../../common/getCallResult'
import { BondManager__factory } from '../../../typechain'
import { ContractParameters } from '../../../types'
import { addresses } from '../constants'

export async function getBondManager(
  provider: providers.JsonRpcProvider,
): Promise<ContractParameters> {
  const bondManager = BondManager__factory.connect(
    addresses.stateCommitmentChain,
    provider,
  )

  const addressManager: string = await bondManager.libAddressManager()

  const proposerAddress: string = await getCallResultWithRevert<string>(
    provider,
    addressManager,
    'function getAddress(string implementationName) view returns(address)',
    ['OVM_Proposer'],
  )

  return {
    name: 'BondManager',
    address: bondManager.address,
    upgradeability: { type: 'immutable' },
    values: {
      libAddressManager: addressManager,
      proposer: proposerAddress,
    },
  }
}
