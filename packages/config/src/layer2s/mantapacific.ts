import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'

import { subtractOne } from '../common/assessCount'
import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { CELESTIA_DA_PROVIDER, opStack } from './templates/opStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('mantapacific')

const upgradeability = {
  upgradableBy: ['ProxyAdmin'],
  upgradeDelay: 'No delay',
}

export const mantapacific: Layer2 = opStack({
  daProvider: CELESTIA_DA_PROVIDER,
  discovery,
  display: {
    name: 'Manta Pacific',
    slug: 'mantapacific',
    description:
      'Manta Pacific is an Optimium empowering EVM-native zero-knowledge (ZK) applications and general dapps.',
    warning:
      'Fraud proof system is currently under development. Users need to trust the block proposer to submit correct L1 state roots.',
    purposes: ['Universal'],
    links: {
      websites: ['https://pacific.manta.network/'],
      apps: ['https://pacific-bridge.manta.network/'],
      documentation: ['https://docs.manta.network/'],
      explorers: ['https://pacific-explorer.manta.network/'],
      repositories: ['https://github.com/Manta-Network'],
      socialMedia: [
        'https://discord.gg/mantanetwork',
        'https://twitter.com/MantaNetwork',
        'https://medium.com/@mantanetwork',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  upgradeability,
  l1StandardBridgeEscrow: EthereumAddress(
    '0x3B95bC951EE0f553ba487327278cAc44f29715E5',
  ),
  rpcUrl: 'https://pacific-rpc.manta.network/http',
  transactionApi: {
    type: 'rpc',
    defaultUrl: 'https://pacific-rpc.manta.network/http',
    defaultCallsPerMinute: 1500,
    startBlock: 1,
    assessCount: subtractOne,
  },
  associatedTokens: ['MANTA'],

  chainConfig: {
    name: 'mantapacific',
    chainId: 169,
    explorerUrl: 'https://pacific-explorer.manta.network',
    explorerApi: {
      url: 'https://pacific-explorer.manta.network/api',
      type: 'blockscout',
    },
    // ~ Timestamp of block number 0 on MantaPacific
    // https://pacific-explorer.manta.network/block/0
    minTimestampForTvl: UnixTime.fromDate(new Date('2023-09-09T01:45:59Z')),
    multicallContracts: [
      {
        sinceBlock: 54816,
        batchSize: 150,
        address: EthereumAddress('0x9731502B98F65BBb573D0106ECd9E4097dbcCD30'),
        version: '2',
      },
    ],
    coingeckoPlatform: 'manta-pacific',
  },
  genesisTimestamp: new UnixTime(1679202395),
  l2OutputOracle: discovery.getContract('L2OutputOracle'),
  portal: discovery.getContract('OptimismPortal'),
  isNodeAvailable: false,

  roleOverrides: {
    batcherHash: 'Sequencer',
    PROPOSER: 'Proposer',
    GUARDIAN: 'Guardian',
    CHALLENGER: 'Challenger',
  },
  nonTemplatePermissions: [
    ...discovery.getMultisigPermission(
      'AdminMultisig',
      'Owner of the ProxyAdmin contract.',
    ),
    {
      name: 'MantaOwner',
      accounts: [discovery.getPermissionedAccount('SystemConfig', 'owner')],
      description:
        'Owner of the SystemConfig and configured as the Challenger and Guardian of the system.',
    },
  ],
  nonTemplateContracts: [],
  nonTemplateEscrows: [],

  milestones: [
    {
      name: 'Manta Pacific Network Launch',
      link: 'https://mantanetwork.medium.com/manta-pacific-mainnet-alpha-launch-743c6bc2b95e',
      date: '2023-09-12T00:00:00Z',
      description: 'Manta Pacific is live on mainnet.',
    },
  ],
  knowledgeNuggets: [],
})
