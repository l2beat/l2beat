import { providers } from 'ethers'

import { getCallResultWithRevert } from '../../../common/getCallResult'
import { StateCommitmentChain__factory } from '../../../typechain'
import { ContractParameters } from '../../../types'
import { addresses } from '../constants'

export async function getStateCommitmentChain(
  provider: providers.JsonRpcProvider,
): Promise<ContractParameters> {
  const stateCommitmentChain = StateCommitmentChain__factory.connect(
    addresses.stateCommitmentChain,
    provider,
  )

  const addressManager: string = await stateCommitmentChain.libAddressManager()

  const bondManager = await getCallResultWithRevert<string>(
    provider,
    addressManager,
    'function getAddress(string implementationName) view returns(address)',
    ['BondManager'],
  )
  return {
    name: 'StateCommitmentChain',
    address: stateCommitmentChain.address,
    upgradeability: { type: 'immutable' },
    values: {
      libAddressManager: addressManager,
      fraudProofWindow: (
        await stateCommitmentChain.FRAUD_PROOF_WINDOW()
      ).toString(),
      sequencerPublishWindow: (
        await stateCommitmentChain.SEQUENCER_PUBLISH_WINDOW()
      ).toString(),
      bondManager: bondManager,
    },
  }
}
