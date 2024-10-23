import { ChainId, EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../../../discovery/ProjectDiscovery'
import { astarzkevm } from '../../../layer2s/astarzkevm'
import { PolygoncdkDAC } from '../templates/polygoncdk-template'
import { DacTransactionDataType } from '../types/DacTransactionDataType'

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
  'members',
)

export const astarZkEvmDac = PolygoncdkDAC({
  project: astarzkevm,
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
      ...discovery.getMultisigPermission(
        'LocalAdmin',
        'Admin of the AstarValidiumDAC contract, can set core system parameters like timeouts, sequencer, activate forced transactions, update the DA mode and upgrade the AstarValidiumDAC contract',
      ),
    ],
    chain: ChainId.ETHEREUM,
    requiredMembers: requiredSignaturesDAC,
    membersCount: membersCountDAC,
    transactionDataType: DacTransactionDataType.TransactionData,
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
  },
})
