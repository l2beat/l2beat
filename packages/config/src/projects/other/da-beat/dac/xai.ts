import { ChainId } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../../../discovery/ProjectDiscovery'
import { xai } from '../../../layer3s/xai'
import { AnytrustDAC } from '../templates/anytrust-template'
import { DaEconomicSecurityRisk } from '../types'
import { DacTransactionDataType } from '../types/DacTransactionDataType'

const discovery = new ProjectDiscovery('xai', 'arbitrum')

const dac = discovery.getContractValue<{
  membersCount: number
  requiredSignatures: number
}>('SequencerInbox', 'dacKeyset')
const { membersCount, requiredSignatures } = dac

export const xaiDac = AnytrustDAC({
  project: xai,
  risks: { economicSecurity: DaEconomicSecurityRisk.OffChainVerifiable },
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
    knownMembers: [
      {
        external: false,
        name: 'Xai',
        href: 'https://xai-foundation.gitbook.io/xai-network/about-xai/xai-protocol/anytrust-revolutionizing-blockchain-infrastructure/data-availability-servers-das',
      },
      {
        external: true,
        name: 'Ex Populus',
        href: 'https://xai-foundation.gitbook.io/xai-network/about-xai/xai-protocol/anytrust-revolutionizing-blockchain-infrastructure/data-availability-servers-das',
      },
      {
        external: true,
        name: 'Rug Radio',
        href: 'https://xai-foundation.gitbook.io/xai-network/about-xai/xai-protocol/anytrust-revolutionizing-blockchain-infrastructure/data-availability-servers-das',
      },
      {
        external: true,
        name: 'LayerZero',
        href: 'https://xai-foundation.gitbook.io/xai-network/about-xai/xai-protocol/anytrust-revolutionizing-blockchain-infrastructure/data-availability-servers-das',
      },
      {
        external: true,
        name: 'Team Secret',
        href: 'https://xai-foundation.gitbook.io/xai-network/about-xai/xai-protocol/anytrust-revolutionizing-blockchain-infrastructure/data-availability-servers-das',
      },
      {
        external: true,
        name: 'Offchain Labs',
        href: 'https://xai-foundation.gitbook.io/xai-network/about-xai/xai-protocol/anytrust-revolutionizing-blockchain-infrastructure/data-availability-servers-das',
      },
    ],
  },
})
