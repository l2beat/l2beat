import { ChainId, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../../../discovery/ProjectDiscovery'
import { l3x } from '../../../layer3s/l3x'
import { AnytrustDAC } from '../templates/anytrust-template'
import { DacTransactionDataType } from '../types/DacTransactionDataType'

const discovery = new ProjectDiscovery('l3x', 'arbitrum')

const dac = discovery.getContractValue<{
  membersCount: number
  requiredSignatures: number
}>('SequencerInbox', 'dacKeyset')
const { membersCount, requiredSignatures } = dac

export const l3xDac = AnytrustDAC({
  project: l3x,
  bridge: {
    createdAt: new UnixTime(1723211933), // 2024-08-09T13:58:53Z
    contracts: {
      addresses: {
        ethereum: [
          discovery.getContractDetails(
            'SequencerInbox',
            'Main entry point for the Sequencer submitting transaction batches.',
          ),
        ],
      },
      risks: [],
    },

    permissions: {
      arbitrum: [
        // Members: DAC uses BLS sigs, not EOAs
        {
          name: 'Sequencers',
          accounts: discovery.getPermissionsByRole('sequence'),
          description:
            'Central actors allowed to submit transaction batches to the Sequencer Inbox.',
          chain: discovery.chain,
        },
        {
          name: 'RollupOwner',
          accounts: discovery.getAccessControlRolePermission(
            'UpgradeExecutor',
            'EXECUTOR_ROLE',
          ),
          description:
            'Multisig that can upgrade authorized batch posters via the UpgradeExecutor contract.',
        },
      ],
    },
    chain: ChainId.ARBITRUM,
    requiredMembers: requiredSignatures,
    membersCount: membersCount,
    transactionDataType: DacTransactionDataType.TransactionDataCompressed,
  },
})
