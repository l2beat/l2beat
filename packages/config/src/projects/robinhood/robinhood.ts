import { assert, ChainSpecificAddress, UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { orbitStackL2 } from '../../templates/orbitStack'

const discovery = new ProjectDiscovery('robinhood')

const sequencerInbox = discovery.getContract('SequencerInbox')
assert(sequencerInbox.sinceTimestamp !== undefined)
const genesisTimestamp = UnixTime(sequencerInbox.sinceTimestamp)

export const robinhood: ScalingProject = orbitStackL2({
  addedAt: UnixTime(1782864000), // 2026-07-01T00:00:00Z
  discovery,
  additionalPurposes: ['RWA'],
  // validator whitelist is enabled on-chain (validatorWhitelistDisabled: false),
  // so the fraud proof system is permissioned -> classified as Other, not Rollup
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.CLOSED_PROOFS],
  display: {
    name: 'Robinhood Chain',
    slug: 'robinhood',
    description:
      "Robinhood Chain is an Arbitrum Orbit Layer 2 operated by Robinhood, focused on tokenized real-world assets (such as stocks and ETFs) and onchain financial services including 24/7 trading, lending, and borrowing.\n\nRobinhood Chain is part of Robinhood's broader mission to democratize access to global financial markets and to empower users and developers with modern blockchain tools.",
    links: {
      websites: ['https://robinhood.com/chain/'],
      documentation: ['https://docs.robinhood.com/chain'],
      explorers: ['https://robinhoodchain.blockscout.com'],
      socialMedia: ['https://x.com/RobinhoodApp'],
    },
  },
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox,
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: ChainSpecificAddress(
        'eth:0x85001CC4867C5e1C22dA4B79BB8852B9e2a06da0',
      ),
      name: 'L1ERC20Gateway',
      description:
        'Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.',
      tokens: '*',
    }),
    discovery.getEscrowDetails({
      address: ChainSpecificAddress(
        'eth:0xF7e12b9614b509C747ab4423bC4ACF923759Cf1B',
      ),
      name: 'L1WethGateway',
      description:
        'Escrows WETH deposited through the canonical Bridge, minting a wrapped representation at the destination.',
      tokens: '*',
    }),
  ],
  additionalTrackedTxs: [
    {
      uses: [
        { type: 'liveness', subtype: 'batchSubmissions' },
        { type: 'l2costs', subtype: 'batchSubmissions' },
      ],
      query: {
        formula: 'functionCall',
        address: ChainSpecificAddress.address(sequencerInbox.address),
        selector: '0x3e5aa082',
        functionSignature:
          'function addSequencerL2BatchFromBlobs(uint256 sequenceNumber,uint256 afterDelayedMessagesRead,address gasRefunder,uint256 prevMessageCount,uint256 newMessageCount)',
        sinceTimestamp: genesisTimestamp,
      },
    },
    {
      // SequencerInbox has isDelayBufferable=true, so batches can also be posted
      // via the delay-proof blob path; track it too to avoid undercounting
      // liveness/l2costs (mirrors the Arbitrum One config).
      uses: [
        { type: 'liveness', subtype: 'batchSubmissions' },
        { type: 'l2costs', subtype: 'batchSubmissions' },
      ],
      query: {
        formula: 'functionCall',
        address: ChainSpecificAddress.address(sequencerInbox.address),
        selector: '0x917cf8ac',
        functionSignature:
          'function addSequencerL2BatchFromBlobsDelayProof(uint256 sequenceNumber, uint256 afterDelayedMessagesRead, address gasRefunder, uint256 prevMessageCount, uint256 newMessageCount, tuple(bytes32 beforeDelayedAcc, tuple(uint8 kind, address sender, uint64 blockNumber, uint64 timestamp, uint256 inboxSeqNum, uint256 baseFeeL1, bytes32 messageDataHash) delayedMessage) delayProof)',
        sinceTimestamp: genesisTimestamp,
      },
    },
  ],
  interopConfig: {
    name: 'Robinhood Chain Canonical',
    durationSplit: {
      lockAndMint: [
        {
          label: 'L1 -> L2',
          transferTypes: [
            'orbitstack.L1ToL2Transfer',
            'orbitstack-standardgateway.L1ToL2Transfer',
            'orbitstack-wethgateway.L1ToL2Transfer',
          ],
        },
        {
          label: 'L2 -> L1',
          transferTypes: [
            'orbitstack.L2ToL1Transfer',
            'orbitstack-standardgateway.L2ToL1Transfer',
            'orbitstack-wethgateway.L2ToL1Transfer',
          ],
        },
      ],
    },
    plugins: [
      {
        chain: 'robinhood',
        plugin: 'orbitstack',
        bridgeType: 'lockAndMint',
      },
      {
        chain: 'robinhood',
        plugin: 'orbitstack-standardgateway',
        bridgeType: 'lockAndMint',
      },
      {
        chain: 'robinhood',
        plugin: 'orbitstack-wethgateway',
        bridgeType: 'lockAndMint',
      },
    ],
    type: 'canonical',
  },
  chainConfig: {
    name: 'robinhood',
    chainId: 4663,
    explorerUrl: 'https://robinhoodchain.blockscout.com',
    // L2 genesis (block 1); tokens/escrows tracked from chain launch.
    sinceTimestamp: UnixTime(1777567931),
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.mainnet.chain.robinhood.com',
        callsPerMinute: 600,
      },
      { type: 'blockscout', url: 'https://robinhoodchain.blockscout.com/api' },
    ],
  },
  usesEthereumBlobs: true,
  milestones: [
    {
      // L1 contracts were deployed earlier (2026-04-30) while the chain was
      // private behind a transaction-access whitelist; this marks the public
      // launch (whitelist removed) on 2026-07-01. Pinned to T00:00:00Z because
      // the milestone date must be a full day.
      title: 'Mainnet launch',
      url: 'https://robinhood.com/chain/',
      date: '2026-07-01T00:00:00Z',
      description:
        'Robinhood Chain opens to the public, removing the transaction-access whitelist.',
      type: 'general',
    },
    {
      title: 'Public testnet launch',
      url: 'https://robinhood.com/us/en/newsroom/robinhood-chain-launches-public-testnet/',
      date: '2026-02-10T00:00:00Z',
      description: 'Robinhood Chain opens its public testnet.',
      type: 'general',
    },
  ],
})
