import { ChainId, EthereumAddress } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../../../discovery/ProjectDiscovery'
import { wirex } from '../../../layer2s/wirex'
import { PolygoncdkDAC } from '../templates/polygoncdk-template'
import { DacTransactionDataType } from '../types/DacTransactionDataType'

const discovery = new ProjectDiscovery('wirex')

const upgradeability = {
  upgradableBy: ['LocalAdmin'],
  upgradeDelay: 'None',
}

const membersCountDAC = discovery.getContractValue<number>(
  'WirexPayChainDAC',
  'getAmountOfMembers',
)

const requiredSignaturesDAC = discovery.getContractValue<number>(
  'WirexPayChainDAC',
  'requiredAmountOfSignatures',
)

const members = discovery.getContractValue<string[]>(
  'WirexPayChainDAC',
  'members',
)

export const paychainDac = PolygoncdkDAC({
  project: wirex,
  bridge: {
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
            discovery.getContractValue('WirexPayChainValidium', 'admin'),
          ),
        ],
        description:
          'Admin and ForceBatcher of the WirexPayChainValidium contract, can set core system parameters like timeouts, sequencer, activate forced transactions, and set the DA committee members in the WirexPayChainDAC contract.',
      },
    ],
    chain: ChainId.ETHEREUM,
    requiredMembers: requiredSignaturesDAC,
    membersCount: membersCountDAC,
    transactionDataType: DacTransactionDataType.TransactionData,
    contracts: {
      addresses: [
        discovery.getContractDetails('WirexPayChainValidium', {
          description: `The main contract of the WirexPayChain zkEVM. Contains sequenced transaction batch hashes and signature verification logic for the signed data hash commitment.`,
        }),
        discovery.getContractDetails('WirexPayChainDAC', {
          description:
            'Validium committee contract that allows the admin to setup the members of the committee and stores the required amount of signatures threshold.',
          ...upgradeability,
        }),
      ],
      risks: [],
    },
  },
})
