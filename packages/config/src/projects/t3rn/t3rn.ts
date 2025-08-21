import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { BADGES } from '../../common/badges'
import type { ScalingProject } from '../../internalTypes'
import { underReviewL3 } from '../../templates/underReview'

export const t3rn: ScalingProject = underReviewL3({
  id: 't3rn',
  capability: 'universal',
  addedAt: UnixTime(1737637200), // 2025-01-23T15:00:00Z
  hostChain: ProjectId('arbitrum'), // t3rn operates as L3 across multiple chains
  badges: [
    BADGES.RaaS.Caldera,
    BADGES.VM.EVM,
    BADGES.DA.EthereumCalldata,
    BADGES.L3ParentChain.Arbitrum,
  ],
  display: {
    name: 't3rn',
    slug: 't3rn',
    category: 'Optimium', // Cross-chain execution protocol
    stacks: [], // Custom stack - not based on standard stacks
    description:
      't3rn is a Universal Execution Protocol that enables smart contracts to call and compose across multiple blockchains atomically with fail-safe interoperable execution.',
    purposes: ['Interoperability'],
    links: {
      websites: ['https://t3rn.io/'],
      bridges: ['https://bridge.t3rn.io/'],
      documentation: ['https://docs.t3rn.io/'],
      explorers: ['https://explorer.t3rn.io/'],
      socialMedia: ['https://x.com/t3rn_io', 'https://github.com/t3rn/t3rn'],
    },
  },
  chainConfig: {
    name: 't3rn',
    gasTokens: ['TRN'],
    chainId: 819, // 0x333 in decimal
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.t3rn.io/http',
        callsPerMinute: 1500,
      },
    ],
  },
  escrows: [
    // TRN Token Contracts on various chains
    {
      address: EthereumAddress('0x1114982539A2Bfb84e8B9e4e320bbC04532a9e44'), // TRN token on Arbitrum
      sinceTimestamp: UnixTime(1753909200), // 2025-07-31 (mainnet launch)
      tokens: ['TRN'],
      chain: 'arbitrum',
    },
    {
      address: EthereumAddress('0xeECEC063D5ea592A49340437a8C59A624Fa79159'), // TRN token on Base
      sinceTimestamp: UnixTime(1753909200), // 2025-07-31 (mainnet launch)
      tokens: ['TRN'],
      chain: 'base',
    },
    {
      address: EthereumAddress('0x60bB07a76E7b6FA37110B5045752054Af4f5015F'), // TRN token on Optimism
      sinceTimestamp: UnixTime(1753909200), // 2025-07-31 (mainnet launch)
      tokens: ['TRN'],
      chain: 'optimism',
    },
    // Staking Contract on Arbitrum
    {
      address: EthereumAddress('0xC5a87664DCFD45B1bF646cFD209c5a54118B146B'), // stakedTRNChef on Arbitrum
      sinceTimestamp: UnixTime(1753909200), // 2025-07-31 (mainnet launch)
      tokens: ['TRN'],
      chain: 'arbitrum',
    },
    // Cross-chain escrow contracts
    {
      address: EthereumAddress('0xeC58f7E545AE2721B70ce90F1779Ccb4678dc106'), // escrowGMP on Arbitrum
      sinceTimestamp: UnixTime(1753909200), // 2025-07-31 (mainnet launch)
      tokens: '*',
      chain: 'arbitrum',
    },
    {
      address: EthereumAddress('0x3F305740E3f7650cA3EaD2597fEB785fa07d621F'), // remoteOrder on Arbitrum
      sinceTimestamp: UnixTime(1753909200), // 2025-07-31 (mainnet launch)
      tokens: '*',
      chain: 'arbitrum',
    },
    {
      address: EthereumAddress('0xeC58f7E545AE2721B70ce90F1779Ccb4678dc106'), // escrowGMP on Base
      sinceTimestamp: UnixTime(1753909200), // 2025-07-31 (mainnet launch)
      tokens: '*',
      chain: 'base',
    },
    {
      address: EthereumAddress('0xF1D550eA864a29c277602fdA2683E48ff52614eC'), // remoteOrder on Base
      sinceTimestamp: UnixTime(1753909200), // 2025-07-31 (mainnet launch)
      tokens: '*',
      chain: 'base',
    },
    {
      address: EthereumAddress('0xeC58f7E545AE2721B70ce90F1779Ccb4678dc106'), // escrowGMP on Optimism
      sinceTimestamp: UnixTime(1753909200), // 2025-07-31 (mainnet launch)
      tokens: '*',
      chain: 'optimism',
    },
    {
      address: EthereumAddress('0xbf0C855e8A93930432D21dF08b3C534895650f7f'), // remoteOrder on Optimism
      sinceTimestamp: UnixTime(1753909200), // 2025-07-31 (mainnet launch)
      tokens: '*',
      chain: 'optimism',
    },
  ],
  activityConfig: {
    type: 'block',
    startBlock: 1,
    adjustCount: { type: 'SubtractOne' },
  },
})
