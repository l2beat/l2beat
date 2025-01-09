import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../../../discovery/ProjectDiscovery'
import { sxnetwork } from '../../../layer2s/sxnetwork'
import { AnytrustDAC } from '../templates/anytrust-template'
import { DacTransactionDataType } from '../types/DacTransactionDataType'

const discovery = new ProjectDiscovery('sxnetwork', 'ethereum')

const dac = discovery.getContractValue<{
  membersCount: number
  requiredSignatures: number
}>('SequencerInbox', 'dacKeyset')
const { membersCount, requiredSignatures } = dac

export const sxnetworkDac = AnytrustDAC({
  project: sxnetwork,
  bridge: {
    createdAt: new UnixTime(1723211933), // 2024-08-09T13:58:53Z
    contracts: {
      addresses: {
        ethereum: [
          discovery.getContractDetails(
            'SequencerInbox',
            'The DA bridge and entry point for the Sequencer submitting transaction batches.',
          ),
        ],
      },
      risks: [],
    },
    permissions: {
      ethereum: [
        // Members: DAC uses BLS sigs, not EOAs
        {
          name: 'Sequencers',
          accounts: discovery.getPermissionsByRole('sequence'),
          description:
            'Central actors allowed to relay transaction batches to the DA bridge (Sequencer Inbox).',
          chain: discovery.chain,
        },
        {
          name: 'RollupOwner',
          accounts: discovery.getAccessControlRolePermission(
            'UpgradeExecutor',
            'EXECUTOR_ROLE',
          ),
          description:
            'Can upgrade the DA bridge, committee members, and authorized batch posters (relayers) via the UpgradeExecutor contract.',
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
            'The UpgradeExecutor can update the DA bridge and change the committee members by updating the valid keyset.',
        },
      ],
    },
    requiredMembers: requiredSignatures,
    membersCount: membersCount,
    transactionDataType: DacTransactionDataType.TransactionDataCompressed,
  },
})
