import { ChainSpecificAddress, UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { AnytrustDAC } from '../../templates/anytrust-template'
import { orbitStackL3 } from '../../templates/orbitStack'

const discovery = new ProjectDiscovery('educhain')

export const educhain: ScalingProject = orbitStackL3({
  addedAt: UnixTime(1737072000), // 2025-01-17T00:00:00Z
  hostChain: 'arbitrum',
  discovery,
  additionalBadges: [BADGES.L3ParentChain.Arbitrum, BADGES.RaaS.Gelato],
  additionalPurposes: ['Social'],
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.CLOSED_PROOFS,
    REASON_FOR_BEING_OTHER.SMALL_DAC,
  ],
  display: {
    name: 'EDU Chain',
    slug: 'edu-chain',
    description:
      'EDU Chain is Layer 3 on Arbitrum, built on the Orbit stack. It is designed to onboard real-world educational economies to the blockchain and establish an innovative “Learn Own Earn” model for education.',
    links: {
      websites: ['https://educhain.xyz/'],
      bridges: ['https://bridge.gelato.network/bridge/edu-chain'],
      documentation: [
        'https://userdocs.opencampus.xyz/edu-chain/introduction',
        'https://devdocs.opencampus.xyz/open-campus',
      ],
      explorers: ['https://educhain.blockscout.com/'],
      repositories: ['https://github.com/opencampus-xyz'],
      socialMedia: [
        'https://x.com/educhain_xyz',
        'https://medium.com/edu-chain',
      ],
    },
  },
  chainConfig: {
    name: 'educhain',
    chainId: 41923,
    coingeckoPlatform: 'edu-chain',
    sinceTimestamp: UnixTime(1721987935),
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.edu-chain.raas.gelato.cloud',
        callsPerMinute: 1500,
      },
    ],
    gasTokens: ['EDU'],
  },
  associatedTokens: ['EDU'],
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: ChainSpecificAddress(
        'arb1:0x419e439e5c0B839d6e31d7C438939EEE1A4f4184',
      ),
      name: 'StandardGateway',
      description:
        'Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination.',
      tokens: '*',
    }),
    discovery.getEscrowDetails({
      address: ChainSpecificAddress(
        'arb1:0xDd7A9dEcBB0b16B37fE6777e245b18fC0aC63759',
      ),
      name: 'CustomGateway',
      description:
        'Escrows deposited assets for the canonical bridge that are externally governed or need custom token contracts with e.g. minting rights or upgradeability.',
      tokens: '*',
    }),
  ],
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  milestones: [
    {
      title: 'Mainnet Launch',
      url: 'https://medium.com/edu-chain', //TODO
      date: '2025-01-17T00:00:00Z',
      description: 'Educhain L3 opens its mainnet to all users.',
      type: 'general',
    },
  ],
  customDa: AnytrustDAC({ discovery, hostChain: 'arbitrum' }),
})
