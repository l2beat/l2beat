import { providers } from 'ethers'

import { ProjectParameters } from '../../types'
import { verify } from '../../verify/verify'
import { getAztecFeeDistributor } from './contracts/getAztecFeeDistributor'
import { getRollupProcessor } from './contracts/getRollupProcessor'
import { getTurboVerifier } from './contracts/getTurboVerifier'

export const AZTEC_NAME = 'aztec'

export async function getAztecParameters(
  provider: providers.JsonRpcProvider,
): Promise<ProjectParameters> {
  const parameters = {
    name: AZTEC_NAME,
    contracts: await Promise.all([
      getRollupProcessor(provider),
      getTurboVerifier(),
      getAztecFeeDistributor(),
    ]),
  }
  verify(parameters, [
    ['RollupProcessor.verifier', 'TurboVerifier'],
    ['RollupProcessor.feeDistributor', 'AztecFeeDistributor'],
  ])

  return parameters
}
