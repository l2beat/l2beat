import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import {
  DA_BRIDGES,
  DA_LAYERS,
  REASON_FOR_BEING_OTHER,
  RISK_VIEW,
} from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { polygonCDKStack } from '../../templates/polygonCDKStack'
import { PolygoncdkDAC } from '../../templates/polygoncdk-template'

const discovery = new ProjectDiscovery('penchain')
const bridge = discovery.getContract('AgglayerBridge')

const membersCountDAC = discovery.getContractValue<number>(
  'PolygonDataCommittee',
  'getAmountOfMembers',
)

const requiredSignaturesDAC = discovery.getContractValue<number>(
  'PolygonDataCommittee',
  'requiredAmountOfSignatures',
)

const isForcedBatchDisallowed =
  discovery.getContractValue<string>('Validium', 'forceBatchAddress') !==
  '0x0000000000000000000000000000000000000000'

const rollupModuleContract = discovery.getContract('Validium')

export const penchain: ScalingProject = polygonCDKStack({
  addedAt: UnixTime(1740706975),
  additionalPurposes: ['Gaming'],
  additionalBadges: [BADGES.DA.DAC, BADGES.RaaS.Zeeve],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.SMALL_DAC],
  display: {
    name: 'Pentagon Chain',
    slug: 'penchain',
    description:
      'Pentagon Chain is a zkEVM blockchain powered by Agglayer and secured by Ethereum. It is dedicated to mainstream adoption of Web3 gaming, DeFi, and SocialFi.',
    links: {
      websites: ['https://pentagon.games/pentagon-chain'],
      bridges: ['https://bridge.pentagon.games'],
      explorers: ['https://explorer.pentagon.games'],
      socialMedia: [
        'https://x.com/pentagonchain',
        'https://discord.gg/pentagongamesXP',
        'https://youtube.com/@PentagonGamesXP',
        'https://linkedin.com/company/pentagongames',
        'https://x.com/pentagongamesxp',
        'https://t.me/PentagonGamesXP',
      ],
    },
  },
  discovery,
  daProvider: {
    layer: DA_LAYERS.DAC,
    bridge: DA_BRIDGES.DAC_MEMBERS({
      requiredSignatures: requiredSignaturesDAC,
      membersCount: membersCountDAC,
    }),
    riskView: RISK_VIEW.DATA_EXTERNAL_DAC({
      membersCount: membersCountDAC,
      requiredSignatures: requiredSignaturesDAC,
    }),
    technology: {
      name: 'Data is not stored on chain',
      description:
        'The transaction data is not recorded on the Ethereum main chain. Transaction data is stored off-chain and only the hashes are posted onchain by the Sequencer, after being signed by the DAC members.',
      risks: [
        {
          category: 'Funds can be lost if',
          text: 'the external data becomes unavailable.',
          isCritical: true,
        },
      ],
      references: [
        {
          title:
            'PolygonValidiumEtrog.sol - Etherscan source code, sequenceBatchesValidium function',
          url: 'https://etherscan.io/address//0x427113ae6F319BfFb4459bfF96eb8B6BDe1A127F#code#F1#L91',
        },
      ],
    },
  },
  rollupModuleContract,
  rollupVerifierContract: discovery.getContract('Verifier'),
  isForcedBatchDisallowed,
  chainConfig: {
    name: 'penchain',
    chainId: 3344,
    gasTokens: ['PC'],
    explorerUrl: 'https://explorer.pentagon.games',
    sinceTimestamp: UnixTime(1740743363),
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.pentagon.games',
        callsPerMinute: 3000,
      },
    ],
  },
  associatedTokens: ['PC'],
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: bridge.address,
      tokens: '*',
      sharedEscrow: {
        type: 'AggLayer',
        nativeAsset: 'etherWrapped',
        wethAddress: EthereumAddress(
          '0x5A77f1443D16ee5761d310e38b62f77f726bC71c',
        ),
        tokensToAssignFromL1: ['PC'],
      },
    }),
  ],
  milestones: [
    // {
    //   title: 'Mainnet Launch',
    //   url: 'https://x.com/PentagonChain/status/1942909180932718920', // TODO: almost
    //   date: '2025-01-29',
    //   description: 'Pentagon Chain mainnet is live.',
    //   type: 'general',
    // },
  ],
  customDa: PolygoncdkDAC({
    dac: {
      requiredMembers: requiredSignaturesDAC,
      membersCount: membersCountDAC,
    },
  }),
})
