import { ChainId, EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../../discovery/ProjectDiscovery'
import { gpt } from '../../layer2s/gpt'
import { PolygoncdkDAC } from '../templates/polygoncdk-template'
import { DacTransactionDataType } from '../types/DacTransactionDataType'

const discovery = new ProjectDiscovery('gpt')

const upgradeability = {
  upgradableBy: ['DACProxyAdminOwner'],
  upgradeDelay: 'None',
}

const bridgeUpgradeability = {
  upgradableBy: ['RollupManager'],
  upgradeDelay: 'No delay',
}

const membersCountDAC = discovery.getContractValue<number>(
  'GptProtocolDAC',
  'getAmountOfMembers',
)

const requiredSignaturesDAC = discovery.getContractValue<number>(
  'GptProtocolDAC',
  'requiredAmountOfSignatures',
)

const members = discovery.getContractValue<string[]>(
  'GptProtocolDAC',
  'members',
)

export const gptProtocolDac = PolygoncdkDAC({
  project: gpt,
  bridge: {
    createdAt: new UnixTime(1723211933), // 2024-08-09T13:58:53Z
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
              discovery.getContractValue('GptProtocolValidium', 'admin'),
            ),
          ],
          description:
            'Admin and ForceBatcher of the GptProtocolValidium contract, can set core system parameters like replacing the sequencer (relayer), activate forced transactions, and set the DA committee members in the GptProtocolDAC contract.',
        },
        {
          name: 'RollupManager',
          accounts: [
            discovery.formatPermissionedAccount(
              discovery.getContractValue(
                'GptProtocolValidium',
                'rollupManager',
              ),
            ),
          ],
          description:
            'The RollupManager can upgrade the DA bridge contract implementation.',
        },
        {
          name: 'DACProxyAdminOwner',
          accounts: [
            discovery.formatPermissionedAccount(
              discovery.getContractValue('DACProxyAdmin', 'owner'),
            ),
          ],
          description:
            "Owner of the GptProtocolDAC's ProxyAdmin. Can upgrade the DAC members.",
        },
      ],
    },
    chain: ChainId.ETHEREUM,
    requiredMembers: requiredSignaturesDAC,
    membersCount: membersCountDAC,
    transactionDataType: DacTransactionDataType.TransactionData,
    contracts: {
      addresses: {
        ethereum: [
          discovery.getContractDetails('GptProtocolValidium', {
            description: `The DA bridge and main contract of the WirexPayChain zkEVM. Contains sequenced transaction batch hashes and signature verification logic for the signed data hash commitment.`,
            ...bridgeUpgradeability,
          }),
          discovery.getContractDetails('GptProtocolDAC', {
            description:
              'Validium committee contract that allows the admin to setup the members of the committee and stores the required amount of signatures threshold.',
            ...upgradeability,
          }),
        ],
      },
      risks: [],
    },
  },
})
