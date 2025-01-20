import { ChainId, EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../../../discovery/ProjectDiscovery'
import { automata } from '../../../layer2s/automata'
import { DaCommitteeSecurityRisk, DaUpgradeabilityRisk } from '../../types'
import { DaBridge } from '../../types/DaBridge'
import { DaRelayerFailureRisk } from '../../types/DaRelayerFailureRisk'
import { DacTransactionDataType } from '../../types/DacTransactionDataType'
import { toUsedInProject } from '../../utils/to-used-in-project'

const discovery = new ProjectDiscovery('automata')

const sequencerInbox = discovery.getContractValue<string>(
  'SystemConfig',
  'sequencerInbox',
)

export const automataDABridge = {
  id: 'automataDABridge',
  createdAt: new UnixTime(1723022143), // 2024-04-03T10:08:59Z
  type: 'DAC',
  chain: ChainId.ETHEREUM,
  display: {
    name: 'DA Bridge',
    slug: 'da',
    description:
      'There is EOA on Ethereum acting as a DA bridge to receive data availability commitments.',
    links: {
      websites: ['https://ata.network/'],
      apps: ['https://bridge.ata.network/'],
      documentation: ['https://docs.ata.network/'],
      explorers: ['https://explorer.ata.network'],
      repositories: ['https://github.com/automata-network/automata'],
      socialMedia: [
        'https://x.com/AutomataNetwork',
        'https://discord.com/invite/automata',
        'https://blog.ata.network/',
        'https://ata.ws/telegram',
      ],
    },
  },
  contracts: {
    addresses: {
      ethereum: [
        {
          address: EthereumAddress(sequencerInbox),
          name: 'DA Bridge (EOA)',
          description:
            'This DA bridge address is used to store transaction batch hashes as data availability commitments.',
          isVerified: true,
        },
        discovery.getContractDetails('ProxyAdmin', {
          description:
            'The ProxyAdmin contract is the owner of SystemConfig and can change the address of the DA bridge for the system.',
        }),
        discovery.getContractDetails('DataAvailabilityChallenge', {
          description:
            'The DataAvailabilityChallenge contract is used to challenge the data availability of tx data hashes. See the technology section for more details.',
        }),
      ],
    },
    risks: [],
  },
  technology: {
    description: `Only hashes of data batches are posted as DA commitments to an EOA on Ethereum.
      However, there is a mechanism that allows users to challenge unavailability of data. \n`,
  },
  permissions: {
    ethereum: [
      {
        name: 'Sequencer (relayer)',
        accounts: [
          discovery.getPermissionedAccount('SystemConfig', 'batcherHash'),
        ],
        description:
          'Central actor allowed to relay DA commitments to the DA bridge.',
      },
      ...discovery.getMultisigPermission(
        'AutomataMultisig',
        'Owner of the ProxyAdmin and the rollup system. It can change any system component.',
      ),
      {
        name: 'SystemConfig owner',
        description:
          'Account privileged to change System Config parameters such as Sequencer Address and gas limit.',
        accounts: [discovery.getPermissionedAccount('SystemConfig', 'owner')],
      },
      {
        name: 'DataAvailabilityChallenge owner',
        accounts: [
          discovery.getPermissionedAccount(
            'DataAvailabilityChallenge',
            'owner',
          ),
        ],
        description:
          'Owner of the DataAvailabilityChallenge contract. It can upgrade the contract params, potentially making the system insecure.',
      },
    ],
  },
  requiredMembers: 0,
  membersCount: 0,
  hideMembers: true,
  transactionDataType: DacTransactionDataType.TransactionData,
  usedIn: toUsedInProject([automata]),
  risks: {
    committeeSecurity: DaCommitteeSecurityRisk.NoCommitteeSecurity(),
    upgradeability: DaUpgradeabilityRisk.LowOrNoDelay(), // no delay
    relayerFailure: DaRelayerFailureRisk.NoMechanism,
  },
} satisfies DaBridge
