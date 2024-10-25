import { ChainId, EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../../../discovery/ProjectDiscovery'
import { hychain } from '../../../layer2s/hychain'
import { AnytrustDAC } from '../templates/anytrust-template'
import { DacTransactionDataType } from '../types/DacTransactionDataType'

const discovery = new ProjectDiscovery('hychain')

const dac = discovery.getContractValue<{
  membersCount: number
  requiredSignatures: number
}>('SequencerInbox', 'dacKeyset')
const { membersCount, requiredSignatures } = dac

export const hychainDac = AnytrustDAC({
  project: hychain,
  links: {
    websites: ['https://hychain.com'],
    apps: ['https://bridge.hychain.com'],
    documentation: ['https://docs.hychain.com'],
    explorers: ['https://explorer.hychain.com'],
    repositories: ['https://github.com/kintoxyz'],
    socialMedia: [
      'https://x.com/HYCHAIN_GAMES',
      'https://discord.gg/hytopiagg',
      'https://hychain.substack.com/',
    ],
  },
  bridge: {
    createdAt: new UnixTime(1723211933), // 2024-08-09T13:58:53Z
    contracts: {
      addresses: [
        discovery.getContractDetails(
          'SequencerInbox',
          'Main entry point for the Sequencer submitting transaction batches.',
        ),
      ],
      risks: [],
    },

    permissions: [
      // Members: DAC uses BLS sigs, not EOAs
      {
        name: 'Sequencers',
        accounts: discovery.getPermissionsByRole('sequence'),
        description:
          'Central actors allowed to submit transaction batches to the DA bridge (Sequencer Inbox.',
        chain: discovery.chain,
      },
      {
        name: 'RollupOwner',
        accounts: discovery.getAccessControlRolePermission(
          'UpgradeExecutor',
          'EXECUTOR_ROLE',
        ),
        description:
          'Multisig that can upgrade authorized batch posters (relayers) via the UpgradeExecutor contract.',
      },
      {
        name: 'UpgradeExecutor',
        accounts: [
          {
            address: EthereumAddress(
              discovery.getContractValue<string>('RollupProxy', 'owner'),
            ),
            type: 'Contract',
          },
        ],
        description:
          'The UpgradeExecutor can change the Committee members by updating the valid keyset.',
      },
      ...discovery.getMultisigPermission(
        'HychainMultisig',
        `Multisig that can upgrade the DA bridge and other rollup's smart contracts (via UpgradeExecutor).`,
      ),
    ],
    chain: ChainId.ETHEREUM,
    requiredMembers: requiredSignatures,
    membersCount: membersCount,
    transactionDataType: DacTransactionDataType.TransactionDataCompressed,
  },
})
