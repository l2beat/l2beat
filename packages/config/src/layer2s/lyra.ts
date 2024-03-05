import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { CELESTIA_DA_PROVIDER, opStack } from './templates/opStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('lyra')

const upgradeability = {
  upgradableBy: ['ProxyAdmin'],
  upgradeDelay: 'No delay',
}

const FINALIZATION_PERIOD_SECONDS: number = discovery.getContractValue<number>(
  'L2OutputOracle',
  'FINALIZATION_PERIOD_SECONDS',
)

export const lyra: Layer2 = opStack({
  daProvider: CELESTIA_DA_PROVIDER,
  discovery,
  display: {
    name: 'Lyra',
    slug: 'lyra',
    description:
      'Lyra Chain is an L2 scaling solution built using OP Stack specially for Lyra protocol - a settlement protocol for spot, perpetuals, and options trading.',
    purposes: ['Exchange'],
    links: {
      websites: ['https://lyra.finance/'],
      apps: ['https://lyra.finance/portfolio'],
      documentation: ['https://docs.lyra.finance/docs/introduction'],
      explorers: ['https://explorer.lyra.finance/'],
      repositories: ['https://github.com/lyra-finance/v2-core'],
      socialMedia: [
        'https://twitter.com/lyrafinance',
        'https://discord.gg/Lyra',
      ],
    },
    activityDataSource: 'Blockchain RPC',
    finality: {
      finalizationPeriod: FINALIZATION_PERIOD_SECONDS,
    },
  },
  upgradeability,
  l1StandardBridgeEscrow: EthereumAddress(
    '0x61E44dC0dae6888B5a301887732217d5725B0bFf',
  ),
  rpcUrl: 'https://rpc.lyra.finance',
  finality: {
    type: 'OPStack',
    lag: 0,
  },
  genesisTimestamp: new UnixTime(1700022479),
  l2OutputOracle: discovery.getContract('L2OutputOracle'),
  portal: discovery.getContract('OptimismPortal'),
  // stateDerivation: DERIVATION.OPSTACK('LYRA'),
  isNodeAvailable: 'UnderReview',
  milestones: [
    {
      name: 'Lyra V2 live on mainnet',
      link: 'https://x.com/lyrafinance/status/1735516929341980748',
      date: '2023-12-15T00:00:00Z',
      description: 'Lyra V2 launches on Mainnet.',
    },
    {
      name: 'Lyra switches to Celestia',
      link: 'https://x.com/lyrafinance/status/1750235026136965260',
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
      'LyraMultisig',
      'This address is the owner of the following contracts: ProxyAdmin, SystemConfig. It can upgrade the bridge implementation potentially gaining access to all funds, and change the sequencer, state root proposer or any other system component (unlimited upgrade power).',
    ),
    ...discovery.getMultisigPermission(
      'ChallengerMultisig',
      'This address is the permissioned challenger of the system. It can delete non finalized roots without going through the fault proof process. It is also designated as a Guardian of the OptimismPortal, meaning it can halt withdrawals.',
    ),
  ],
  nonTemplateContracts: [
    discovery.getContractDetails('L1ERC721Bridge', {
      description:
        'The L1ERC721Bridge contract is the main entry point to deposit ERC721 tokens from L1 to L2.',
      ...upgradeability,
    }),
  ],
  nonTemplateEscrows: [],
  chainConfig: {
    name: 'lyra',
    chainId: 957,
    explorerUrl: 'https://explorer.lyra.finance',
    explorerApi: {
      url: 'https://explorer.lyra.finance/api',
      type: 'blockscout',
    },
    // ~ Timestamp of block number 0 on Lyra
    // https://explorer.lyra.finance/block/0
    minTimestampForTvl: UnixTime.fromDate(new Date('2023-11-15T04:13:35Z')),
    multicallContracts: [
      {
        sinceBlock: 1935198,
        batchSize: 150,
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        version: '3',
      },
    ],
  },
})
