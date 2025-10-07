import {
  ChainSpecificAddress,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { DERIVATION, ESCROW, REASON_FOR_BEING_OTHER } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { opStackL2 } from '../../templates/opStack'

const discovery = new ProjectDiscovery('soneium')
const genesisTimestamp = UnixTime(1733498411)

export const soneium = opStackL2({
  ecosystemInfo: {
    id: ProjectId('superchain'),
    isPartOfSuperchain: true,
  },
  addedAt: UnixTime(1736812800), // 14.01.2025
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
      bridges: ['https://bridge.soneium.org/'],
      documentation: ['https://docs.soneium.org/docs/builders/overview'],
      explorers: ['https://soneium.blockscout.com/'],
      repositories: ['https://github.com/Soneium'],
      socialMedia: [
        'https://x.com/soneium',
        'https://t.me/SoneiumOfficial',
        'https://discord.gg/rWWPBHug9w',
      ],
      rollupCodes: 'https://rollup.codes/soneium',
    },
  },
  hasSuperchainScUpgrades: true,
  isNodeAvailable: 'UnderReview',
  stateDerivation: DERIVATION.OPSTACK('SONEIUM'),
  chainConfig: {
    name: 'soneium',
    chainId: 1868,
    explorerUrl: 'https://soneium.blockscout.com',
    coingeckoPlatform: 'soneium',
    sinceTimestamp: UnixTime(1733134751),
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 1,
        version: '3',
      },
    ],
    apis: [
      { type: 'rpc', url: 'https://rpc.soneium.org/', callsPerMinute: 300 },
      { type: 'blockscout', url: 'https://soneium.blockscout.com/api' },
      { type: 'blockscoutV2', url: 'https://soneium.blockscout.com/api/v2' },
    ],
  },
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: ChainSpecificAddress(
        'eth:0xC67A8c5f22b40274Ca7C4A56Db89569Ee2AD3FAb',
      ),
      name: 'Custom USDC Escrow',
      ...ESCROW.CANONICAL_EXTERNAL,
      description:
        'Custom externally governed escrow for USDC bridged to Soneium.',
      tokens: ['USDC'],
    }),
    discovery.getEscrowDetails({
      address: ChainSpecificAddress(
        'eth:0x2F543A7C9cc80Cc2427c892B96263098d23ee55a',
      ),
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
