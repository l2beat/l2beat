import { ChainId } from '@l2beat/shared-pure'
import { immutablex } from '../../../../layer2s/immutablex'
import {
  DaAccessibilityRisk,
  DaAttestationSecurityRisk,
  DaExitWindowRisk,
} from '../../types'
import { DaBridge } from '../../types/DaBridge'
import { toUsedInProject } from '../../utils/to-used-in-project'
import { ProjectDiscovery } from '../../../../../discovery/ProjectDiscovery'
import { getCommittee } from '../../../../../discovery/starkware'

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
  technology:
    '## Simple Committee',
  permissions: [],
  chain: ChainId.ETHEREUM,
  requiredMembers: committee.minSigners,
  totalMembers: committee.accounts.length,
  usedIn: toUsedInProject([immutablex]),
  risks: {
    attestations: DaAttestationSecurityRisk.NotVerified,
    accessibility: DaAccessibilityRisk.NotEnshrined,
    exitWindow: DaExitWindowRisk.LowOrNoDelay(),
  },
} satisfies DaBridge
