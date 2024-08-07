import { ChainId } from '@l2beat/shared-pure'
import { immutablex } from '../../../../layer2s/immutablex'
import {
  DaAccessibilityRisk,
  DaAttestationSecurityRisk,
  DaExitWindowRisk,
} from '../../types'
import { DaBridge } from '../../types/DaBridge'
import { DacTransactionDataType } from '../../types/DacTransactionDataType'
import { toUsedInProject } from '../../utils/to-used-in-project'

/**
 * THIS IS EXAMPLE DATA FOR SKETCH PURPOSES
 */
export const immutableXDac = {
  id: 'immutablex-dac',
  type: 'DAC',
  display: {
    name: 'ImmutableX DAC',
    slug: 'immutablex-dac',
    description: 'ImmutableX DAC on Ethereum.',
    links: {
      websites: ['https://immutablex.xyz/'],
      documentation: ['https://docs.immutablex.xyz/'],
      repositories: ['https://github.com/Immutablex/immutablex'],
      apps: ['https://app.immutable.com/'],
      explorers: ['https://explorer.immutable.com/'],
      socialMedia: ['https://twitter.com/Immutable'],
    },
  },
  contracts: {
    addresses: [],
    risks: [],
  },
  technology:
    'Some note about the technology used by the bridge.\n## Markdown supported',
  permissions: [],
  chain: ChainId.ETHEREUM,
  requiredMembers: 5,
  totalMembers: 7,
  // FIXME
  transactionDataType: DacTransactionDataType.StateDiffs,
  members: {
    type: 'unknown',
  },
  usedIn: toUsedInProject([immutablex]),
  risks: {
    attestations: DaAttestationSecurityRisk.NotVerified,
    accessibility: DaAccessibilityRisk.NotEnshrined,
    exitWindow: DaExitWindowRisk.LowOrNoDelay(),
  },
} satisfies DaBridge
