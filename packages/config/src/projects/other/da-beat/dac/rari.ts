import { ChainId } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../../../discovery/ProjectDiscovery'
import { rari } from '../../../layer3s/rari'
import { AnytrustDAC } from '../templates/anytrust-template'
import { DacTransactionDataType } from '../types/DacTransactionDataType'

const discovery = new ProjectDiscovery('rari', 'arbitrum')

const dac = discovery.getContractValue<{
  membersCount: number
  requiredSignatures: number
}>('SequencerInbox', 'dacKeyset')
const { membersCount, requiredSignatures } = dac

export const rariDac = AnytrustDAC({
  project: rari,
  bridge: {
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
    chain: ChainId.ARBITRUM,
    requiredMembers: requiredSignatures,
    membersCount: membersCount,
    transactionDataType: DacTransactionDataType.TransactionDataCompressed,
  },
})
