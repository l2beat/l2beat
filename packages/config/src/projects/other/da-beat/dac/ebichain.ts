import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../../../discovery/ProjectDiscovery'
import { ebichain } from '../../../layer2s/ebichain'
import { AnytrustDAC } from '../templates/anytrust-template'
import { DacTransactionDataType } from '../types/DacTransactionDataType'

const discovery = new ProjectDiscovery('ebichain')

const { membersCount, requiredSignatures } = discovery.getContractValue<{
  membersCount: number
  requiredSignatures: number
}>('SequencerInbox', 'dacKeyset')

export const ebichainDac = AnytrustDAC({
  project: ebichain,
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
      base: [
        // Members: DAC uses BLS sigs, not EOAs
        {
          name: 'Sequencers',
          accounts: discovery.getPermissionsByRole('sequence'),
          description:
            'Central actors allowed to relay transaction batches to the DA bridge (Sequencer Inbox).',
          chain: discovery.chain,
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
            'The contract used to manage the upgrade of the DA bridge and other contracts.',
        },
        ...discovery.getMultisigPermission(
          'ConduitMultisig',
          `Multisig that can upgrade the DA bridge, upgrade authorized batch posters (relayers), and change the Committee members by updating the valid keyset (via UpgradeExecutor).`,
        ),
      ],
    },
    requiredMembers: requiredSignatures,
    membersCount: membersCount,
    transactionDataType: DacTransactionDataType.TransactionDataCompressed,
  },
})
