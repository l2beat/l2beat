import {
  EthereumAddress,
  ProjectId,
  UnixTime,
  formatSeconds,
} from '@l2beat/shared-pure'
import { formatEther } from 'ethers/lib/utils'
import {
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  EXITS,
  FORCE_TRANSACTIONS,
  OPERATOR,
  TECHNOLOGY_DATA_AVAILABILITY,
  addSentimentToDataAvailability,
} from '../../common'
import { formatChallengePeriod } from '../../common/formatDelays'
import { RISK_VIEW } from '../../common/riskView'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { getStage } from './common/stages/getStage'
import { Layer2 } from './types'

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

export const fuel: Layer2 = {
  id: ProjectId('fuel'),
  createdAt: new UnixTime(1729589660), // 2024-10-22T09:34:20Z
  dataAvailability: [
    addSentimentToDataAvailability({
      layers: [DA_LAYERS.ETH_BLOBS],
      bridge: DA_BRIDGES.ENSHRINED,
      mode: DA_MODES.TRANSACTION_DATA_COMPRESSED,
    }),
  ],
  display: {
    name: 'Fuel Ignition',
    slug: 'fuel',
    description:
      'Fuel Ignition is a high-performance Ethereum L2 built on FuelVM and the Sway language.',
    purposes: ['Universal'],
    category: 'Optimistic Rollup',
    links: {
      websites: ['https://fuel.network/'],
      apps: [
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
    activityDataSource: 'Blockchain RPC',
  },
  badges: [Badge.VM.FuelVM, Badge.DA.EthereumBlobs],
  type: 'layer2',
  config: {
    escrows: [
      {
        // ETH bridge
        address: EthereumAddress('0xAEB0c00D0125A8a788956ade4f4F12Ead9f65DDf'),
        sinceTimestamp: new UnixTime(1724767871),
        tokens: ['ETH'],
        chain: 'ethereum',
      },
      {
        // ERC20 bridge
        address: EthereumAddress('0xa4cA04d02bfdC3A2DF56B9b6994520E69dF43F67'),
        sinceTimestamp: new UnixTime(1725464663),
        tokens: '*',
        chain: 'ethereum',
      },
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
          sinceTimestamp: new UnixTime(1728323243),
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
          sinceTimestamp: new UnixTime(1725061115),
        },
      },
    ],
    transactionApi: {
      type: 'fuel',
      defaultUrl: 'https://mainnet.fuel.network/v1/graphql',
      defaultCallsPerMinute: 120,
    },
  },
  riskView: {
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
    destinationToken: RISK_VIEW.NATIVE_AND_CANONICAL(),
    stateValidation: {
      ...RISK_VIEW.STATE_NONE,
      secondLine: formatChallengePeriod(challengePeriod),
    },
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
    exitWindow: RISK_VIEW.EXIT_WINDOW(0, challengePeriod),
    sequencerFailure: RISK_VIEW.SEQUENCER_SELF_SEQUENCE(),
    proposerFailure: RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
  },

  stage: getStage(
    {
      stage0: {
        callsItselfRollup: true,
        stateRootsPostedToL1: true,
        dataAvailabilityOnL1: true,
        rollupNodeSourceAvailable: true,
      },
      stage1: {
        stateVerificationOnL1: false,
        fraudProofSystemAtLeast5Outsiders: null,
        usersCanExitWithoutCooperation: false,
        usersHave7DaysToExit: false,
        securityCouncilProperlySetUp: false,
      },
      stage2: {
        fraudProofSystemIsPermissionless: null,
        delayWith30DExitWindow: false,
        proofSystemOverriddenOnlyInCaseOfABug: false,
      },
    },
    { rollupNodeLink: 'https://github.com/FuelLabs/network-watchtower' },
  ),
  technology: {
    stateCorrectness: {
      name: 'Fraud proofs are in development',
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
          text: 'FuelChainState.sol - Etherscan source code, commit function',
          href: 'https://etherscan.io/address/0xf3D20Db1D16A4D0ad2f280A5e594FF3c7790f130#code',
        },
        {
          text: 'Fuel docs - Hybrid proving',
          href: 'https://docs.fuel.network/docs/fuel-book/the-architecture/fuel-and-ethereum/#hybrid-proving',
        },
      ],
    },
    dataAvailability: {
      ...TECHNOLOGY_DATA_AVAILABILITY.ON_CHAIN_CANONICAL,
      references: [
        {
          text: 'Sequencer - Etherscan address',
          href: `https://etherscan.io/address/${sequencerAddress}`,
        },
        {
          text: 'Fuel docs - Blobs',
          href: 'https://docs.fuel.network/docs/fuel-book/the-architecture/fuel-and-ethereum/#blobs',
        },
      ],
    },
    operator: OPERATOR.CENTRALIZED_SEQUENCER,
    forceTransactions: {
      ...FORCE_TRANSACTIONS.CANONICAL_ORDERING,
      references: [
        {
          text: 'FuelMessagePortalV3.sol - Etherscan source code, sendMessage function',
          href: 'https://etherscan.io/address/0xAEB0c00D0125A8a788956ade4f4F12Ead9f65DDf#code',
        },
        {
          text: 'Fuel docs - L1->L2 messaging',
          href: 'https://docs.fuel.network/docs/fuel-book/the-architecture/fuel-and-ethereum/#l1--l2-messaging',
        },
      ],
    },
    exitMechanisms: [
      EXITS.REGULAR('optimistic', 'merkle proof'),
      EXITS.FORCED('all-withdrawals'),
    ],
    otherConsiderations: [
      {
        name: 'Fuel operates via the FuelVM and the Sway language',
        description:
          'The FuelVM makes use of the UTXO model and a register-based design to enable parallel transaction processing. The language used is Sway and it does not support Solidity contracts.',
        references: [
          {
            text: 'Fuel docs - FuelVM',
            href: 'https://docs.fuel.network/docs/fuel-book/the-architecture/the-fuelvm/#the-fuelvm',
          },
        ],
        risks: [],
      },
    ],
  },
  permissions: [
    {
      name: 'ERC20Gateway pausers',
      description: 'Whitelisted addresses that can pause the ERC20Gateway.',
      accounts: discovery.getAccessControlRolePermission(
        'FuelERC20Gateway',
        'PAUSER_ROLE',
      ),
    },
    {
      name: 'FuelMessagePortal pausers',
      description:
        'Whitelisted addresses that can pause the FuelMessagePortal and blacklist L2->L1 messages.',
      accounts: discovery.getAccessControlRolePermission(
        'FuelMessagePortal',
        'PAUSER_ROLE',
      ),
    },
    {
      name: 'FuelChainState pausers',
      description: 'Whitelisted addresses that can pause the FuelChainState.',
      accounts: discovery.getAccessControlRolePermission(
        'FuelChainState',
        'PAUSER_ROLE',
      ),
    },
    {
      name: 'Sequencer',
      description: 'Permissioned address submitting tx data as blobs.',
      accounts: [
        {
          address: sequencerAddress,
          type: 'EOA',
        },
      ],
    },
    {
      name: 'Proposer',
      description: 'Permissioned address that can propose new state roots.',
      accounts: discovery.getAccessControlRolePermission(
        'FuelChainState',
        'COMMITTER_ROLE',
      ),
    },
    ...discovery.getMultisigPermission(
      'FuelMultisig',
      'Can upgrade the FuelERC20Gateway, FuelMessagePortal and FuelChainState contracts, potentially gaining access to all funds. It can unpause contracts and remove L2->L1 messages from the blacklist. It can also limit the tokens that can be bridged to L2.',
    ),
  ],
  contracts: {
    addresses: [
      discovery.getContractDetails('FuelERC20Gateway', {
        description: `Standard gateway to deposit and withdraw ERC20 tokens. It implements rate limits and a whitelist for tokens. The whitelist is currently ${isErc20whitelistActive ? 'active' : 'inactive'}.`,
        upgradableBy: ['FuelMultisig'],
        upgradeDelay: 'None',
      }),
      discovery.getContractDetails('FuelMessagePortal', {
        description: `Contract that allows to send and receive arbitrary messages to and from L2. It implements a max deposit limit for ETH, currently set to ${depositLimitGlobal} ETH, and rate limits withdrawals. Pausers are allowed to blacklist L2->L1 messages.`,
        upgradableBy: ['FuelMultisig'],
        upgradeDelay: 'None',
      }),
      discovery.getContractDetails('FuelChainState', {
        description:
          'Contract that allows state root submissions and settlement.',
        upgradableBy: ['FuelMultisig'],
        upgradeDelay: 'None',
      }),
    ],
    risks: [
      {
        category: 'Funds can be stolen if',
        text: `a contract receives a malicious code upgrade. There is no delay on upgrades.`,
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
      name: 'Fuel Ignition Mainnet is Live',
      date: '2024-10-16T00:00:00Z',
      link: 'https://x.com/fuel_network/status/1846536888003313786',
      description: 'Fuel Ignition announces its official launch.',
      type: 'general',
    },
  ],
}
