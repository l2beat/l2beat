import { ChainId } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../../../../discovery/ProjectDiscovery'
import { getCommittee } from '../../../../../discovery/starkware'
import { sorare } from '../../../../layer2s/sorare'
import {
  DaAccessibilityRisk,
  DaAttestationSecurityRisk,
  DaExitWindowRisk,
} from '../../types'
import { DaBridge } from '../../types/DaBridge'
import { DacTransactionDataType } from '../../types/DacTransactionDataType'
import { toUsedInProject } from '../../utils/to-used-in-project'

const discovery = new ProjectDiscovery('sorare')
const committee = getCommittee(discovery)

export const sorareDac = {
  id: 'sorare-dac-bridge',
  type: 'DAC',
  display: {
    name: 'Sorare DAC',
    slug: 'dac',
    description: 'Sorare DAC on Ethereum.',
    links: {
      websites: ['https://sorare.com/'],
      apps: [],
      documentation: ['https://docs.starkware.co/starkex/index.html'],
      explorers: [],
      repositories: ['https://github.com/starkware-libs/starkex-contracts'],
      socialMedia: [
        'https://discord.gg/TSjtHaM',
        'https://reddit.com/r/Sorare/',
        'https://twitter.com/Sorare',
        'https://instagram.com/sorare_official/',
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
  usedIn: toUsedInProject([sorare]),
  risks: {
    attestations: DaAttestationSecurityRisk.SigVerified(true),
    accessibility: DaAccessibilityRisk.NotEnshrined,
    exitWindow: DaExitWindowRisk.Immutable,
  },
} satisfies DaBridge
