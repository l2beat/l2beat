import { ChainId, EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../../../discovery/ProjectDiscovery'
import { galxegravity } from '../../../layer2s/galxegravity'
import { AnytrustDAC } from '../templates/anytrust-template'
import { DacTransactionDataType } from '../types/DacTransactionDataType'

const discovery = new ProjectDiscovery('galxegravity', 'ethereum')

const dac = discovery.getContractValue<{
  membersCount: number
  requiredSignatures: number
}>('SequencerInbox', 'dacKeyset')
const { membersCount, requiredSignatures } = dac

export const galxegravityDac = AnytrustDAC({
  project: galxegravity,
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
      ethereum: [
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
          'ConduitMultisig',
          "MultiSig that can upgrade the DA bridge and other rollup's smart contracts (via UpgradeExecutor) and gain access to all funds.",
        ),
      ],
    },
    chain: ChainId.ETHEREUM,
    requiredMembers: requiredSignatures,
    membersCount: membersCount,
    transactionDataType: DacTransactionDataType.TransactionDataCompressed,
  },
})
