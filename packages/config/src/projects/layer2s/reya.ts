import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { orbitStackL2 } from './templates/orbitStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('reya')

export const reya: Layer2 = orbitStackL2({
  discovery,
  display: {
    name: 'Reya',
    slug: 'reya',
    description:
      'Reya is an Arbitrum Orbit stack L2 with AnyTrust data availability, optimizing for trading and liquidity provision.',
    purposes: ['DeFi', 'AMM', 'Exchange'],
    links: {
      websites: ['https://reya.network/'],
      apps: [
        'https://reya.network/lge',
        'https://bridge.gelato.network/bridge/reya-network',
      ],
      documentation: ['https://docs.reya.network/'],
      explorers: ['https://explorer.reya.network/'],
      repositories: ['https://github.com/Reya-Labs'],
      socialMedia: [
        'https://twitter.com/Reya_xyz',
        'https://discord.gg/reyaxyz',
        'https://medium.com/reya-labs',
      ],
    },
    // activityDataSource: 'Blockchain RPC',
  },
  chainConfig: {
    name: 'reya',
    chainId: 1729,
    explorerUrl: 'https://explorer.reya.network',
    explorerApi: {
      url: 'https://explorer.reya.network/api',
      type: 'blockscout',
    },
    multicallContracts: [],
    minTimestampForTvl: UnixTime.fromDate(new Date('2024-04-23T00:00:00Z')),
  },
  trackedTxs: [
    {
      uses: [
        { type: 'liveness', subtype: 'batchSubmissions' },
        { type: 'l2costs', subtype: 'batchSubmissions' },
      ],
      query: {
        formula: 'functionCall',
        address: EthereumAddress('0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d'),
        selector: '0x8f111f3c',
        functionSignature:
          'function addSequencerL2BatchFromOrigin(uint256 sequenceNumber,bytes data,uint256 afterDelayedMessagesRead,address gasRefunder,uint256 prevMessageCount,uint256 newMessageCount)',
        sinceTimestampInclusive: new UnixTime(1709384519), // first tx https://etherscan.io/tx/0xd62bdb183f14756a546d9418f14a14297381ff6798252fc65129774aed9979c8
      },
    },
    // add other SC-supported function signatures here if the sequencer changes behaviour (cp. kinto)
    {
      uses: [
        { type: 'liveness', subtype: 'stateUpdates' },
        { type: 'l2costs', subtype: 'stateUpdates' },
      ],
      query: {
        formula: 'functionCall',
        address: EthereumAddress('0x3f373b0A7DcEe7b7bCfC16DF85CfAE18388542c9'),
        selector: '0xa04cee60',
        functionSignature:
          'function updateSendRoot(bytes32 root, bytes32 l2BlockHash) external',
        sinceTimestampInclusive: new UnixTime(1709386475), // first tx https://etherscan.io/tx/0x691c0b6d2a655764b350197d6231c4eba576140a3039e276a4884da8d7c93539
      },
    },
  ],
  isNodeAvailable: 'UnderReview',
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  // Activity data would be inaccurate since reya uses AA and batches user ops in one tx each block (each block has 2 tx before subtraction)
  //   transactionApi: {
  //     type: 'rpc',
  //     defaultUrl: 'https://rpc.reya.network',
  //     defaultCallsPerMinute: 1500,
  //     assessCount: subtractOne,
  //     startBlock: 1,
  //   },
  nonTemplatePermissions: [
    ...discovery.getMultisigPermission(
      'GelatoMultisig',
      'Multisig that can execute upgrades via the UpgradeExecutor.',
    ),
  ],
  milestones: [
    {
      name: 'Reya DEX launch',
      link: 'https://x.com/reya_xyz/status/1793296498727485712',
      date: '2024-05-21T00:00:00Z',
      description:
        'Reya DEX launches with Perpetual trading available for ETH and BTC.',
    },
    {
      name: 'Reya LGE',
      link: 'https://medium.com/reya-labs/reya-network-the-first-trading-optimised-l2-liquidity-generation-event-launch-f3cd958302ec',
      date: '2024-04-22T00:00:00Z',
      description:
        'Reya launches with a Liquidity Generation Event (LGE) where users can provide USDC to the network.',
    },
  ],
})
