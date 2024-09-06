import { ChainId } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../../../discovery/ProjectDiscovery'
import { sanko } from '../../../layer3s/sanko'
import { DAC } from '../templates/dac-template'
import { DacTransactionDataType } from '../types/DacTransactionDataType'

const discovery = new ProjectDiscovery('sanko', 'arbitrum')

const dac = discovery.getContractValue<{
  membersCount: number
  requiredSignatures: number
}>('SequencerInbox', 'dacKeyset')
const { membersCount, requiredSignatures } = dac

export const sankoDac = DAC({
  project: sanko,
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
      // BLS sigs, not EOAs
    ],
    chain: ChainId.ETHEREUM,
    requiredMembers: requiredSignatures,
    totalMembers: membersCount,
    transactionDataType: DacTransactionDataType.TransactionDataCompressed,
    members: {
      type: 'unknown',
    },
  },
})
