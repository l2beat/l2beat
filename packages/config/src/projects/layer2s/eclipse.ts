import {
  EthereumAddress,
  ProjectId,
  UnixTime,
  formatSeconds,
} from '@l2beat/shared-pure'
import {
  CONTRACTS,
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  addSentimentToDataAvailability,
} from '../../common'
import { RISK_VIEW } from '../../common'
import { REASON_FOR_BEING_OTHER } from '../../common/ReasonForBeingInOther'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('eclipse')

const withdrawalDelaySeconds = discovery.getContractValue<number>(
  'CanonicalBridge',
  'fraudWindowDuration',
)

export const eclipse: Layer2 = {
  type: 'layer2',
  id: ProjectId('eclipse'),
  createdAt: new UnixTime(1725359142), // 2024-09-03T10:25:42Z
  badges: [Badge.VM.SolanaVM, Badge.DA.Celestia],
  display: {
    name: 'Eclipse',
    slug: 'eclipse',
    description:
      'Eclipse is a sidechain powered by the Solana Virtual Machine (SVM).',
    category: 'Other',
    reasonsForBeingOther: [
      REASON_FOR_BEING_OTHER.NO_PROOFS,
      REASON_FOR_BEING_OTHER.NO_DA_ORACLE,
    ],
    purposes: ['Universal'],
    links: {
      websites: ['https://eclipse.xyz/'],
      apps: [],
      documentation: ['https://docs.eclipse.xyz/'],
      explorers: ['https://explorer.eclipse.xyz/'],
      repositories: ['https://github.com/Eclipse-Laboratories-Inc'],
      socialMedia: [
        'https://twitter.com/eclipsefnd',
        'https://discord.gg/eclipse-labs',
        'https://mirror.xyz/eclipsemainnet.eth',
      ],
    },
  },
  stage: {
    stage: 'NotApplicable',
  },
  // rpcUrl: 'https://mainnetbeta-rpc.eclipse.xyz', custom VM, i guess it's different
  config: {
    escrows: [
      {
        chain: 'ethereum',
        address: EthereumAddress('0xd7e4b67e735733ac98a88f13d087d8aac670e644'),
        sinceTimestamp: new UnixTime(1722140987),
        tokens: ['ETH'],
      },
    ],
  },
  dataAvailability: [
    addSentimentToDataAvailability({
      layers: [DA_LAYERS.CELESTIA],
      bridge: DA_BRIDGES.NONE,
      mode: DA_MODES.TRANSACTION_DATA,
    }),
  ],
  riskView: {
    stateValidation: {
      ...RISK_VIEW.STATE_NONE,
      secondLine: `${formatSeconds(withdrawalDelaySeconds)} challenge period`,
    },
    dataAvailability: RISK_VIEW.DATA_CELESTIA(false),
    exitWindow: RISK_VIEW.EXIT_WINDOW(0, 0),
    sequencerFailure: RISK_VIEW.SEQUENCER_NO_MECHANISM(false),
    proposerFailure: RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
  },
  technology: {
    stateCorrectness: {
      name: 'No state validation',
      description: `Eclipse implements a custom permissioned bridge. Withdrawals need to be actively authorized by a Multisig. Moreover, there is no mechanism to send arbitrary messages from Eclipse back to Ethereum. There is a ${formatSeconds(withdrawalDelaySeconds)} delay for withdrawals.`,
      references: [
        {
          text: 'CanonicalBridge.sol - Etherscan source code, authorizeWithdraw() function',
          href: 'https://etherscan.io/address/0x2B08D7cF7EafF0f5f6623d9fB09b080726D4be11#code#F1#L183',
        },
        {
          text: 'Mailbox.sol - Etherscan source code, receiveMessage() function calls CanonicalBridge',
          href: 'https://etherscan.io/address/0x4cef0fa54dc06ce0ea198dab2f57d28a9dee712b#code#F1#L199',
        },
        {
          text: 'Treasury.sol - Etherscan source code, emergencyWithdraw() function',
          href: 'https://etherscan.io/address/0xF1F7a359C3f33EE8A66bdCbf4c897D25Caf90978#code',
        },
      ],
      risks: [
        {
          category: 'Users can be censored if',
          text: 'the bridge operators decide not to mint tokens after observing a deposit.',
        },
        {
          category: 'Funds can be stolen if',
          text: 'the Treasury owner decides to transfer the funds locked on L1.',
        },
      ],
    },
  },
  contracts: {
    addresses: [
      discovery.getContractDetails('CanonicalBridge', {
        description:
          'Entry point to deposit ETH. It is registered as a module in the Mailbox contract.',
      }),
      discovery.getContractDetails('Mailbox', {
        description:
          'Contract receiving messages from registered modules to send to Eclipse. It doesn’t have any functionality to send messages back to Ethereum.',
      }),
      discovery.getContractDetails('Treasury', {
        description: 'Holds the funds locked on Ethereum.',
      }),
    ],
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  permissions: [
    ...discovery.getMultisigPermission(
      'AuthorityMultisig',
      "Can pause and upgrade the EtherBridge and Mailbox contracts and change all parameters in the 'CanonicalBridge' contract or authorize/cancel withdrawals.",
    ),
    ...discovery.getMultisigPermission(
      'TreasuryOwner',
      'Can upgrade and transfer funds from the Treasury.',
    ),
    {
      name: 'WithdrawerEOA',
      accounts: [
        discovery.getAccessControlRolePermission(
          'CanonicalBridge',
          'WITHDRAW_AUTHORITY_ROLE',
        )[1],
      ],
      description: `Can authorize arbitrary withdrawals from the Treasury (via the 'CanonicalBridge' contract) with a ${formatSeconds(withdrawalDelaySeconds)} delay.`,
    },
    {
      name: 'PauserEOA',
      accounts: [
        discovery.getAccessControlRolePermission(
          'CanonicalBridge',
          'PAUSER_ROLE',
        )[1],
      ],
      description: `Can pause standard withdrawals from the 'CanonicalBridge' contract and cancel withdrawals during the standard ${formatSeconds(withdrawalDelaySeconds)} delay.`,
    },
  ],
}
