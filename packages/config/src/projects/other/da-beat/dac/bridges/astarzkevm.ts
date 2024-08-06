import { ChainId, EthereumAddress } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../../../../discovery/ProjectDiscovery'
import { astarzkevm } from '../../../../layer2s/astarzkevm'
import {
  DaAccessibilityRisk,
  DaAttestationSecurityRisk,
  DaExitWindowRisk,
} from '../../types'
import { DaBridge } from '../../types/DaBridge'
import { DacTransactionDataType } from '../../types/DacTransactionDataType'
import { toUsedInProject } from '../../utils/to-used-in-project'

const discovery = new ProjectDiscovery('astarzkevm')

const upgradeability = {
  upgradableBy: ['LocalAdmin'],
  upgradeDelay: 'None',
}

const membersCountDAC = discovery.getContractValue<number>(
  'AstarValidiumDAC',
  'getAmountOfMembers',
)

const requiredSignaturesDAC = discovery.getContractValue<number>(
  'AstarValidiumDAC',
  'requiredAmountOfSignatures',
)

const members = discovery.getContractValue<string[]>(
  'AstarValidiumDAC',
  'members'
)

export const astarzkEVMDac = {
  id: 'astarzkevm-dac-bridge',
  type: 'DAC',
  display: {
    name: 'Astar zkEVM DAC',
    slug: 'dac',
    description: 'AstarzkEVM DAC on Ethereum.',
    links: {
      websites: ['https://astar.network/astar2'],
      apps: [],
      documentation: ['https://docs.astar.network/docs/build/zkEVM/'],
      explorers: ['https://astar-zkevm.explorer.startale.com/'],
      repositories: [],
      socialMedia: [
        'https://twitter.com/AstarNetwork',
        'https://discord.com/invite/astarnetwork',
        'https://youtube.com/@AstarNetwork',
        'https://t.me/PlasmOfficial',
      ],
    },
  },
  contracts: {
    addresses: [
      discovery.getContractDetails('AstarValidium', {
        description: `The main contract of the Astar zkEVM. Contains sequenced transaction batch hashes and signature verification logic for the signed data hash commitment.`,
      }),
      discovery.getContractDetails('AstarValidiumDAC', {
        description:
          'Validium committee contract that allows the admin to setup the members of the committee and stores the required amount of signatures threshold.',
        ...upgradeability,
      }),
    ],
    risks: [],
  },
  technology: `## Simple DA Bridge
    The DA bridge is a smart contract verifying a data availability claim from DAC Members via signature verification.
    The bridge requires a ${requiredSignaturesDAC}/${membersCountDAC} threshold of signatures to be met before the data commitment is accepted.
  `,
  permissions: [
    {
      name: 'Committee Members',
      description: `List of addresses authorized to sign data commitments for the DA bridge.`,
      accounts: members.map((operator) => (
        {
        address: EthereumAddress(operator[1]),
        type: 'EOA',
      })),
    },
    ...discovery.getMultisigPermission(
      'LocalAdmin',
      'Admin of the AstarValidiumDAC contract, can set core system parameters like timeouts, sequencer, activate forced transactions, update the DA mode and upgrade the AstarValidiumDAC contract',
    ),
  ],
  chain: ChainId.ETHEREUM,
  requiredMembers: requiredSignaturesDAC,
  totalMembers: membersCountDAC,
  transactionDataType: DacTransactionDataType.TransactionData,
  members: {
    type: 'unknown',
  },
  usedIn: toUsedInProject([astarzkevm]),
  risks: {
    attestations: DaAttestationSecurityRisk.SigVerified(true),
    accessibility: DaAccessibilityRisk.NotEnshrined,
    exitWindow: DaExitWindowRisk.Immutable,
  },
} satisfies DaBridge
