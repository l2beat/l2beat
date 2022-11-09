import { providers } from 'ethers'

import { RollupProcessor__factory } from '../../../typechain'
import { ContractParameters } from '../../../types'
import { addresses } from '../constants'

export async function getRollupProcessor(
  provider: providers.JsonRpcProvider,
): Promise<ContractParameters> {
  const rollupProcessor = RollupProcessor__factory.connect(
    addresses.rollupProcessor,
    provider,
  )

  return {
    name: 'RollupProcessor',
    address: rollupProcessor.address,
    upgradeability: { type: 'immutable' },
    values: {
      owner: await rollupProcessor.owner(),
      verifier: await rollupProcessor.verifier(),
      feeDistributor: await rollupProcessor.feeDistributor(),
    },
  }
}
