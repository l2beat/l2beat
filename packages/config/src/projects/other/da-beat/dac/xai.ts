import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
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
            'The contract used to manage the upgrade of the DA bridge and other contracts.',
        },
        ...discovery.getMultisigPermission(
          'XaiMultisig',
          'Multisig that can upgrade the DA bridge, upgrade authorized batch posters (relayers), and change the Committee members by updating the valid keyset (via UpgradeExecutor).',
        ),
      ],
    },
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
