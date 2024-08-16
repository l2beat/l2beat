import { ChainId } from '@l2beat/shared-pure'
import {
  DaAccessibilityRisk,
  DaAttestationSecurityRisk,
  DaExitWindowRisk,
} from '../../types'
import { DaBridge } from '../../types/DaBridge'
import { DacTransactionDataType } from '../../types/DacTransactionDataType'
import { toUsedInProject } from '../../utils/to-used-in-project'
import { eigenDA } from '../eigenDA'


export const eigenDAbridge = {
  id: 'eigenda-bridge',
  type: 'DAC',
  display: {
    name: 'EigenDA Bridge',
    slug: 'bridge',
    description: 'EigenDA bridge on Ethereum.',
    links: {
      websites: [],
      documentation: [],
      repositories: [],
      apps: [],
      explorers: [],
      socialMedia: [],
    },
  },
  contracts: {
    addresses: [
    ],
    risks: [],
  },
  technology: `## Simple DA Bridge
    The DA bridge is a smart contract verifying a data availability claim from DAC Members via signature verification.
    The bridge requires a threshold of signatures to be met before the data commitment is accepted.
  `,
  permissions: [
  ],
  chain: ChainId.ETHEREUM,
  requiredMembers: 0,
  totalMembers: 100,
  transactionDataType: DacTransactionDataType.StateDiffs,
  members: {
    type: 'unknown'
  },
  usedIn: toUsedInProject([]),
  risks: {
    attestations: DaAttestationSecurityRisk.SigVerified(true),
    accessibility: DaAccessibilityRisk.NotEnshrined,
    exitWindow: DaExitWindowRisk.LowOrNoDelay(0),
  },
} satisfies DaBridge
