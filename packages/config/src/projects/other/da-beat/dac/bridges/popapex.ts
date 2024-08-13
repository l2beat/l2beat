import { ChainId } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../../../../discovery/ProjectDiscovery'
import { popapex } from '../../../../layer3s/popapex'
import {
  DaAccessibilityRisk,
  DaAttestationSecurityRisk,
  DaExitWindowRisk,
} from '../../types'
import { DaBridge } from '../../types/DaBridge'
import { DacTransactionDataType } from '../../types/DacTransactionDataType'
import { toUsedInProject } from '../../utils/to-used-in-project'

const discovery = new ProjectDiscovery('popapex', 'arbitrum')

const DAC = discovery.getContractValue<{
  membersCount: number
  requiredSignatures: number
}>('SequencerInbox', 'dacKeyset')
const { membersCount, requiredSignatures } = DAC

export const popapexDac = {
  id: 'popapex-dac-bridge',
  type: 'DAC',
  display: {
    name: 'Proof of Play DAC',
    slug: 'dac',
    description: 'Proof of Play DAC on Ethereum.',
    links: {
      websites: ['https://proofofplay.gg'],
      apps: [
        'https://bridge.arbitrum.io/?destinationChain=pop-apex&sourceChain=arbitrum-one',
        'https://piratenation.game/',
      ],
      documentation: [],
      explorers: ['https://explorer.apex.proofofplay.com'],
      repositories: ['https://github.com/proofofplay'],
      socialMedia: [
        'https://twitter.com/ProofOfPlay/',
        'https://discord.com/invite/piratenation',
        'https://piratenation.medium.com/',
      ],
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
  usedIn: toUsedInProject([popapex]),
  risks: {
    attestations: DaAttestationSecurityRisk.NotVerified,
    accessibility: DaAccessibilityRisk.NotEnshrined,
    exitWindow: DaExitWindowRisk.Immutable,
  },
} satisfies DaBridge
