import { providers } from 'ethers'

import { DiscoveryEngine } from '../../discovery/DiscoveryEngine'
import { ProjectParameters } from '../../types'
import { verify } from '../../verify/verify'
import { addresses } from './constants'
import { getExchangeV3 } from './contracts/getExchangeV3'
import { getLoopringDepositContract } from './contracts/getLoopringDepositContract'
import { getLoopringIOExchangeOwner } from './contracts/getLoopringIOExchangeOwner'

export const LOOPRING_NAME = 'loopring'

export async function getLoopringParameters(
  provider: providers.JsonRpcProvider,
): Promise<ProjectParameters> {
  const parameters = {
    name: LOOPRING_NAME,
    contracts: await Promise.all([
      getLoopringIOExchangeOwner(provider),
      getExchangeV3(provider),
      getLoopringDepositContract(provider),
    ]),
  }
  verify(parameters, [
    ['LoopringIOExchangeOwner.target', 'ExchangeV3'],
    ['ExchangeV3.depositContract', 'DefaultDepositContract'],
    ['DefaultDepositContract.exchange', 'ExchangeV3'],
  ])
  return parameters
}

export async function discoverLoopring(discoveryEngine: DiscoveryEngine) {
  await discoveryEngine.discover(LOOPRING_NAME, [addresses.loopringDeposit], {
    skipMethods: {
      '0x0BABA1Ad5bE3a5C0a66E7ac838a129Bf948f1eA4': ['getBlockInfo'],
    },
  })
}
