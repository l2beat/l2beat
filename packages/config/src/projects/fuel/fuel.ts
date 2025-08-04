import {
  EthereumAddress,
  formatSeconds,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { formatEther } from 'ethers/lib/utils'
import {
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  EXITS,
  FORCE_TRANSACTIONS,
  OPERATOR,
  REASON_FOR_BEING_OTHER,
} from '../../common'
import { BADGES } from '../../common/badges'
import { formatChallengePeriod } from '../../common/formatDelays'
import { RISK_VIEW } from '../../common/riskView'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'

const discovery = new ProjectDiscovery('fuel')
const depositLimitGlobal = formatEther(
  discovery.getContractValue<number>('FuelMessagePortal', 'depositLimitGlobal'),
)
const isErc20whitelistActive = discovery.getContractValue<boolean>(
  'FuelERC20Gateway',
  'whitelistRequired',
)

const sequencerAddress = EthereumAddress(
  '0xEA0337EFC12e98AB118948dA570C07691E8E4b37',
) // hardcoded in the node

const challengePeriod = discovery.getContractValue<number>(
  'FuelChainState',
  'TIME_TO_FINALIZE',
)

export const fuel: ScalingProject = {
  id: ProjectId('fuel'),
  capability: 'universal',
  addedAt: UnixTime(1729589660), // 2024-10-22T09:34:20Z
  dataAvailability: {
    layer: DA_LAYERS.EIGEN_DA,
    bridge: DA_BRIDGES.NONE,
    mode: DA_MODES.TRANSACTION_DATA_COMPRESSED,
  },
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.NO_PROOFS,
    REASON_FOR_BEING_OTHER.NO_DA_ORACLE,
  ],
  display: {
    name: 'Fuel Ignition',
    slug: 'fuel',
    description:
      'Fuel Ignition is a high-performance Ethereum L2 built on FuelVM and the Sway language.',
    purposes: ['Universal'],
    category: 'Other',
    links: {
      websites: ['https://fuel.network/'],
      bridges: [
        'https://app.fuel.network/ecosystem',
        'https://app.fuel.network/bridge',
      ],
      documentation: ['https://docs.fuel.network/'],
      explorers: ['https://app.fuel.network/'],
      repositories: ['https://github.com/FuelLabs/'],
      socialMedia: [
        'https://twitter.com/fuel_network',
        'https://discord.gg/fuel-network',
        'https://forum.fuel.network/',
        'https://t.me/fuelcommunity',
        'https://youtube.com/channel/UCam2Sj3SvFSAIfDbP-4jWZQ',
      ],
    },
  },
  stage: {
    stage: 'NotApplicable',
  },
  badges: [BADGES.VM.FuelVM, BADGES.DA.EigenDA],
  type: 'layer2',
  config: {
    associatedTokens: ['FUEL'],
    escrows: [
      {
        // ETH bridge
        address: EthereumAddress('0xAEB0c00D0125A8a788956ade4f4F12Ead9f65DDf'),
        sinceTimestamp: UnixTime(1724767871),
        tokens: ['ETH'],
        chain: 'ethereum',
      },
      {
        // ERC20 bridge
        address: EthereumAddress('0xa4cA04d02bfdC3A2DF56B9b6994520E69dF43F67'),
        sinceTimestamp: UnixTime(1725464663),
        tokens: '*',
        chain: 'ethereum',
      },
    ],
    daTracking: [
      {
        type: 'ethereum',
        daLayer: ProjectId('ethereum'),
        sinceBlock: 20915271,
        inbox: EthereumAddress('0xEA0337EFC12e98AB118948dA570C07691E8E4b37'),
        sequencers: [
          EthereumAddress('0xEA0337EFC12e98AB118948dA570C07691E8E4b37'),
        ],
        untilBlock: 22837254,
      },
      // TODO: add as soon as we have their customerId
      // {
      //   type: 'eigen-da',
      //   customerId: '',
      //   daLayer: ProjectId('eigenda'),
      //   sinceTimestamp: UnixTime(1751528219),
      // },
    ],
    trackedTxs: [
      {
        uses: [
          { type: 'liveness', subtype: 'batchSubmissions' },
          { type: 'l2costs', subtype: 'batchSubmissions' },
        ],
        query: {
          formula: 'transfer',
          from: sequencerAddress,
          to: sequencerAddress,
          sinceTimestamp: UnixTime(1728323243),
          untilTimestamp: UnixTime(1751528219),
        },
      },
      {
        uses: [
          { type: 'liveness', subtype: 'stateUpdates' },
          { type: 'l2costs', subtype: 'stateUpdates' },
        ],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0xf3D20Db1D16A4D0ad2f280A5e594FF3c7790f130',
          ),
          selector: '0xe900ead8',
          functionSignature:
            'function commit(bytes32 blockHash, uint256 commitHeight)',
          sinceTimestamp: UnixTime(1725061115),
        },
      },
    ],
    activityConfig: { type: 'block' },
  },
  chainConfig: {
    name: 'fuel',
    chainId: undefined,
    gasTokens: ['ETH'],
    apis: [
      {
        type: 'fuel',
        url: 'https://mainnet.fuel.network/v1/graphql',
        callsPerMinute: 120,
      },
    ],
  },
  riskView: {
    stateValidation: {
      ...RISK_VIEW.STATE_NONE,
      secondLine: formatChallengePeriod(challengePeriod),
    },
    dataAvailability: RISK_VIEW.DATA_EIGENDA(false),
    exitWindow: RISK_VIEW.EXIT_WINDOW(0, challengePeriod),
    sequencerFailure: RISK_VIEW.SEQUENCER_SELF_SEQUENCE(),
    proposerFailure: RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
  },

  stateValidation: {
    categories: [
      {
        title: 'No state validation',
        description: `Ultimately, Fuel will use one round fraud proofs with single round performed via a RISC-V-based zkVM. Currently, there is a ${formatSeconds(challengePeriod)} challenge period.`,
        risks: [
          {
            category: 'Funds can be stolen if',
            text: 'an invalid state root is submitted to the system by the proposer.',
            isCritical: true,
          },
        ],
        references: [
          {
            title:
              'FuelChainState.sol - Etherscan source code, commit function',
            url: 'https://etherscan.io/address/0xf3D20Db1D16A4D0ad2f280A5e594FF3c7790f130#code',
          },
          {
            title: 'Fuel docs - Hybrid proving',
            url: 'https://docs.fuel.network/docs/fuel-book/the-architecture/fuel-and-ethereum/#hybrid-proving',
          },
        ],
      },
    ],
  },
  technology: {
    dataAvailability: {
      name: 'Data is posted to EigenDA',
      description:
        'No transactions roots are posted onchain and the full data is posted on EigenDA. Since the ServiceManager bridge is not used, availability of the data is not verified against EigenDA operators, meaning that data is not guaranteed to be available.',
      risks: [
        {
          category: 'Funds can be lost if',
          text: 'the data is not available on the external provider.',
          isCritical: true,
        },
      ],
      references: [
        {
          title: 'EigenDA Docs - Overview',
          url: 'https://docs.eigenda.xyz/overview',
        },
      ],
    },

    operator: OPERATOR.CENTRALIZED_SEQUENCER,
    forceTransactions: {
      ...FORCE_TRANSACTIONS.CANONICAL_ORDERING('smart contract'),
      references: [
        {
          title:
            'FuelMessagePortalV3.sol - Etherscan source code, sendMessage function',
          url: 'https://etherscan.io/address/0xAEB0c00D0125A8a788956ade4f4F12Ead9f65DDf#code',
        },
        {
          title: 'Fuel docs - L1->L2 messaging',
          url: 'https://docs.fuel.network/docs/fuel-book/the-architecture/fuel-and-ethereum/#l1--l2-messaging',
        },
      ],
    },
    exitMechanisms: [
      EXITS.REGULAR_MESSAGING('optimistic'),
      EXITS.FORCED_MESSAGING('all-messages'),
    ],
    otherConsiderations: [
      {
        name: 'Fuel operates via the FuelVM and the Sway language',
        description:
          'The FuelVM makes use of the UTXO model and a register-based design to enable parallel transaction processing. The language used is Sway and it does not support Solidity contracts.',
        references: [
          {
            title: 'Fuel docs - FuelVM',
            url: 'https://docs.fuel.network/docs/fuel-book/the-architecture/the-fuelvm/#the-fuelvm',
          },
        ],
        risks: [],
      },
    ],
  },
  permissions: {
    ethereum: {
      actors: [
        discovery.getPermissionDetails(
          'ERC20Gateway pausers',
          discovery.getAccessControlRolePermission(
            'FuelERC20Gateway',
            'PAUSER_ROLE',
          ),
          'Whitelisted addresses that can pause the ERC20Gateway.',
        ),
        discovery.getPermissionDetails(
          'FuelMessagePortal pausers',
          discovery.getAccessControlRolePermission(
            'FuelMessagePortal',
            'PAUSER_ROLE',
          ),
          'Whitelisted addresses that can pause the FuelMessagePortal and blacklist L2->L1 messages.',
        ),
        discovery.getPermissionDetails(
          'FuelChainState pausers',
          discovery.getAccessControlRolePermission(
            'FuelChainState',
            'PAUSER_ROLE',
          ),
          'Whitelisted addresses that can pause the FuelChainState.',
        ),
        // uncomment if there are commitments posted here in the future
        // discovery.getPermissionDetails(
        //   'Sequencer',
        //   discovery.formatPermissionedAccounts([sequencerAddress]),
        //   'Permissioned address submitting tx data as blobs.',
        // ),
        discovery.getPermissionDetails(
          'Proposer',
          discovery.getAccessControlRolePermission(
            'FuelChainState',
            'COMMITTER_ROLE',
          ),
          'Permissioned address that can propose new state roots.',
        ),
        discovery.getMultisigPermission(
          'Fuel Security Council',
          'Can upgrade the FuelERC20Gateway, FuelMessagePortal and FuelChainState contracts, potentially gaining access to all funds. It can unpause contracts and remove L2->L1 messages from the blacklist. It can also limit the tokens that can be bridged to L2.',
        ),
      ],
    },
  },
  contracts: {
    addresses: {
      ethereum: [
        discovery.getContractDetails('FuelERC20Gateway', {
          description: `Standard gateway to deposit and withdraw ERC20 tokens. It implements rate limits and a whitelist for tokens. The whitelist is currently ${isErc20whitelistActive ? 'active' : 'inactive'}.`,
          upgradableBy: [{ name: 'Fuel Security Council', delay: 'no' }],
        }),
        discovery.getContractDetails('FuelMessagePortal', {
          description: `Contract that allows to send and receive arbitrary messages to and from L2. It implements a max deposit limit for ETH, currently set to ${depositLimitGlobal} ETH, and rate limits withdrawals. Pausers are allowed to blacklist L2->L1 messages.`,
          upgradableBy: [{ name: 'Fuel Security Council', delay: 'no' }],
        }),
        discovery.getContractDetails('FuelChainState', {
          description:
            'Contract that allows state root submissions and settlement.',
          upgradableBy: [{ name: 'Fuel Security Council', delay: 'no' }],
        }),
      ],
    },
    risks: [
      {
        category: 'Funds can be stolen if',
        text: 'a contract receives a malicious code upgrade. There is no delay on upgrades.',
        isCritical: true,
      },
      {
        category: 'Funds can be frozen if',
        text: 'pausers blacklist L2->L1 messages.',
        isCritical: true,
      },
      {
        category: 'Funds can be frozen if',
        text: 'the limit of tokens that can be withdrawn is set too low.',
      },
    ],
  },
  milestones: [
    {
      title: 'Switch to EigenDA',
      date: '2025-07-03T00:00:00Z',
      url: 'https://x.com/IAmNickDodson/status/1940736106187678037',
      description:
        'Data publishing to Ethereum blobs is stopped and moved to EigenDA without a DA bridge instead.',
      type: 'general',
    },
    {
      title: 'Fuel Ignition Mainnet is Live',
      date: '2024-10-16T00:00:00Z',
      url: 'https://x.com/fuel_network/status/1846536888003313786',
      description: 'Fuel Ignition announces its official launch.',
      type: 'general',
    },
  ],
  discoveryInfo: getDiscoveryInfo([discovery]),
}
