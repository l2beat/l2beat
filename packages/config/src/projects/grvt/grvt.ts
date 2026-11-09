import {
  ChainSpecificAddress,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import {
  DA_BRIDGES,
  DA_LAYERS,
  REASON_FOR_BEING_OTHER,
  RISK_VIEW,
} from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { zkStackL2 } from '../../templates/zkStack'

const discovery = new ProjectDiscovery('grvt')
const chainId = 325
const trackedTxsSince = UnixTime(1742808587)

export const grvt: ScalingProject = zkStackL2({
  discovery,
  additionalBadges: [BADGES.DA.CustomDA],
  addedAt: UnixTime(1734652800), // 2024-12-20T00:00:00Z
  overridingPurposes: ['Exchange'],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.NO_DA_ORACLE],
  display: {
    name: 'GRVT',
    slug: 'grvt',
    tvsWarning: {
      value:
        'ETHBEAT only tracks the funds in the GRVTL1TreasuryVault and its yield strategies, which hold most of the exchange reserves. The funds that remain in the shared ZK stack bridge cannot be tracked due to the lack of a public rpc / explorer.',
      sentiment: 'warning',
    },
    description:
      'Gravity (GRVT) is a hybrid crypto derivatives exchange, providing a centralized exchange-like experience while being based on the ZK stack Validium codebase with confidential data availability and transaction filtering enabled. Most of the exchange reserves are withdrawn from the shared ZK stack bridge to the GRVT-controlled GRVTL1TreasuryVault on Ethereum, which invests them in external yield strategies.',
    links: {
      websites: ['https://grvt.io'],
      bridges: ['https://grvt.io/exchange/perpetual/BTC-USDT'],
      documentation: ['https://help.grvt.io/en'], // https://docs.grvt.io/ is private
      socialMedia: [
        'https://x.com/grvt_io',
        'https://discord.gg/3jsVPwaGeB',
        'https://t.me/grvt_io',
        'https://grvt.io/blog/',
      ],
    },
  },
  ecosystemInfo: {
    id: ProjectId('the-elastic-network'),
  },
  chainId,
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: ChainSpecificAddress(
        'eth:0xC95Fedb8Bdc763e4ef093D14e8196afafBB48f45',
      ),
      tokens: ['USDT', 'USDC'],
      description:
        'Holds most of the exchange reserves of GRVT, withdrawn from the shared ZK stack bridge by the GRVT exchange. The funds can be allocated to yield strategies or bridged back to GRVT by permissioned operators.',
    }),
    discovery.getEscrowDetails({
      address: ChainSpecificAddress(
        'eth:0x189b2c1CE2f4Cd8e535E98B005A2d7e798124B18',
      ),
      tokens: ['USDC', 'USDY', 'sGho'],
      description:
        'Yield strategy of the GRVTL1TreasuryVault that holds tokenized treasuries and sGHO bought with USDC of the vault.',
    }),
    discovery.getEscrowDetails({
      address: ChainSpecificAddress(
        'eth:0xEC33298A3aC7A5F5B3f21A3218a5D8E862Da8a12',
      ),
      tokens: ['USDT', 'USDY', 'sGho'],
      description:
        'Yield strategy of the GRVTL1TreasuryVault that holds tokenized treasuries and sGHO bought with USDT of the vault.',
    }),
    discovery.getEscrowDetails({
      address: ChainSpecificAddress(
        'eth:0x89D76f493AECaEe10caBbC1a67dbdC92E947b85E',
      ),
      tokens: ['USDT', 'sGho'],
      description:
        'Yield strategy of the GRVTL1TreasuryVault that converts USDT of the vault to GHO and deposits it into sGHO.',
    }),
  ],
  daProvider: {
    layer: DA_LAYERS.NONE,
    bridge: DA_BRIDGES.NONE,
    riskView: RISK_VIEW.DATA_EXTERNAL,
    technology: {
      name: 'Data is not stored on chain',
      description:
        'The transaction data is not recorded on the Ethereum main chain. Transaction data is stored off-chain and only the hashes are posted onchain by the centralized Sequencer.',
      risks: [
        {
          category: 'Funds can be lost if',
          text: 'the external data becomes unavailable.',
          isCritical: true,
        },
      ],
      references: [
        {
          title: 'ExecutorFacet - _commitOneBatch() function',
          url: 'https://etherscan.io/address/0x0597CaA8A823A699d7CD9E62B5E5d4153FF82691#code#F1#L50',
        },
      ],
    },
  },
  nonTemplateRiskView: {
    sequencerFailure: {
      value: 'No mechanism',
      description:
        'There is no mechanism to have transactions be included if the sequencer is down or censoring. The Operator actively uses a TransactionFilterer contract, which requires accounts that enqueue or force transactions from L1 to be whitelisted.',
      sentiment: 'bad',
    },
  },
  nonTemplateTechnology: {
    forceTransactions: {
      name: "Users can't force all transactions",
      description:
        'If a user is censored by the L2 Sequencer, they cannot by default force their transaction via the L1 queue. An active TransactionFilterer contract which allows only whitelisted accounts to enqueue, prevents it. Even if a user was specifically whitelisted, there is no mechanism that forces L2 Sequencer to include\
            transactions from the queue in an L2 block, as they have the choice to process the queue in order or not at all.',
      risks: [
        {
          category: 'Users can be censored if',
          text: 'the operator refuses to include their transactions.',
        },
        {
          category: 'Users can be censored if',
          text: 'the Operator does not specifically whitelist them in the TransactionFilterer.',
        },
      ],
      references: [
        {
          title: "L1 - L2 interoperability - Developer's documentation",
          url: 'https://docs.zksync.io/zksync-protocol/rollup/l1_l2_communication#priority-operations-1',
        },
        {
          title: 'Mailbox facet',
          url: 'https://etherscan.io/address/0x1e34aB39a9682149165ddeCc0583d238A5448B45#code#F1#L472',
        },
        {
          title: 'TransactionFilterer',
          url: 'https://etherscan.io/address/0x8319fede99061c6723c86d366a903e8fa3a0f541#code#F1#L29',
        },
      ],
    },
  },
  nonTemplateTrackedTxs: [
    {
      uses: [{ type: 'l2costs', subtype: 'batchSubmissions' }],
      query: {
        formula: 'sharedBridge',
        firstParameter: chainId,
        address: EthereumAddress('0x8c0bfc04ada21fd496c55b8c50331f904306f564'),
        selector: '0x98f81962',
        functionSignature:
          'function commitBatchesSharedBridge(uint256 _chainId, uint256 _processBatchFrom, uint256 _processBatchTo, bytes)',
        sinceTimestamp: trackedTxsSince,
        untilTimestamp: UnixTime(1766777387),
      },
    },
    {
      uses: [{ type: 'l2costs', subtype: 'batchSubmissions' }],
      query: {
        formula: 'sharedBridge',
        firstParameter: EthereumAddress(
          '0xe3e310cd8EE0C808794810AB50FE4BcCC5c7D89E',
        ), // grvt diamond on ethereum
        address: EthereumAddress('0x2e5110cF18678Ec99818bFAa849B8C881744b776'),
        selector: '0x0db9eb87',
        functionSignature:
          'function commitBatchesSharedBridge(address _chainAddress, uint256 _processBatchFrom, uint256 _processBatchTo, bytes)',
        sinceTimestamp: UnixTime(1766777387),
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'proofSubmissions' },
        { type: 'l2costs', subtype: 'proofSubmissions' },
      ],
      query: {
        formula: 'sharedBridge',
        firstParameter: chainId,
        address: EthereumAddress('0x8c0bfc04ada21fd496c55b8c50331f904306f564'),
        selector: '0xe12a6137',
        functionSignature:
          'function proveBatchesSharedBridge(uint256 _chainId, uint256, uint256, bytes)',
        sinceTimestamp: trackedTxsSince,
        untilTimestamp: UnixTime(1766777387),
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'proofSubmissions' },
        { type: 'l2costs', subtype: 'proofSubmissions' },
      ],
      query: {
        formula: 'sharedBridge',
        firstParameter: EthereumAddress(
          '0xe3e310cd8EE0C808794810AB50FE4BcCC5c7D89E',
        ), // grvt diamond on ethereum
        address: EthereumAddress('0x2e5110cF18678Ec99818bFAa849B8C881744b776'),
        selector: '0x9271e450',
        functionSignature:
          'function proveBatchesSharedBridge(address _chainAddress, uint256, uint256, bytes)',
        sinceTimestamp: UnixTime(1766777387),
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'stateUpdates' },
        { type: 'l2costs', subtype: 'stateUpdates' },
      ],
      query: {
        formula: 'sharedBridge',
        firstParameter: chainId,
        address: EthereumAddress('0x8c0bfc04ada21fd496c55b8c50331f904306f564'),
        selector: '0xcf02827d',
        functionSignature:
          'function executeBatchesSharedBridge(uint256 _chainId, uint256 _processBatchFrom, uint256 _processBatchTo, bytes)',
        sinceTimestamp: trackedTxsSince,
        untilTimestamp: UnixTime(1766777387),
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'stateUpdates' },
        { type: 'l2costs', subtype: 'stateUpdates' },
      ],
      query: {
        formula: 'sharedBridge',
        firstParameter: EthereumAddress(
          '0xe3e310cd8EE0C808794810AB50FE4BcCC5c7D89E',
        ), // grvt diamond on ethereum
        address: EthereumAddress('0x2e5110cF18678Ec99818bFAa849B8C881744b776'),
        selector: '0xa085344d',
        functionSignature:
          'function executeBatchesSharedBridge(address _chainAddress, uint256 _processBatchFrom, uint256 _processBatchTo, bytes)',
        sinceTimestamp: UnixTime(1766777387),
      },
    },
  ],
  milestones: [
    {
      title: 'Mainnet alpha launch',
      url: 'https://grvt.io/blog/grvt-mainnet-alpha-first-hour-15-million/',
      date: '2024-12-20T00:00:00Z',
      description: 'GRVT mainnet alpha launches for all users.',
      type: 'general',
    },
  ],
})
