import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { DERIVATION, REASON_FOR_BEING_OTHER } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { opStackL2 } from './templates/opStack'

const discovery = new ProjectDiscovery('soneium')
const genesisTimestamp = new UnixTime(1733498411)

export const soneium = opStackL2({
  addedAt: new UnixTime(1724842746),
  discovery,
  genesisTimestamp,
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.CLOSED_PROOFS],
  display: {
    name: 'Soneium',
    slug: 'soneium',
    stateValidationImage: 'opfp',
    description:
      'Soneium is an Optimistic rollup based on the OP Stack. It is built by Sony Block Solutions Labs and planned to stand as a versatile, general-purpose blockchain.',
    links: {
      websites: ['https://soneium.org/en/'],
      apps: ['https://bridge.soneium.org/'],
      documentation: ['https://docs.soneium.org/docs/builders/overview'],
      explorers: ['https://soneium.blockscout.com/'],
      repositories: ['https://github.com/Soneium'],
      socialMedia: [
        'https://x.com/soneium',
        'https://t.me/SoneiumOfficial',
        'https://discord.gg/rWWPBHug9w',
      ],
    },
  },
  rpcUrl: 'https://rpc.soneium.org/',
  finality: {
    type: 'OPStack',
    minTimestamp: new UnixTime(1733134753),
    genesisTimestamp: new UnixTime(1733134753),
    l2BlockTimeSeconds: 2,
    lag: 0,
    stateUpdate: 'disabled',
  },
  isNodeAvailable: 'UnderReview',
  stateDerivation: DERIVATION.OPSTACK('SONEIUM'),
  discoveryDrivenData: true,
  chainConfig: {
    name: 'soneium',
    chainId: 1868,
    blockscoutV2ApiUrl: 'https://soneium.blockscout.com/api/v2',
    explorerUrl: 'https://soneium.blockscout.com/',
    explorerApi: {
      url: 'https://soneium.blockscout.com/api',
      type: 'blockscout',
    },
    minTimestampForTvl: new UnixTime(1733134751),
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 1,
        version: '3',
      },
    ],
  },
  milestones: [
    {
      title: 'Soneium RPC providers censor IP-infringing tokens',
      url: 'https://x.com/donnoh_eth/status/1879210463952818472',
      date: '2025-01-14T00:00:00Z',
      description:
        'RPC providers blacklist certain tokens - can still be used by self-hosting or forcing txs from L1.',
      type: 'incident',
    },
    {
      title: 'Soneium Launch',
      url: 'https://x.com/soneium/status/1878988222866350348',
      date: '2025-01-14T00:00:00Z',
      description: 'Soneium is live on Ethereum mainnet.',
      type: 'general',
    },
  ],
  hasProperSecurityCouncil: true,
})
