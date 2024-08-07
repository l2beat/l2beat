import { ChainId } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../../../../discovery/ProjectDiscovery'
import { playblock } from '../../../../layer3s/playblock'
import {
  DaAccessibilityRisk,
  DaAttestationSecurityRisk,
  DaExitWindowRisk,
} from '../../types'
import { DaBridge } from '../../types/DaBridge'
import { DacTransactionDataType } from '../../types/DacTransactionDataType'
import { toUsedInProject } from '../../utils/to-used-in-project'

const discovery = new ProjectDiscovery('playblock', 'nova')

const DAC = discovery.getContractValue<{
  membersCount: number
  requiredSignatures: number
}>('SequencerInbox', 'dacKeyset')
const { membersCount, requiredSignatures } = DAC

export const playblockDac = {
  id: 'playblock-dac-bridge',
  type: 'DAC',
  display: {
    name: 'Playblock DAC',
    slug: 'dac',
    description: 'Playblock DAC on Ethereum.',
    links: {
      websites: ['https://playnance.com/'],
      apps: [],
      documentation: [],
      explorers: ['https://explorer.playblock.io/'],
      repositories: ['https://github.com/playnance-games/PlayBlock'],
      socialMedia: ['https://twitter.com/Playnancetech'],
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
  usedIn: toUsedInProject([playblock]),
  risks: {
    attestations: DaAttestationSecurityRisk.NotVerified,
    accessibility: DaAccessibilityRisk.NotEnshrined,
    exitWindow: DaExitWindowRisk.Immutable,
  },
} satisfies DaBridge
