import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { ESCROW } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Layer3 } from '../../types'
import { Badge } from '../badges'
import { AnytrustDAC } from '../da-beat/templates/anytrust-template'
import { orbitStackL3 } from '../layer2s/templates/orbitStack'

const discovery = new ProjectDiscovery('educhain', 'arbitrum')

export const educhain: Layer3 = orbitStackL3({
  addedAt: new UnixTime(1720082709), // 2024-07-04T08:45:09Z
  discovery,
  additionalBadges: [
    Badge.DA.DAC,
    Badge.L3ParentChain.Arbitrum,
    Badge.RaaS.Gelato,
  ],
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
      apps: ['https://bridge.gelato.network/bridge/edu-chain'],
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
  rpcUrl: 'https://rpc.edu-chain.raas.gelato.cloud',
  associatedTokens: ['EDU'],
  gasTokens: ['EDU'],
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: EthereumAddress('0x419e439e5c0B839d6e31d7C438939EEE1A4f4184'),
      name: 'StandardGateway',
      description:
        'Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination.',
      tokens: '*',
    }),
    discovery.getEscrowDetails({
      address: EthereumAddress('0xDd7A9dEcBB0b16B37fE6777e245b18fC0aC63759'),
      name: 'CustomGateway',
      description:
        'Escrows deposited assets for the canonical bridge that are externally governed or need custom token contracts with e.g. minting rights or upgradeability.',
      ...ESCROW.CANONICAL_EXTERNAL,
      tokens: '*',
    }),
  ],
  bridge: discovery.getContract('ERC20Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  milestones: [
    {
      title: 'Mainnet launch',
      url: 'https://medium.com/edu-chain', //TODO
      date: '2025-01-17T00:00:00Z',
      description: 'Educhain L3 opens its mainnet to all users.',
      type: 'general',
    },
  ],
  customDa: AnytrustDAC({ discovery }),
})
