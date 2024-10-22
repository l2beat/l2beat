import { ChainId, EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../../../discovery/ProjectDiscovery'
import { silicon } from '../../../layer2s/silicon'
import { PolygoncdkDAC } from '../templates/polygoncdk-template'
import { DacTransactionDataType } from '../types/DacTransactionDataType'

const discovery = new ProjectDiscovery('silicon')

const upgradeability = {
  upgradableBy: ['LocalAdmin'],
  upgradeDelay: 'None',
}

const membersCountDAC = discovery.getContractValue<number>(
  'SiliconDAC',
  'getAmountOfMembers',
)

const requiredSignaturesDAC = discovery.getContractValue<number>(
  'SiliconDAC',
  'requiredAmountOfSignatures',
)

const members = discovery.getContractValue<string[]>('SiliconDAC', 'members')

export const siliconDac = PolygoncdkDAC({
  project: silicon,
  bridge: {
    createdAt: new UnixTime(1723211933), // 2024-08-09T13:58:53Z
    permissions: [
      {
        name: 'Committee Members',
        description: `List of addresses authorized to sign data commitments for the DA bridge.`,
        accounts: members.map((operator) => ({
          address: EthereumAddress(operator[1]),
          type: 'EOA',
        })),
      },
      {
        name: 'LocalAdmin',
        accounts: [
          discovery.formatPermissionedAccount(
            discovery.getContractValue('SiliconValidium', 'admin'),
          ),
        ],
        description:
          'Admin and ForceBatcher of the SiliconValidium contract, can set core system parameters like timeouts, sequencer, activate forced transactions, and set the DA committee members in the SiliconDAC contract.',
      },
    ],
    chain: ChainId.ETHEREUM,
    requiredMembers: requiredSignaturesDAC,
    membersCount: membersCountDAC,
    transactionDataType: DacTransactionDataType.TransactionData,
    contracts: {
      addresses: [
        discovery.getContractDetails('SiliconValidium', {
          description: `The main contract of Silicon. Contains sequenced transaction batch hashes and signature verification logic for the signed data hash commitment.`,
        }),
        discovery.getContractDetails('SiliconDAC', {
          description:
            'Validium committee contract that allows the admin to setup the members of the committee and stores the required amount of signatures threshold.',
          ...upgradeability,
        }),
      ],
      risks: [],
    },
  },
})
