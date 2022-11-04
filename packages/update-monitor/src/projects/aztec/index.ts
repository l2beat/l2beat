import { providers } from 'ethers'

import { ProjectParameters } from '../../types'
import { verify } from '../../verify/verify'
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
    ]),
  }
  verify(parameters, [['RollupProcessor.verifier', 'TurboVerifier']])

  return parameters
}
