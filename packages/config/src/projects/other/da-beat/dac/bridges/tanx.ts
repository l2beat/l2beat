import { ChainId } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../../../../discovery/ProjectDiscovery'
import { getCommittee } from '../../../../../discovery/starkware'
import { tanx } from '../../../../layer2s/tanx'
import {
  DaAccessibilityRisk,
  DaAttestationSecurityRisk,
  DaExitWindowRisk,
} from '../../types'
import { DaBridge } from '../../types/DaBridge'
import { DacTransactionDataType } from '../../types/DacTransactionDataType'
import { toUsedInProject } from '../../utils/to-used-in-project'

const discovery = new ProjectDiscovery('brine')
const committee = getCommittee(discovery)

export const tanxDac = {
  id: 'tanx-dac-bridge',
  type: 'DAC',
  display: {
    name: 'tanX DAC',
    slug: 'dac',
    description: 'tanX DAC on Ethereum.',
    links: {
      websites: ['https://tanx.fi/'],
      apps: ['https://trade.tanx.fi/'],
      documentation: ['https://docs.tanx.fi/'],
      explorers: [],
      repositories: [],
      socialMedia: [
        'https://twitter.com/tanXfinance',
        'https://discord.gg/wMAnf3gVTh',
        'https://youtube.com/channel/UCUG2L75yvKJBK9QFUaXTdyA',
        'https://linkedin.com/company/tanx-fi',
      ],
    },
  },
  contracts: {
    addresses: [
      discovery.getContractDetails(
        'Committee',
        'Data Availability Committee (DAC) contract verifying data availability claim from DAC Members (via multisig check).',
      ),
    ],
    risks: [],
  },
  technology: `## Simple DA Bridge
    The DA bridge is a smart contract verifying a data availability claim from DAC Members via signature verification.
    The bridge requires a ${committee.minSigners}/${committee.accounts.length} threshold of signatures to be met before the data commitment is accepted.
  `,
  permissions: [
    {
      name: 'Committee Members',
      description: `List of addresses authorized to sign data commitments for the DA bridge.`,
      accounts: committee.accounts.map((operator) => ({
        address: operator.address,
        type: 'EOA',
      })),
    },
  ],
  chain: ChainId.ETHEREUM,
  requiredMembers: committee.minSigners,
  totalMembers: committee.accounts.length,
  transactionDataType: DacTransactionDataType.StateDiffs,
  members: {
    type: 'unknown',
  },
  usedIn: toUsedInProject([tanx]),
  risks: {
    attestations: DaAttestationSecurityRisk.SigVerified(true),
    accessibility: DaAccessibilityRisk.NotEnshrined,
    exitWindow: DaExitWindowRisk.Immutable,
  },
} satisfies DaBridge
