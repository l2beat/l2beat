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
  // validator whitelist is enabled on-chain (validatorWhitelistDisabled: false),
  // so the fraud proof system is permissioned -> classified as Other, not Rollup
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.CLOSED_PROOFS],
  display: {
    name: 'Robinhood Chain',
    slug: 'robinhood',
    description:
      "Robinhood Chain is a permissionless, Ethereum-compatible Layer-2 blockchain built to support a new era of onchain financial infrastructure — one that brings traditional markets, crypto, and real-world assets together on a fast, efficient, and open network.\n\nRobinhood Chain is part of Robinhood's broader mission to democratize access to global financial markets and to empower users and developers with modern blockchain tools. It is designed to enable the seamless transfer, access, and management of digital assets anywhere in the world, without intermediaries or platform lock-in.",
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
})
