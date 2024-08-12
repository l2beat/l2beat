import { ChainId } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../../../../discovery/ProjectDiscovery'
import { getCommittee } from '../../../../../discovery/starkware'
import { reddioex } from '../../../../layer2s/reddioex'
import {
  DaAccessibilityRisk,
  DaAttestationSecurityRisk,
  DaExitWindowRisk,
} from '../../types'
import { DaBridge } from '../../types/DaBridge'
import { DacTransactionDataType } from '../../types/DacTransactionDataType'
import { toUsedInProject } from '../../utils/to-used-in-project'

const discovery = new ProjectDiscovery('reddioex')
const committee = getCommittee(discovery)

export const redsonicDac = {
  id: 'redsonic-dac-bridge',
  type: 'DAC',
  display: {
    name: 'Redsonic DAC',
    slug: 'dac',
    description: 'Redsonic DAC on Ethereum.',
    links: {
      websites: ['https://reddio.com/'],
      apps: [
        'https://reddio.com/explore',
        'https://dashboard.reddio.com',
        'https://bridge.reddio.com',
        'https://reddio.com/redSonic',
        'https://points.reddio.com',
      ],
      documentation: ['https://docs.reddio.com/'],
      explorers: ['https://explorer.reddio.com/'],
      repositories: ['https://github.com/reddio-com/starkex-contracts-source'],
      socialMedia: [
        'https://twitter.com/reddio_com',
        'https://facebook.com/reddiocom',
        'https://linkedin.com/company/reddio',
        'https://discord.com/invite/SjNAJ4qkK3',
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
  usedIn: toUsedInProject([reddioex]),
  risks: {
    attestations: DaAttestationSecurityRisk.SigVerified(true),
    accessibility: DaAccessibilityRisk.NotEnshrined,
    exitWindow: DaExitWindowRisk.Immutable,
  },
} satisfies DaBridge
