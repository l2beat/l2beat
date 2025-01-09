import { EthereumAddress, UnixTime, formatSeconds } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../../../discovery/ProjectDiscovery'
import { zkfair } from '../../../layer2s/zkfair'
import { PolygoncdkDAC } from '../templates/polygoncdk-template'
import { DacTransactionDataType } from '../types/DacTransactionDataType'

const discovery = new ProjectDiscovery('zkfair')

const bridgeDelay = discovery.getContractValue<number>(
  'Timelock',
  'getMinDelay',
)

const bridgeUpgradeability = {
  upgradableBy: ['TimelockExecutor'],
  upgradeDelay: `${formatSeconds(bridgeDelay)} delay.`,
}

const membersCountDAC = discovery.getContractValue<number>(
  'ZKFairValidiumDAC',
  'getAmountOfMembers',
)

const requiredSignaturesDAC = discovery.getContractValue<number>(
  'ZKFairValidiumDAC',
  'requiredAmountOfSignatures',
)

const members = discovery.getContractValue<string[]>(
  'ZKFairValidiumDAC',
  'members',
)

export const zkfairDac = PolygoncdkDAC({
  project: zkfair,
  bridge: {
    createdAt: new UnixTime(1723211933), // 2024-08-09T13:58:53Z
    contracts: {
      addresses: {
        ethereum: [
          discovery.getContractDetails('ZKFairValidium', {
            description: `The DA bridge and main contract of ZKFair. Contains sequenced transaction batch hashes and signature verification logic for the signed data hash commitment.`,
            ...bridgeUpgradeability,
          }),
          discovery.getContractDetails('ZKFairValidiumDAC', {
            description:
              'Validium committee contract that allows the admin to setup the members of the committee and stores the required amount of signatures threshold.',
            ...bridgeUpgradeability,
          }),
          discovery.getContractDetails('Timelock', {
            description: `Contract upgrades have to go through a ${formatSeconds(bridgeDelay)} timelock unless the Emergency State is activated. It is controlled by the TimelockExecutor.`,
          }),
        ],
      },
      risks: [],
    },
    permissions: {
      ethereum: [
        {
          name: 'Committee Members',
          description: `List of addresses authorized to sign data commitments for the DA bridge.`,
          accounts: members.map((operator) => ({
            address: EthereumAddress(operator[1]),
            type: 'EOA',
          })),
        },
        ...discovery.getMultisigPermission(
          'ZKFairOwner',
          'Owner of the ZKFairValidium contract, can set core system parameters like replacing the sequencer (relayer), activate forced transactions, update the DA mode and change DAC members by upgrading the ZKFairValidiumDAC contract.',
        ),
        {
          name: 'DAC Owner',
          accounts: [
            discovery.getPermissionedAccount('ZKFairValidiumDAC', 'owner'),
          ],
          description:
            'The owner of the ZKFairValidiumDAC contract, can update the committee member set at any time.',
        },
        {
          name: 'Timelock Executor',
          accounts: discovery.getAccessControlRolePermission(
            'Timelock',
            'EXECUTOR_ROLE',
          ),
          description:
            'Controls the ZKFairValidiumDAC and ZKFairValidium contracts through the Timelock. Can upgrade the DA bridge contract implementation and committee members.',
        },
      ],
    },
    requiredMembers: requiredSignaturesDAC,
    membersCount: membersCountDAC,
    transactionDataType: DacTransactionDataType.StateDiffs,
  },
})
