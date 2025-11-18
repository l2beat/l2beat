import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import {
  CONTRACTS,
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  FORCE_TRANSACTIONS,
  OPERATOR,
  REASON_FOR_BEING_OTHER,
  RISK_VIEW,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import {
  generateDiscoveryDrivenContracts,
  generateDiscoveryDrivenPermissions,
} from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'

const discovery = new ProjectDiscovery('jovay')

export const jovay: ScalingProject = {
  type: 'layer2',
  id: ProjectId('jovay'),
  capability: 'universal',
  addedAt: UnixTime(1754392609),
  hasTestnet: true,
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.NO_PROOFS],
  display: {
    name: 'Jovay',
    slug: 'jovay',
    description:
      'Jovay, by Ant Digital Technologies, is an Ethereum Layer 2 blockchain built for real-world assets and users.',
    purposes: ['Universal', 'RWA'],
    links: {
      websites: ['https://jovay.io/'],
      documentation: ['https://docs.jovay.io/'],
      explorers: ['https://explorer.jovay.io/l2'],
      socialMedia: [
        'https://x.com/JovayNetwork',
        'https://discord.com/invite/8pYGeFAs44',
        'https://t.me/Jovay_Network',
      ],
      bridges: ['https://bridge.jovay.io/'],
      repositories: ['https://github.com/jovaynetwork'],
    },
  },
  proofSystem: undefined,
  dataAvailability: {
    layer: DA_LAYERS.ETH_BLOBS_OR_CALLDATA,
    bridge: DA_BRIDGES.ENSHRINED,
    mode: DA_MODES.TRANSACTION_DATA_COMPRESSED,
  },
  stage: {
    stage: 'NotApplicable',
  },
  config: {
    escrows: [
      {
        address: EthereumAddress('0x922248db4a99bb542539ae7165fb9d7a546fb9f1'),
        sinceTimestamp: UnixTime(1754392609),
        tokens: ['ETH'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x9869A90FDAc287519E48aff4cCE329907a995162'),
        sinceTimestamp: UnixTime(1754392609),
        tokens: ['ETH'],
        chain: 'ethereum',
      },
    ],
    activityConfig: {
      type: 'block',
      startBlock: 1,
    },
    trackedTxs: [
      {
        uses: [
          { type: 'liveness', subtype: 'batchSubmissions' },
          { type: 'l2costs', subtype: 'batchSubmissions' },
        ],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0xe0a28B8918a62edB825055221a1dF12c7C81Bac1',
          ),
          selector: '0x0b6ac513',
          functionSignature:
            'function commitBatch(uint8 _version, uint256 _batchIndex, uint256 _totalL1MessagePopped)',
          sinceTimestamp: UnixTime(1758499200),
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
            '0xe0a28B8918a62edB825055221a1dF12c7C81Bac1',
          ),
          selector: '0x7256b753',
          functionSignature:
            'function verifyBatch(uint8 _prove_type, bytes _batchHeader, bytes32 _postStateRoot, bytes32 _l2MsgRoot, bytes _proof)',
          sinceTimestamp: UnixTime(1758499200),
        },
      },
    ],
  },
  riskView: {
    stateValidation: {
      ...RISK_VIEW.STATE_NONE,
      value: 'TEE attestations',
      description:
        'State roots are accepted when attested by a permissioned TEE through the TEEVerifierProxy. There is no challenge mechanism and no validity proofs can be submitted.',
    },
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
    exitWindow: RISK_VIEW.EXIT_WINDOW(0, 0),
    sequencerFailure: RISK_VIEW.SEQUENCER_ENQUEUE_VIA('L1'),
    proposerFailure: RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
  },
  technology: {
    dataAvailability: {
      ...TECHNOLOGY_DATA_AVAILABILITY.ON_CHAIN_BLOB_OR_CALLDATA,
      references: [
        {
          title:
            'Rollup.sol - commitBatch stores calldata hashes for each batch',
          url: 'https://etherscan.io/address/0xe0a28B8918a62edB825055221a1dF12c7C81Bac1#code',
        },
        {
          title: 'L1Mailbox.sol - sendMsg enqueues transactions on Ethereum',
          url: 'https://etherscan.io/address/0x9869A90FDAc287519E48aff4cCE329907a995162#code',
        },
      ],
    },
    operator: {
      ...OPERATOR.CENTRALIZED_OPERATOR,
      references: [
        {
          title: 'Rollup.sol - addRelayer is restricted to the owner',
          url: 'https://etherscan.io/address/0xe0a28B8918a62edB825055221a1dF12c7C81Bac1#code',
        },
      ],
    },
    forceTransactions: {
      ...FORCE_TRANSACTIONS.ENQUEUE,
      references: [
        {
          title: 'L1Mailbox.sol - sendMsg enqueues deposit transactions',
          url: 'https://etherscan.io/address/0x9869A90FDAc287519E48aff4cCE329907a995162#code',
        },
        {
          title:
            'Rollup.sol - commitBatch function passes the totalL1MessagePopped as input parameter',
          url: 'https://etherscan.io/address/0xe0a28B8918a62edB825055221a1dF12c7C81Bac1#code',
        },
      ],
    },
    exitMechanisms: [
      {
        name: 'Regular messaging',
        description:
          'The user initiates L2->L1 messages by submitting a regular transaction on this chain. When the block containing that transaction is settled, the message becomes available for processing on L1.',
        risks: [],
        references: [
          {
            title:
              'L1ETHBridge.sol - finalizeWithdraw executes ETH withdrawals',
            url: 'https://etherscan.io/address/0x922248Db4A99bB542539ae7165FB9D7A546FB9F1#code',
          },
          {
            title:
              'L1Mailbox.sol - relayMsgWithProof verifies withdrawal proofs',
            url: 'https://etherscan.io/address/0x9869A90FDAc287519E48aff4cCE329907a995162#code',
          },
        ],
      },
    ],
  },
  permissions: generateDiscoveryDrivenPermissions([discovery]),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  chainConfig: {
    name: 'jovay',
    chainId: 5734951,
    explorerUrl: 'https://explorer.jovay.io/l2',
    gasTokens: ['ETH'],
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.jovay.io',
        callsPerMinute: 300,
      },
    ],
  },
  discoveryInfo: getDiscoveryInfo([discovery]),
}
