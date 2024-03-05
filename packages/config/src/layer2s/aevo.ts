import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'

import { subtractOne } from '../common/assessCount'
import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { CELESTIA_DA_PROVIDER, opStack } from './templates/opStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('aevo')

const upgradeability = {
  upgradableBy: ['ProxyAdmin'],
  upgradeDelay: 'No delay',
}

export const aevo: Layer2 = opStack({
  daProvider: CELESTIA_DA_PROVIDER,
  discovery,
  display: {
    name: 'Aevo',
    slug: 'aevo',
    warning:
      'Fraud proof system is currently under development. Users need to trust the block proposer to submit correct L1 state roots.',
    description:
      'Aevo is a high-performance decentralized options exchange, powered by the OP Stack and Celestia DA.',
    purposes: ['Exchange'],
    links: {
      websites: ['https://aevo.xyz/'],
      apps: ['https://app.aevo.xyz/'],
      documentation: ['https://docs.aevo.xyz/'],
      explorers: ['https://explorer.aevo.xyz/'],
      repositories: ['https://github.com/aevoxyz'],
      socialMedia: ['https://twitter.com/aevoxyz'],
    },
    activityDataSource: 'Blockchain RPC',
  },
  chainConfig: {
    name: 'aevo',
    chainId: 2999,
    explorerUrl: 'https://explorer.aevo.xyz',
    explorerApi: {
      url: 'https://explorer.aevo.xyz/api',
      type: 'blockscout',
    },
    multicallContracts: [
      {
        sinceBlock: 2790111,
        batchSize: 150,
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        version: '3',
      },
    ],
    minTimestampForTvl: UnixTime.fromDate(new Date('2023-09-05T03:00:00Z')),
  },
  upgradeability,
  l1StandardBridgeEscrow: EthereumAddress(
    '0x4082C9647c098a6493fb499EaE63b5ce3259c574',
  ),
  transactionApi: {
    type: 'rpc',
    startBlock: 1,
    defaultCallsPerMinute: 800,
    assessCount: subtractOne,
  },
  genesisTimestamp: new UnixTime(1679202395),
  l2OutputOracle: discovery.getContract('L2OutputOracle'),
  portal: discovery.getContract('OptimismPortal'),
  isNodeAvailable: false,
  milestones: [
    {
      name: 'Aevo Open Mainnet Launch',
      link: 'https://aevo.mirror.xyz/hV7VYkpk7caoYl2DbOFcSaZRRrK-8NeWqKczrgUff6k',
      date: '2023-06-14T00:00:00.00Z',
      description:
        'Aevo removed the whitelist and opened the mainnet to the public.',
    },
    {
      name: 'Aevo switches to Celestia',
      link: 'https://twitter.com/aevoxyz/status/1750013642278633510',
      date: '2024-01-16T00:00:00.00Z',
    },
  ],
  knowledgeNuggets: [],
  roleOverrides: {
    batcherHash: 'Sequencer',
    PROPOSER: 'Proposer',
    GUARDIAN: 'Guardian',
    CHALLENGER: 'Challenger',
  },
  nonTemplatePermissions: [
    ...discovery.getMultisigPermission(
      'AevoMultiSig',
      'This address is the owner of the following contracts: ProxyAdmin, SystemConfig. It is also designated as a Guardian of the OptimismPortal, meaning it can halt withdrawals. It can upgrade the bridge implementation potentially gaining access to all funds, and change the sequencer, state root proposer or any other system component (unlimited upgrade power).',
    ),
  ],
  nonTemplateContracts: [],
  nonTemplateEscrows: [],
})
