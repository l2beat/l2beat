import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'

import { REASON_FOR_BEING_OTHER } from '../../common'
import { ESCROW } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Layer2 } from '../../types'
import { Badge } from '../badges'
import { AnytrustDAC } from '../da-beat/templates/anytrust-template'
import { orbitStackL2 } from './templates/orbitStack'

const discovery = new ProjectDiscovery('real')

export const real: Layer2 = orbitStackL2({
  addedAt: new UnixTime(1717598702), // 2024-06-05T14:45:02Z
  discovery,
  additionalBadges: [Badge.DA.DAC, Badge.RaaS.Gelato],
  additionalPurposes: ['RWA'],
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.CLOSED_PROOFS,
    REASON_FOR_BEING_OTHER.SMALL_DAC,
  ],
  display: {
    name: 'Re.al',
    slug: 'real',
    description:
      'Re.al is an Arbitrum Orbit stack L2 with AnyTrust data availability, focusing on Real World Assets.',
    links: {
      websites: ['https://re.al'],
      apps: ['https://re.al/bridge/', 'https://re.al/app/bridge/'],
      documentation: ['https://docs.re.al/'],
      explorers: ['https://explorer.re.al'],
      repositories: ['https://github.com/re-al-Foundation'],
      socialMedia: [
        'https://x.com/real_rwa',
        'https://discord.gg/cKCCCFXvWj',
        'https://mirror.xyz/0xBE105a62f39a2E0b09772C49E3EcF6ef21BEd85C',
      ],
    },
  },
  chainConfig: {
    name: 'real',
    chainId: 111188,
    explorerUrl: 'https://explorer.re.al',
    explorerApi: {
      url: 'https://explorer.re.al/api',
      type: 'blockscout',
    },
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 695,
        version: '3',
      },
    ],
    minTimestampForTvl: new UnixTime(1710580715),
    coingeckoPlatform: 're-al',
  },
  associatedTokens: ['RWA'], // native token reETH not on coingecko yet
  isNodeAvailable: 'UnderReview',
  bridge: discovery.getContract('ERC20Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  rpcUrl: 'https://real.drpc.org',
  // gasTokens: ['reETH'], // not on coingecko yet
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: EthereumAddress('0xfC89B875970122E24C6C5ADd4Dea139443943ea7'),
      tokens: '*',
      description:
        "Default Gateway for non-native tokens. On depositing, a generic 'wrapped' version of the escrowed token is minted on the L2.",
    }),
    discovery.getEscrowDetails({
      address: EthereumAddress('0x679D4C1cC6855C57726BEA1784F578315d6431f6'),
      tokens: ['stETH'],
      ...ESCROW.CANONICAL_EXTERNAL,
      description:
        'This contract escrows the stETH that was deposited to mint reETH.',
    }),
  ],
  milestones: [
    {
      title: 'Re.al Mainnet Launch',
      url: 'https://mirror.xyz/0xBE105a62f39a2E0b09772C49E3EcF6ef21BEd85C/FL4Ewx3CKsFEfMFsU7DZ-cIdhZc05aChfASQ1t-SQ-A',
      date: '2024-05-15T00:00:00Z',
      description:
        'Re.al launches its mainnet with some initial dapps deployed.',
      type: 'general',
    },
    {
      title: 'Arcana Launch',
      url: 'https://mirror.xyz/0xBE105a62f39a2E0b09772C49E3EcF6ef21BEd85C/t3MsS-cCeJJD4ljXgQef3U01t564VL2h_au6iM6rBk4',
      date: '2024-05-15T00:00:00Z',
      description:
        'Arcana launches their platform for rebasing, delta-neutral yields on re.al.',
      type: 'general',
    },
    {
      title: 'RWA Token Launch',
      url: 'https://mirror.xyz/0xBE105a62f39a2E0b09772C49E3EcF6ef21BEd85C/eUmaidSfGSsjKKzepfyus6YSMog_FRdAQ6q5bsRoF7Y',
      date: '2024-05-15T00:00:00Z',
      description: 'Re.al launches the RWA token and its governance protocol.',
      type: 'general',
    },
  ],
  customDa: AnytrustDAC({ discovery }),
})
