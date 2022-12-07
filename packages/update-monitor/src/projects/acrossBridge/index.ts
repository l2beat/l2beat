import { providers } from 'ethers'

import { GnosisSafe } from '../../common/proxies/GnosisSafe'
import { DiscoveryEngine } from '../../discovery/DiscoveryEngine'
import { ProjectParameters } from '../../types'
import { addresses } from './constants'
import { getFinder } from './contracts/finder'
import { getGovernor } from './contracts/governor'
import { getHubPool } from './contracts/hubPool'
import { getProposer } from './contracts/proposer'
import { getVotingToken } from './contracts/votingToken'

export const ACROSS_BRIDGE_NAME = 'acrossBridge'

export async function getAcrossBridgeParameters(
  provider: providers.JsonRpcProvider,
): Promise<ProjectParameters> {
  const parameters: ProjectParameters = {
    name: ACROSS_BRIDGE_NAME,
    contracts: await Promise.all([
      getHubPool(provider),
      GnosisSafe.getContract(provider, addresses.multisig, 'Multisig'),
      getFinder(provider),
      getGovernor(provider),
      getProposer(provider),
      getVotingToken(provider),
    ]),
  }
  return parameters
}

export async function discoverAcrossBridge(discoveryEngine: DiscoveryEngine) {
  await discoveryEngine.discover(
    ACROSS_BRIDGE_NAME,
    ['0xc186fA914353c44b2E33eBE05f21846F1048bEda'],
    {
      skipMethods: {
        '0xc186fA914353c44b2E33eBE05f21846F1048bEda': ['crossChainContracts'],
        '0x592349F7DeDB2b75f9d4F194d4b7C16D82E507Dc': [
          'proposals',
          'getProposal',
        ],
        '0x226726Ac52e6e948D1B7eA9168F9Ff2E27DbcbB5': ['bondedProposals'],
      },
    },
  )
}
