import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'

import { subtractOne } from '../common/assessCount'
import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { orbitStackL2 } from './templates/orbitStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('reya')

export const reya: Layer2 = orbitStackL2({
  discovery,
  display: {
    name: 'Reya',
    slug: 'reya',
    description:
      'Kinto is an Orbit stack L2 with account abstraction and KYC enabled for all users, supporting both modern financial institutions and decentralized protocols.',
    purposes: ['DeFi', 'AMM', 'Exchange'],
    links: {
      websites: ['https://kinto.xyz'],
      apps: ['https://engen.kinto.xyz/engen-setup'],
      documentation: ['https://docs.kinto.xyz'],
      explorers: ['https://explorer.kinto.xyz/', 'https://searchkinto.com/'],
      repositories: ['https://github.com/kintoxyz'],
      socialMedia: [
        'https://twitter.com/kintoxyz',
        'https://discord.gg/utEYFxKFgB',
        'https://mirror.xyz/kintoxyz.eth',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
//   trackedTxs: [
//     {
//       uses: [
//         { type: 'liveness', subtype: 'batchSubmissions' },
//         { type: 'l2costs', subtype: 'batchSubmissions' },
//       ],
//       query: {
//         formula: 'functionCall',
//         address: EthereumAddress('0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a'),
//         selector: '0x8f111f3c',
//         functionSignature:
//           'function addSequencerL2BatchFromOrigin(uint256 sequenceNumber,bytes data,uint256 afterDelayedMessagesRead,address gasRefunder,uint256 prevMessageCount,uint256 newMessageCount)',
//         sinceTimestampInclusive: new UnixTime(1702607855),
//       },
//     },
//     {
//       uses: [
//         { type: 'liveness', subtype: 'batchSubmissions' },
//         { type: 'l2costs', subtype: 'batchSubmissions' },
//       ],
//       query: {
//         formula: 'functionCall',
//         address: EthereumAddress('0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a'),
//         selector: '0x6f12b0c9',
//         functionSignature:
//           'function addSequencerL2BatchFromOrigin(uint256 sequenceNumber,bytes calldata data,uint256 afterDelayedMessagesRead,address gasRefunder)',
//         sinceTimestampInclusive: new UnixTime(1702607855),
//       },
//     },
//     {
//       uses: [
//         { type: 'liveness', subtype: 'batchSubmissions' },
//         { type: 'l2costs', subtype: 'batchSubmissions' },
//       ],
//       query: {
//         formula: 'functionCall',
//         address: EthereumAddress('0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a'),
//         selector: '0xe0bc9729',
//         functionSignature:
//           'function addSequencerL2Batch(uint256 sequenceNumber,bytes calldata data,uint256 afterDelayedMessagesRead,address gasRefunder,uint256 prevMessageCount,uint256 newMessageCount)',
//         sinceTimestampInclusive: new UnixTime(1702607855),
//       },
//     },
//     {
//       uses: [
//         { type: 'liveness', subtype: 'stateUpdates' },
//         { type: 'l2costs', subtype: 'stateUpdates' },
//       ],
//       query: {
//         formula: 'functionCall',
//         address: EthereumAddress('0x655761ad5fc251f414d6993a73184b0669f278c8'),
//         selector: '0xa04cee60',
//         functionSignature:
//           'function updateSendRoot(bytes32 root, bytes32 l2BlockHash) external',
//         sinceTimestampInclusive: new UnixTime(1702607855),
//       },
//     },
//   ],
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: EthereumAddress('0xdff78a949e47c1e90f3dd6dd7fe2fa72b42a75f7'),
      tokens: ['USDC'],
      description:
        "Socket brige vault dedicated to Reya network.",
    })
  ],
  isNodeAvailable: 'UnderReview',
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  transactionApi: {
    type: 'rpc',
    defaultUrl: 'https://rpc.kinto-rpc.com',
    defaultCallsPerMinute: 600,
    assessCount: subtractOne,
    startBlock: 1,
  },
  nonTemplatePermissions: [
    {
        name: 'Reya Admin EOA',
        accounts: [
          {
            address: discovery.getAccessControlField('UpgradeExecutor', 'EXECUTOR_ROLE').members[0],
            type: 'EOA',
          },
        ],
        description:
          "EOA that can upgrade the rollup's smart contract system and gain access to all funds.",
      }
  ],
  milestones: [
    // {
    //   name: 'Mainnet final launch',
    //   link: 'https://medium.com/mamori-finance/%EF%B8%8F-engen-update-numbers-rewards-00f96370ceac',
    //   date: '2024-05-16T00:00:00Z',
    //   description: 'Engen mining is completed and locked funds are deposited to the Kinto L2. Users can deposit and withdraw funds.',
    // },
    {
      name: 'Kinto Mainnet Genesis',
      link: 'https://medium.com/mamori-finance/%EF%B8%8F-kintos-launch-the-set-up-7eddfbb4bc38',
      date: '2023-12-15T00:00:00Z',
      description: 'Kinto mainnet is launched. Deposits by users are disabled.',
    },
  ],
})
