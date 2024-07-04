import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'

import { subtractOne } from '../../common/assessCount'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { orbitStackL2 } from './templates/orbitStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('kinto')

export const kinto: Layer2 = orbitStackL2({
  discovery,
  display: {
    name: 'Kinto',
    slug: 'kinto',
    headerWarning: '',
    description:
      'Kinto is an Orbit stack L2 with account abstraction and KYC enabled for all users, supporting both modern financial institutions and decentralized protocols.',
    purposes: ['Universal', 'DeFi'],
    links: {
      websites: ['https://kinto.xyz'],
      apps: ['https://engen.kinto.xyz'],
      documentation: ['https://docs.kinto.xyz'],
      explorers: [
        'https://explorer.kinto.xyz/',
        'https://kintoscan.io/',
        'https://searchkinto.com/',
      ],
      repositories: ['https://github.com/kintoxyz'],
      socialMedia: [
        'https://twitter.com/kintoxyz',
        'https://discord.com/invite/kinto',
        'https://mirror.xyz/kintoxyz.eth',
        'https://medium.com/mamori-finance',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  chainConfig: {
    name: 'kinto',
    chainId: 7887,
    explorerUrl: 'https://explorer.kinto.xyz',
    explorerApi: {
      url: 'https://explorer.kinto.xyz/api',
      type: 'blockscout',
    },
    // this is the full launch of their mainnet, should be negligible socket bridged tvl before
    minTimestampForTvl: UnixTime.fromDate(new Date('2024-05-21T00:00:01Z')),
  },
  trackedTxs: [
    {
      uses: [
        { type: 'liveness', subtype: 'batchSubmissions' },
        { type: 'l2costs', subtype: 'batchSubmissions' },
      ],
      query: {
        formula: 'functionCall',
        address: EthereumAddress('0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a'),
        selector: '0x8f111f3c',
        functionSignature:
          'function addSequencerL2BatchFromOrigin(uint256 sequenceNumber,bytes data,uint256 afterDelayedMessagesRead,address gasRefunder,uint256 prevMessageCount,uint256 newMessageCount)',
        sinceTimestamp: new UnixTime(1702607855),
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'batchSubmissions' },
        { type: 'l2costs', subtype: 'batchSubmissions' },
      ],
      query: {
        formula: 'functionCall',
        address: EthereumAddress('0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a'),
        selector: '0x6f12b0c9',
        functionSignature:
          'function addSequencerL2BatchFromOrigin(uint256 sequenceNumber,bytes calldata data,uint256 afterDelayedMessagesRead,address gasRefunder)',
        sinceTimestamp: new UnixTime(1702607855),
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'batchSubmissions' },
        { type: 'l2costs', subtype: 'batchSubmissions' },
      ],
      query: {
        formula: 'functionCall',
        address: EthereumAddress('0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a'),
        selector: '0xe0bc9729',
        functionSignature:
          'function addSequencerL2Batch(uint256 sequenceNumber,bytes calldata data,uint256 afterDelayedMessagesRead,address gasRefunder,uint256 prevMessageCount,uint256 newMessageCount)',
        sinceTimestamp: new UnixTime(1702607855),
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'stateUpdates' },
        { type: 'l2costs', subtype: 'stateUpdates' },
      ],
      query: {
        formula: 'functionCall',
        address: EthereumAddress('0x655761ad5fc251f414d6993a73184b0669f278c8'),
        selector: '0xa04cee60',
        functionSignature:
          'function updateSendRoot(bytes32 root, bytes32 l2BlockHash) external',
        sinceTimestamp: new UnixTime(1702607855),
      },
    },
  ],
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: EthereumAddress('0x0f1b7bd7762662b23486320aa91f30312184f70c'),
      tokens: '*',
      description:
        "Bridger gateway that can swap assets to 'L2 final assets' before bridging them to the L2.",
    }),
  ],
  isNodeAvailable: false,
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
    ...discovery.getMultisigPermission(
      'ExecutorMultisig',
      'Multisig that can execute upgrades via the UpgradeExecutor.',
    ),
    ...discovery.getMultisigPermission(
      'BridgerOwnerMultisig',
      'Multisig that can upgrade the Bridger gateway contract. It also owns the Socket contracts used as escrows for bridged assets.',
    ),
    {
      name: 'Bridger Sender Account',
      description:
        'EOA privileged to call `depositBySig()` on the Bridger gateway to deposit assets to the L2 using pre-signed transactions from users.',
      accounts: [discovery.getPermissionedAccount('Bridger', 'senderAccount')],
    },
  ],
  milestones: [
    {
      name: 'Mainnet full launch',
      link: 'https://medium.com/mamori-finance/%EF%B8%8F-engen-is-over-kinto-is-launching-d9f2dd49fb2e',
      date: '2024-05-22T00:00:00Z',
      description:
        'Engen mining is completed and locked funds are bridged to the Kinto L2.',
    },
    {
      name: 'Kinto Mainnet Genesis',
      link: 'https://medium.com/mamori-finance/%EF%B8%8F-kintos-launch-the-set-up-7eddfbb4bc38',
      date: '2023-12-15T00:00:00Z',
      description: 'Kinto mainnet is launched. Deposits by users are disabled.',
    },
  ],
})
