import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'

import { subtractOne } from '../common/assessCount'
import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { orbitStackL2 } from './templates/orbitStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('parallel')

export const parallel: Layer2 = orbitStackL2({
  discovery,
  display: {
    name: 'Parallel',
    slug: 'parallel',
    headerWarning: '',
    description:
      'Parallel is an Ethereum L2 solution utilizing Arbitrum Nitro technology.',
    purposes: ['Universal', 'DeFi'],
    links: {
      websites: ['https://parallel.fi'],
      apps: ['https://parallel.fi/airdrop'],
      documentation: ['https://docs.parallel.fi/parallel-chain/overview'],
      explorers: [
        'https://explorerl2new-surprised-harlequin-bonobo-fvcy2k9oqh.t.conduit.xyz/',
      ],
      repositories: [],
      socialMedia: [
        'https://twitter.com/ParallelFi',
        'https://discord.gg/rdjVz8zavF',
        'https://t.me/parallelfi_community',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  postsBlobs: true,
  trackedTxs: [
    {
      uses: [
        { type: 'liveness', subtype: 'batchSubmissions' },
        { type: 'l2costs', subtype: 'batchSubmissions' },
      ],
      query: {
        formula: 'functionCall',
        address: EthereumAddress('0xb4795A0edae98d7820C37F06f6b858e7acb51DF8'),
        selector: '0x8f111f3c',
        functionSignature:
          'function addSequencerL2BatchFromOrigin(uint256 sequenceNumber,bytes data,uint256 afterDelayedMessagesRead,address gasRefunder,uint256 prevMessageCount,uint256 newMessageCount)',
        sinceTimestampInclusive: new UnixTime(1704125939),
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'batchSubmissions' },
        { type: 'l2costs', subtype: 'batchSubmissions' },
      ],
      query: {
        formula: 'functionCall',
        address: EthereumAddress('0xb4795A0edae98d7820C37F06f6b858e7acb51DF8'),
        selector: '0x6f12b0c9',
        functionSignature:
          'function addSequencerL2BatchFromOrigin(uint256 sequenceNumber,bytes calldata data,uint256 afterDelayedMessagesRead,address gasRefunder)',
        sinceTimestampInclusive: new UnixTime(1704125939),
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'batchSubmissions' },
        { type: 'l2costs', subtype: 'batchSubmissions' },
      ],
      query: {
        formula: 'functionCall',
        address: EthereumAddress('0xb4795A0edae98d7820C37F06f6b858e7acb51DF8'),
        selector: '0xe0bc9729',
        functionSignature:
          'function addSequencerL2Batch(uint256 sequenceNumber,bytes calldata data,uint256 afterDelayedMessagesRead,address gasRefunder,uint256 prevMessageCount,uint256 newMessageCount)',
        sinceTimestampInclusive: new UnixTime(1704125939),
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'batchSubmissions' },
        { type: 'l2costs', subtype: 'batchSubmissions' },
      ],
      query: {
        formula: 'functionCall',
        address: EthereumAddress('0xb4795A0edae98d7820C37F06f6b858e7acb51DF8'),
        selector: '0x3e5aa082',
        functionSignature:
          'function addSequencerL2BatchFromBlobs(uint256 sequenceNumber,uint256 afterDelayedMessagesRead,address gasRefunder,uint256 prevMessageCount,uint256 newMessageCount)',
        sinceTimestampInclusive: new UnixTime(1712861435),
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'stateUpdates' },
        { type: 'l2costs', subtype: 'stateUpdates' },
      ],
      query: {
        formula: 'functionCall',
        address: EthereumAddress('0xb6e0586616ebe79b2f86ddb32048c500d23b3ac3'),
        selector: '0xa04cee60',
        functionSignature:
          'function updateSendRoot(bytes32 root, bytes32 l2BlockHash) external',
        sinceTimestampInclusive: new UnixTime(1704125939),
      },
    },
  ],
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: EthereumAddress('0x6Eb9240d4add111D5Fc81b10Ff12eECabcf9752d'),
      tokens: '*',
      description:
        'Main entry point for users depositing ERC20 tokens. Upon depositing, on L2 a generic, "wrapped" token will be minted.',
    }),
    discovery.getEscrowDetails({
      address: EthereumAddress('0xa1c86E2362dba0525075622af6d5f739B1304D45'),
      tokens: '*',
      description:
        'Main entry point for users depositing ERC20 tokens that require minting custom token on L2.',
    }),
    discovery.getEscrowDetails({
      address: EthereumAddress('0x150286BdbE7C8Cd23D41a8e1e64438e0dc04dc3d'),
      tokens: ['WETH'],
      description: 'Escrow for WETH sent to L2.',
    }),
  ],
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  transactionApi: {
    type: 'rpc',
    defaultUrl: 'https://rpc.parallel.fi',
    defaultCallsPerMinute: 120,
    assessCount: subtractOne,
    startBlock: 1,
  },
  nonTemplateContracts: [
    discovery.getContractDetails('L1GatewayRouter', {
      description: 'Router managing token <--> gateway mapping.',
    }),
  ],
  nonTemplatePermissions: [
    ...discovery.getMultisigPermission(
      'OwnerMultisig',
      'Multisig that can execute upgrades via the UpgradeExecutor.',
    ),
    {
      name: 'RollupOwner',
      accounts: discovery.getAccessControlRolePermission(
        'UpgradeExecutor',
        'EXECUTOR_ROLE',
      ),
      description: 'EOA that can execute upgrades via the UpgradeExecutor.',
    },
  ],
  milestones: [
    {
      name: 'ArbOS v20 upgrade',
      link: 'https://forum.arbitrum.foundation/t/aip-arbos-version-20-atlas/20957',
      date: '2024-04-10T00:00:00.00Z',
      description:
        'Introduces EIP-4844 data blobs for L1 data availability and Dencun-related opcodes on L2.',
    },
    {
      name: 'Parallel Mainnet closed launch',
      link: 'https://twitter.com/ParallelFi/status/1743048283684237574',
      date: '2024-01-05T00:00:00Z',
      description: 'Parallel Mainnet is open for developers.',
    },
  ],
})
