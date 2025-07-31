import {
  ChainSpecificAddress,
  EthereumAddress,
  UnixTime,
} from '@l2beat/shared-pure'
import { ESCROW, REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { AnytrustDAC } from '../../templates/anytrust-template'
import { orbitStackL2 } from '../../templates/orbitStack'

const discovery = new ProjectDiscovery('real')

export const real: ScalingProject = orbitStackL2({
  addedAt: UnixTime(1715731200), // 2024-05-15T00:00:00Z
  discovery,
  additionalBadges: [BADGES.RaaS.Gelato],
  additionalPurposes: ['RWA'],
  archivedAt: UnixTime(1750747670), //2025-06-24T06:47:50Z
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.CLOSED_PROOFS,
    REASON_FOR_BEING_OTHER.SMALL_DAC,
  ],
  display: {
    name: 'Re.al',
    slug: 'real',
    redWarning:
      "re.al halted block production and state updates on June 20, 2025 without prior notice. If state updates are not resumed, the state proposer whitelist gets dropped and anyone can propose state updates. If this happens, but the DAC doesn't serve the necessary data, funds can be compromised as there is no way to challenge invalid state roots.",
    description:
      'Re.al is an Arbitrum Orbit stack L2 with AnyTrust data availability, focusing on Real World Assets.',
    links: {
      websites: ['https://re.al'],
      bridges: ['https://re.al/bridge/', 'https://re.al/app/bridge/'],
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
  untrackedGasTokens: ['reETH'],
  chainConfig: {
    name: 'real',
    chainId: 111188,
    explorerUrl: 'https://explorer.re.al',
    gasTokens: ['reETH'],
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 695,
        version: '3',
      },
    ],
    sinceTimestamp: UnixTime(1710580715),
    coingeckoPlatform: 're-al',
    apis: [
      {
        type: 'rpc',
        url: 'https://tangible-real.gateway.tenderly.co/',
        callsPerMinute: 3000,
      },
      { type: 'blockscout', url: 'https://explorer.re.al/api' },
    ],
  },
  isNodeAvailable: 'UnderReview',
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: ChainSpecificAddress(
        'eth:0xfC89B875970122E24C6C5ADd4Dea139443943ea7',
      ),
      tokens: '*',
      description:
        "Default Gateway for non-native tokens. On depositing, a generic 'wrapped' version of the escrowed token is minted on the L2.",
    }),
    discovery.getEscrowDetails({
      address: ChainSpecificAddress(
        'eth:0x679D4C1cC6855C57726BEA1784F578315d6431f6',
      ),
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
    {
      title: 'Re.al Halts Block Production',
      date: '2025-06-20T00:00:00Z',
      description:
        'Re.al halted block production and state updates without prior notice.',
      type: 'incident',
      url: 'https://x.com/donnoh_eth/status/1937136543195398578',
    },
  ],
  customDa: AnytrustDAC({ discovery, hostChain: 'ethereum' }),
})
