import { ChainId } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../../../../discovery/ProjectDiscovery'
import { getCommittee } from '../../../../../discovery/starkware'
import { immutablex } from '../../../../layer2s/immutablex'
import {
  DaAccessibilityRisk,
  DaAttestationSecurityRisk,
  DaExitWindowRisk,
} from '../../types'
import { DaBridge } from '../../types/DaBridge'
import { DacTransactionDataType } from '../../types/DacTransactionDataType'
import { toUsedInProject } from '../../utils/to-used-in-project'

const discovery = new ProjectDiscovery('immutablex')
const committee = getCommittee(discovery)

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
  technology: `## Simple Bridge
    The DA bridge is a smart contract verifying a data availability claim from DAC Members via signature verification.
  `,
  permissions: [],
  chain: ChainId.ETHEREUM,
  requiredMembers: committee.minSigners,
  totalMembers: committee.accounts.length,
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
