import { providers } from 'ethers'

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

  return {
    name: 'StateCommitmentChain',
    address: stateCommitmentChain.address,
    upgradeability: { type: 'immutable' },
    values: {
      libAddressManager: await stateCommitmentChain.libAddressManager(),
      fraudProofWindow: (
        await stateCommitmentChain.FRAUD_PROOF_WINDOW()
      ).toString(),
      sequencerPublishWindow: (
        await stateCommitmentChain.SEQUENCER_PUBLISH_WINDOW()
      ).toString(),
    },
  }
}
