import { ChainId } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../../../../discovery/ProjectDiscovery'
import { reya } from '../../../../layer2s/reya'
import {
  DaAccessibilityRisk,
  DaAttestationSecurityRisk,
  DaExitWindowRisk,
} from '../../types'
import { DaBridge } from '../../types/DaBridge'
import { DacTransactionDataType } from '../../types/DacTransactionDataType'
import { toUsedInProject } from '../../utils/to-used-in-project'

const discovery = new ProjectDiscovery('reya')

const DAC = discovery.getContractValue<{
  membersCount: number
  requiredSignatures: number
}>('SequencerInbox', 'dacKeyset')
const { membersCount, requiredSignatures } = DAC

export const reyaDac = {
  id: 'reya-dac-bridge',
  type: 'DAC',
  display: {
    name: 'Reya DAC',
    slug: 'dac',
    description: 'Reya DAC on Ethereum.',
    links: {
      websites: ['https://reya.network/'],
      apps: [
        'https://reya.network/lge',
        'https://bridge.gelato.network/bridge/reya-network',
      ],
      documentation: ['https://docs.reya.network/'],
      explorers: ['https://explorer.reya.network/'],
      repositories: ['https://github.com/Reya-Labs'],
      socialMedia: [
        'https://twitter.com/Reya_xyz',
        'https://discord.gg/reyaxyz',
        'https://medium.com/reya-labs',
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
    // BLS sigs, not EOAs
  ],
  chain: ChainId.ETHEREUM,
  requiredMembers: requiredSignatures,
  totalMembers: membersCount,
  transactionDataType: DacTransactionDataType.TransactionDataCompressed,
  members: {
    type: 'unknown',
  },
  usedIn: toUsedInProject([reya]),
  risks: {
    attestations: DaAttestationSecurityRisk.NotVerified,
    accessibility: DaAccessibilityRisk.NotEnshrined,
    exitWindow: DaExitWindowRisk.Immutable,
  },
} satisfies DaBridge
