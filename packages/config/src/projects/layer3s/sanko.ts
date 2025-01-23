import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { CONTRACTS } from '../../common'
import { REASON_FOR_BEING_OTHER } from '../../common/ReasonForBeingInOther'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { AnytrustDAC } from '../da-beat/templates/anytrust-template'
import { orbitStackL3 } from '../layer2s/templates/orbitStack'
import type { Layer3 } from './types'

const discovery = new ProjectDiscovery('sanko', 'arbitrum')

export const sanko: Layer3 = orbitStackL3({
  createdAt: new UnixTime(1716893370), // 2024-05-28T10:49:30Z
  discovery,
  additionalBadges: [
    Badge.DA.DAC,
    Badge.L3ParentChain.Arbitrum,
    Badge.RaaS.Caldera,
  ],
  additionalPurposes: ['Gaming', 'Social'],
  hostChain: ProjectId('arbitrum'),
  display: {
    reasonsForBeingOther: [
      REASON_FOR_BEING_OTHER.CLOSED_PROOFS,
      REASON_FOR_BEING_OTHER.SMALL_DAC,
    ],
    name: 'Sanko',
    slug: 'sanko',
    description:
      'Sanko is an NFT and gaming-focused Orbit stack L3 on Arbitrum with AnyTrust DA and DMT as its native token, created by Sanko GameCorp.',
    links: {
      websites: ['https://sanko.xyz/'],
      apps: ['https://sanko.xyz/bridge', 'https://swap.sanko.xyz'],
      documentation: ['https://sanko-1.gitbook.io/sanko-mainnet-docs/'],
      explorers: [
        'https://sanko-mainnet.calderaexplorer.xyz/',
        'https://tools.sanko.xyz/',
        'https://explorer.sanko.xyz/',
      ],
      repositories: [],
      socialMedia: [
        'https://x.com/SankoGameCorp',
        'https://discord.gg/Cnz62Vfa2C',
        'https://t.me/sankogamecorp',
      ],
    },
  },
  chainConfig: {
    name: 'sanko',
    chainId: 1996,
    explorerUrl: 'https://explorer.sanko.xyz/',
    explorerApi: {
      url: 'https://explorer.sanko.xyz/api',
      type: 'blockscout',
    },
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 38,
        version: '3',
      },
    ],
    minTimestampForTvl: new UnixTime(1712970000),
    coingeckoPlatform: 'sanko',
  },
  gasTokens: ['DMT'],
  associatedTokens: ['DMT'],
  rpcUrl: 'https://mainnet.sanko.xyz',
  bridge: discovery.getContract('ERC20Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  discoveryDrivenData: true,
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      includeInTotal: false,
      address: EthereumAddress('0xb4951c0C41CFceB0D195A95FE66280457A80a990'),
      tokens: '*',
      description:
        'Main entry point for users depositing ERC20 tokens. Upon depositing, on L2 a generic, "wrapped" token will be minted.',
    }),
  ],
  nonTemplateContractRisks: [
    {
      category: 'Funds can be stolen if',
      text: 'the security stack of the whitelisted LayerZero adapter changes or is compromised.',
      isCritical: true,
    },
    CONTRACTS.UPGRADE_NO_DELAY_RISK,
  ],
  dataAvailabilitySolution: AnytrustDAC({
    bridge: {
      createdAt: new UnixTime(1723211933), // 2024-08-09T13:58:53Z
    },
    discovery,
  }),
})
