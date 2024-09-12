import { ChainId } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../../../discovery/ProjectDiscovery'
import { nova } from '../../../layer2s/nova'
import { DAC } from '../templates/dac-template'
import { DacTransactionDataType } from '../types/DacTransactionDataType'

const discovery = new ProjectDiscovery('nova')

const dac = discovery.getContractValue<{
  membersCount: number
  requiredSignatures: number
}>('SequencerInbox', 'dacKeyset')
const { membersCount, requiredSignatures } = dac

export const arbitrumNovaDac = DAC({
  project: nova,
  bridge: {
    chain: ChainId.ETHEREUM,
    requiredMembers: requiredSignatures,
    totalMembers: membersCount,
    transactionDataType: DacTransactionDataType.TransactionDataCompressed,
    members: {
      type: 'public',
      list: [
        {
          name: 'ConsenSys Software Inc.',
          href: 'https://docs.arbitrum.foundation/state-of-progressive-decentralization#data-availability-committee-members',
        },
        {
          name: 'QuickNode, Inc.',
          href: 'https://docs.arbitrum.foundation/state-of-progressive-decentralization#data-availability-committee-members',
        },
        {
          name: 'P2P.org',
          href: 'https://docs.arbitrum.foundation/state-of-progressive-decentralization#data-availability-committee-members',
        },
        {
          name: 'Google Cloud',
          href: 'https://docs.arbitrum.foundation/state-of-progressive-decentralization#data-availability-committee-members',
        },
        {
          name: 'Offchain Labs, Inc.',
          href: 'https://docs.arbitrum.foundation/state-of-progressive-decentralization#data-availability-committee-members',
        },
        {
          name: 'Opensea Innovation Labs Private Limited',
          href: 'https://docs.arbitrum.foundation/state-of-progressive-decentralization#data-availability-committee-members',
        },
      ],
    },
    permissions: [
      // Members: DAC uses BLS sigs, not EOAs
      {
        name: 'Sequencers',
        accounts: discovery.getPermissionsByRole('Sequencer'),
        description:
          'Central actors allowed to submit transaction batches to the Sequencer Inbox.',
        chain: discovery.chain,
      },
      ...discovery.getMultisigPermission(
        'BatchPosterManagerMultisig',
        'It can update whether an address is authorized to be a batch poster at the sequencer inbox. The UpgradeExecutor retains the ability to update the batch poster manager (along with any batch posters).',
      ),
    ],
    contracts: {
      addresses: [
        discovery.getContractDetails(
          'SequencerInbox',
          'Main entry point for the Sequencer submitting transaction batches.',
        ),
      ],
      risks: [],
    },
  },
})
