import { ChainId } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../../../../discovery/ProjectDiscovery'
import { getCommittee } from '../../../../../discovery/starkware'
import { myria } from '../../../../layer2s/myria'
import {
  DaAccessibilityRisk,
  DaAttestationSecurityRisk,
  DaExitWindowRisk,
} from '../../types'
import { DaBridge } from '../../types/DaBridge'
import { DacTransactionDataType } from '../../types/DacTransactionDataType'
import { toUsedInProject } from '../../utils/to-used-in-project'

const discovery = new ProjectDiscovery('myria')
const committee = getCommittee(discovery)

export const myriaDac = {
  id: 'myria-dac-bridge',
  type: 'DAC',
  display: {
    name: 'Myria DAC',
    slug: 'dac',
    description: 'Myria DAC on Ethereum.',
    links: {
      websites: ['https://myria.com/'],
      apps: ['https://market.x.immutable.com/'],
      documentation: ['https://docs.starkware.co/starkex/index.html'],
      explorers: [],
      repositories: ['https://github.com/starkware-libs/starkex-contracts'],
      socialMedia: [
        'https://medium.com/@myriagames',
        'https://twitter.com/myria',
        'https://discord.gg/myria',
        'https://t.me/myriaofficialgroup',
        'https://instagram.com/myriagames',
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
  usedIn: toUsedInProject([myria]),
  risks: {
    attestations: DaAttestationSecurityRisk.SigVerified(true),
    accessibility: DaAccessibilityRisk.NotEnshrined,
    exitWindow: DaExitWindowRisk.Immutable,
  },
} satisfies DaBridge
