import { EthereumAddress, formatSeconds, UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { HARDCODED } from '../discovery/values/hardcoded'
import { OPTIMISTIC_ROLLUP_STATE_UPDATES_WARNING } from './common'
import { opStack } from './templates/opStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('rss3')

const upgradeability = {
  upgradableBy: ['ProxyAdmin'],
  upgradeDelay: 'No delay',
}
const FINALIZATION_PERIOD_SECONDS: number = discovery.getContractValue<number>(
  'L2OutputOracle',
  'FINALIZATION_PERIOD_SECONDS',
)

export const rss3: Layer2 = opStack({
  discovery,
  display: {
    name: 'RSS3',
    slug: 'rss3',
    description:
      'The RSS3 Value Sublayer (VSL) as part of the RSS3 Network, is an Ethereum Layer2 built with OP Stack and Celestia DA, handling the value and ownership of AI and Open Information.',
    purposes: ['AI', 'Information'],
    links: {
      websites: ['https://rss3.io'],
      apps: [
        'https://explorer.rss3.io/bridge',
        'https://explorer.rss3.io/nodes',
        'https://explorer.rss3.io/epochs',
        'https://explorer.rss3.io/dsl-scan',
      ],
      documentation: ['https://docs.rss3.io'],
      explorers: ['https://explorer.rss3.io', 'https://scan.rss3.io'],
      repositories: ['https://github.com/rss3-network'],
      socialMedia: [
        'https://twitter.com/rss3_',
        'https://discord.com/invite/rss3-network',
        'https://t.me/rss3_en',
      ],
    },
    activityDataSource: 'Blockchain RPC',
    liveness: {
      warnings: {
        stateUpdates: OPTIMISTIC_ROLLUP_STATE_UPDATES_WARNING,
      },
      explanation: `RSS3 VSL is an Optimistic rollup that posts transaction data to the L1. For a transaction to be considered final, it has to be posted within a tx batch on L1 that links to a previous finalized batch. If the previous batch is missing, transaction finalization can be delayed up to ${formatSeconds(
        HARDCODED.OPTIMISM.SEQUENCING_WINDOW_SECONDS,
      )} or until it gets published. The state root gets finalized ${formatSeconds(
        FINALIZATION_PERIOD_SECONDS,
      )} after it has been posted.`,
    },
    finality: {
      finalizationPeriod: FINALIZATION_PERIOD_SECONDS,
    },
  },
  upgradeability,
  l1StandardBridgeEscrow: discovery.getContract('L1StandardBridge').address,
  rpcUrl: 'https://rpc.rss3.io/',
  chainConfig: {
    name: 'rss3',
    chainId: 12553,
    explorerUrl: 'https://scan.rss3.io/',
    explorerApi: {
      url: 'https://scan.rss3.io/api',
      type: 'blockscout',
    },
    minTimestampForTvl: UnixTime.fromDate(new Date('2024-03-08T00:41:59Z')),
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 14193,
        version: '3',
      },
    ],
  },
  finality: {
    type: 'OPStack',
    lag: 0,
  },
  genesisTimestamp: new UnixTime(1709858519),
  l2OutputOracle: discovery.getContract('L2OutputOracle'),
  portal: discovery.getContract('OptimismPortal'),
  nonTemplatePermissions: [
    {
      name: 'SystemConfig Owner.',
      description:
        'Account priviliged to change System Config parameters such as Sequencer Address and gas limit.',
      accounts: [discovery.getPermissionedAccount('SystemConfig', 'owner')],
    },
  ],
  nonTemplateContracts: [
    discovery.getContractDetails('L1StandardBridge', {
      description: 'The L1 Bridge to VSL.',
      ...upgradeability,
    }),
  ],
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: EthereumAddress('0x4cbab69108Aa72151EDa5A3c164eA86845f18438'),
      name: 'RSS3 Token on Ethereum mainnet',
      description: '',
      tokens: ['RSS3'],
    }),
  ],
  isNodeAvailable: false,
  milestones: [
    {
      name: 'RSS3 Mainnet Launch',
      link: 'https://x.com/rss3_/status/1767370007275851789',
      date: '2024-03-12T00:00:00Z',
      description: 'RSS3 Network mainnet is live.',
    },
  ],
  roleOverrides: {
    batcherHash: 'Sequencer',
    PROPOSER: 'Proposer',
    GUARDIAN: 'Guardian',
    CHALLENGER: 'Challenger',
  },
  knowledgeNuggets: [],
})
