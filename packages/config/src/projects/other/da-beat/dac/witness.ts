import { ChainId, EthereumAddress } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../../../discovery/ProjectDiscovery'
import { witness } from '../../../layer2s/witness'
import { PolygoncdkDAC } from '../templates/polygoncdk-template'
import { DacTransactionDataType } from '../types/DacTransactionDataType'

const discovery = new ProjectDiscovery('witness')

const upgradeability = {
  upgradableBy: ['DACProxyAdminOwner'],
  upgradeDelay: 'No delay',
}

const membersCountDAC = discovery.getContractValue<number>(
  'WitnessValidiumDAC',
  'getAmountOfMembers',
)

const requiredSignaturesDAC = discovery.getContractValue<number>(
  'WitnessValidiumDAC',
  'requiredAmountOfSignatures',
)

const members = discovery.getContractValue<string[]>(
  'WitnessValidiumDAC',
  'members',
)

export const witnessDac = PolygoncdkDAC({
  project: witness,
  bridge: {
    contracts: {
      addresses: [
        discovery.getContractDetails('WitnessValidium', {
          description: `The main contract of the WitnessValidium. Contains sequenced transaction batch hashes and signature verification logic for the signed data hash commitment.`,
        }),
        discovery.getContractDetails('WitnessValidiumDAC', {
          description:
            'Validium committee contract that allows the admin to setup the members of the committee and stores the required amount of signatures threshold.',
          ...upgradeability,
        }),
      ],
      risks: [],
    },
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
            discovery.getContractValue('WitnessValidium', 'admin'),
          ),
        ],
        description:
          'Admin of the WitnessValidium contract, can set core system parameters like timeouts, sequencer, activate forced transactions and update the DA mode.',
      },
      {
        name: 'DACProxyAdminOwner',
        accounts: [
          discovery.formatPermissionedAccount(
            discovery.getContractValue('ProxyAdmin', 'owner'),
          ),
        ],
        description:
          "Owner of the WitnessValidiumDAC's ProxyAdmin. Can upgrade the contract.",
      },
    ],
    chain: ChainId.ETHEREUM,
    requiredMembers: requiredSignaturesDAC,
    membersCount: membersCountDAC,
    transactionDataType: DacTransactionDataType.TransactionData,
  },
})
