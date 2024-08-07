import { ChainId } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../../../../discovery/ProjectDiscovery'
import { nova } from '../../../../layer2s/nova'
import {
  DaAccessibilityRisk,
  DaAttestationSecurityRisk,
  DaExitWindowRisk,
} from '../../types'
import { DaBridge } from '../../types/DaBridge'
import { DacTransactionDataType } from '../../types/DacTransactionDataType'
import { toUsedInProject } from '../../utils/to-used-in-project'

const discovery = new ProjectDiscovery('nova')

const DAC = discovery.getContractValue<{
  membersCount: number
  requiredSignatures: number
}>('SequencerInbox', 'dacKeyset')
const { membersCount, requiredSignatures } = DAC

export const arbitrumnovaDac = {
  id: 'arbitrumnova-dac-bridge',
  type: 'DAC',
  display: {
    name: 'Arbitrum Nova DAC',
    slug: 'dac',
    description: 'Arbitrum Nova DAC on Ethereum.',
    links: {
      websites: ['https://arbitrum.io/', 'https://arbitrum.foundation/'],
      apps: ['https://bridge.arbitrum.io'],
      documentation: [
        'https://docs.arbitrum.io',
        'https://docs.arbitrum.foundation/',
      ],
      explorers: [
        'https://arbiscan.io',
        'https://explorer.arbitrum.io/',
        'https://arbitrum.l2scan.co/',
      ],
      repositories: [
        'https://github.com/ArbitrumFoundation/docs',
        'https://github.com/ArbitrumFoundation/governance',
        'https://github.com/OffchainLabs/arbitrum',
        'https://github.com/OffchainLabs/nitro',
        'https://github.com/OffchainLabs/arb-os',
      ],
      socialMedia: [
        'https://twitter.com/arbitrum',
        'https://arbitrumfoundation.medium.com/',
        'https://discord.gg/Arbitrum',
        'https://youtube.com/@Arbitrum',
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
    ...discovery.getMultisigPermission(
      'BatchPosterManagerMultisig',
      'It can update whether an address is authorized to be a batch poster at the sequencer inbox. The UpgradeExecutor retains the ability to update the batch poster manager (along with any batch posters).',
    ),
  ],
  chain: ChainId.ETHEREUM,
  requiredMembers: requiredSignatures,
  totalMembers: membersCount,
  transactionDataType: DacTransactionDataType.TransactionDataCompressed,
  members: {
    type: 'public',
    list: [
      {
        name: 'ConsenSys Software Inc.',
        href: 'https://docs.arbitrum.foundation/state-of-progressive-decentralization#data-availability-committee-members',
      },
      {
        name: 'QuickNode, Inc.',
        href: 'https://docs.arbitrum.foundation/state-of-progressive-decentralization#data-availability-committee-members',
      },
      {
        name: 'P2P.org',
        href: 'https://docs.arbitrum.foundation/state-of-progressive-decentralization#data-availability-committee-members',
      },
      {
        name: 'Google Cloud',
        href: 'https://docs.arbitrum.foundation/state-of-progressive-decentralization#data-availability-committee-members',
      },
      {
        name: 'Offchain Labs, Inc.',
        href: 'https://docs.arbitrum.foundation/state-of-progressive-decentralization#data-availability-committee-members',
      },
      {
        name: 'Opensea Innovation Labs Private Limited',
        href: 'https://docs.arbitrum.foundation/state-of-progressive-decentralization#data-availability-committee-members',
      },
    ],
  },
  usedIn: toUsedInProject([nova]),
  risks: {
    attestations: DaAttestationSecurityRisk.NotVerified,
    accessibility: DaAccessibilityRisk.NotEnshrined,
    exitWindow: DaExitWindowRisk.Immutable,
  },
} satisfies DaBridge
