import { ChainId } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../../../../discovery/ProjectDiscovery'
import { l3x } from '../../../../layer3s/l3x'
import {
  DaAccessibilityRisk,
  DaAttestationSecurityRisk,
  DaExitWindowRisk,
} from '../../types'
import { DaBridge } from '../../types/DaBridge'
import { DacTransactionDataType } from '../../types/DacTransactionDataType'
import { toUsedInProject } from '../../utils/to-used-in-project'

const discovery = new ProjectDiscovery('l3x', 'arbitrum')

const DAC = discovery.getContractValue<{
  membersCount: number
  requiredSignatures: number
}>('SequencerInbox', 'dacKeyset')
const { membersCount, requiredSignatures } = DAC

export const l3xDac = {
  id: 'l3x-dac-bridge',
  type: 'DAC',
  display: {
    name: 'L3X DAC',
    slug: 'dac',
    description: 'L3X DAC on Ethereum.',
    links: {
      websites: ['https://l3x.com/'],
      apps: [
        'https://bridge.arbitrum.io/?destinationChain=l3x-network&sourceChain=arbitrum-one',
      ],
      documentation: ['https://docs.l3x.com/'],
      explorers: ['https://explorer.l3x.com/'],
      repositories: [],
      socialMedia: ['https://t.me/l3x_protocol', 'https://x.com/l3x_protocol'],
    },
  },
  contracts: {
    addresses: [
      discovery.getContractDetails(
        'SequencerInbox',
        'Main entry point for the Sequencer submitting transaction batches.',
      ),
    ],
    risks: [],
  },
  technology: `## Simple DA Bridge
    The DA bridge is a smart contract verifying a data availability claim from DAC Members via signature verification.
    The bridge requires a ${requiredSignatures}/${membersCount} threshold of signatures to be met before the data commitment is accepted.
  `,
  permissions: [
       // Members: DAC uses BLS sigs, not EOAs
       {
        name: 'Sequencers',
        accounts: discovery.getPermissionsByRole('Sequencer'),
        description:
          'Central actors allowed to submit transaction batches to the Sequencer Inbox.',
        chain: discovery.chain,
      },
      {
        name: 'RollupOwner',
        accounts: discovery.getAccessControlRolePermission(
          'UpgradeExecutor',
          'EXECUTOR_ROLE',
        ),
        description:
          'Multisig that can upgrade authorized batch posters via the UpgradeExecutor contract.',
      },
  ],
  chain: ChainId.ETHEREUM,
  requiredMembers: requiredSignatures,
  totalMembers: membersCount,
  transactionDataType: DacTransactionDataType.TransactionDataCompressed,
  members: {
    type: 'unknown',
  },
  usedIn: toUsedInProject([l3x]),
  risks: {
    attestations: DaAttestationSecurityRisk.NotVerified,
    accessibility: DaAccessibilityRisk.NotEnshrined,
    exitWindow: DaExitWindowRisk.Immutable,
  },
} satisfies DaBridge
