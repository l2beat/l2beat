import { ChainId, EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../../discovery/ProjectDiscovery'
import { xlayer } from '../../layer2s/xlayer'
import { PolygoncdkDAC } from '../templates/polygoncdk-template'
import { DacTransactionDataType } from '../types/DacTransactionDataType'

const discovery = new ProjectDiscovery('xlayer')

const upgradeability = {
  upgradableBy: ['DACProxyAdminOwner'],
  upgradeDelay: 'No delay',
}

const bridgeUpgradeability = {
  upgradableBy: ['RollupManager'],
  upgradeDelay: 'No delay',
}

const membersCountDAC = discovery.getContractValue<number>(
  'XLayerValidiumDAC',
  'getAmountOfMembers',
)

const requiredSignaturesDAC = discovery.getContractValue<number>(
  'XLayerValidiumDAC',
  'requiredAmountOfSignatures',
)

const members = discovery.getContractValue<string[]>(
  'XLayerValidiumDAC',
  'members',
)

export const xlayerDac = PolygoncdkDAC({
  project: xlayer,
  bridge: {
    createdAt: new UnixTime(1723211933), // 2024-08-09T13:58:53Z
    contracts: {
      addresses: {
        ethereum: [
          discovery.getContractDetails('XLayerValidium', {
            description: `The DA bridge and main contract of the XLayerValidium. Contains sequenced transaction batch hashes and signature verification logic for the signed data hash commitment.`,
            ...bridgeUpgradeability,
          }),
          discovery.getContractDetails('XLayerValidiumDAC', {
            description:
              'Validium committee contract that allows the admin to setup the members of the committee and stores the required amount of signatures threshold.',
            ...upgradeability,
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
        {
          name: 'LocalAdmin',
          accounts: [
            discovery.formatPermissionedAccount(
              discovery.getContractValue('XLayerValidium', 'admin'),
            ),
          ],
          description:
            'Admin of the XLayerValidium contract, can set core system parameters like replacing the sequencer (relayer), activate forced transactions and update the DA mode.',
        },
        {
          name: 'RollupManager',
          accounts: [
            discovery.formatPermissionedAccount(
              discovery.getContractValue('XLayerValidium', 'rollupManager'),
            ),
          ],
          description:
            'The RollupManager can upgrade the DA bridge contract implementation.',
        },
        {
          name: 'DACProxyAdminOwner',
          accounts: [
            discovery.formatPermissionedAccount(
              discovery.getContractValue('ProxyAdmin', 'owner'),
            ),
          ],
          description:
            "Owner of the XLayerValidiumDAC's ProxyAdmin. Can upgrade the DAC members.",
        },
      ],
    },
    chain: ChainId.ETHEREUM,
    requiredMembers: requiredSignaturesDAC,
    membersCount: membersCountDAC,
    transactionDataType: DacTransactionDataType.TransactionData,
  },
})
