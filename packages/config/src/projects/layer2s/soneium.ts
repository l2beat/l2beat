import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { DERIVATION, ESCROW, REASON_FOR_BEING_OTHER } from '../../common'
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
    tvlWarning: {
      value:
        'The total TVS doublecounts underlying assets for solvBTC.BBN and solvBTC since they are locked on Soneium. We are working on a fix.',
      sentiment: 'warning',
    },
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
  chainConfig: {
    name: 'soneium',
    chainId: 1868,
    blockscoutV2ApiUrl: 'https://soneium.blockscout.com/api/v2',
    explorerUrl: 'https://soneium.blockscout.com',
    coingeckoPlatform: 'soneium',
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
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: EthereumAddress('0xC67A8c5f22b40274Ca7C4A56Db89569Ee2AD3FAb'),
      name: 'Custom USDC Escrow',
      ...ESCROW.CANONICAL_EXTERNAL,
      description:
        'Custom externally governed escrow for USDC bridged to Soneium.',
      tokens: ['USDC'],
    }),
    discovery.getEscrowDetails({
      address: EthereumAddress('0x2F543A7C9cc80Cc2427c892B96263098d23ee55a'),
      name: 'Custom (w)stETH Escrow.',
      ...ESCROW.CANONICAL_EXTERNAL,
      description:
        'Custom Lido-governed escrow for bridging (w)stETH via canonical messaging to Soneium.',
      tokens: ['stETH', 'wstETH'],
    }),
  ],
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
