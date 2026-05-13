import {
  ChainSpecificAddress,
  EthereumAddress,
  UnixTime,
} from '@l2beat/shared-pure'
import { CONTRACTS, REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { getAltDaStage } from '../../common/stages/getAltDaStage'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { EIGENDA_DA_PROVIDER, opStackL2 } from '../../templates/opStack'

const discovery = new ProjectDiscovery('roninnetwork')

// L2Migration hardfork activates at Ronin block 55,577,490 on 2026-05-12 ~15:16 UTC
const genesisTimestamp = UnixTime(1778598960)

export const roninNetwork: ScalingProject = opStackL2({
  capability: 'universal',
  addedAt: UnixTime(1754639625),
  discovery,
  genesisTimestamp,
  daProvider: EIGENDA_DA_PROVIDER(false),
  additionalBadges: [BADGES.RaaS.Conduit, BADGES.Other.MigratedFromL1],
  associatedTokens: ['RON'],
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.CLOSED_PROOFS,
    REASON_FOR_BEING_OTHER.NO_DA_ORACLE,
  ],
  display: {
    name: 'Ronin',
    aliases: ['Sky Mavis', 'Axie Infinity'],
    slug: 'ronin-network',
    description:
      'Ronin is an Ethereum Optimium based on the OP Stack, optimized for gaming and NFT applications. It migrated from an independent sidechain to a Layer 2 in May 2026, using EigenDA for data availability and keeping RON as the custom gas token.',
    links: {
      websites: ['https://roninchain.com/'],
      bridges: ['https://app.roninchain.com/bridge'],
      documentation: ['https://docs.roninchain.com/'],
      repositories: [
        'https://github.com/ronin-chain/ronin',
        'https://github.com/axieinfinity',
      ],
      explorers: ['https://app.roninchain.com/explorer'],
      socialMedia: [
        'https://twitter.com/Ronin_Network',
        'https://discord.gg/roninnetwork',
        'https://blog.roninchain.com/',
      ],
    },
  },
  stage: getAltDaStage(
    {
    stage0: {
      callsItselfValidiumOrOptimium: true,
      stateRootsPostedToL1: true,
      stateVerificationOnL1: true,
      daAttestedByIndependentParty: false,
      nodeSourceAvailable: true,
      fraudProofSystemAtLeast5Outsiders: false,
    },
    stage1: {
      principle: false,
      usersCanExitWithoutCooperation: false,
      usersHave7DaysToExit: false,
      securityCouncilProperlySetUp: false,
      daVerifierSecureOnL1: false,
      daVerifier7DayExitWindow: false,
      daCommitteeDecentralized: false,
      noRedTrustedSetups: null,
      proverSourcePublished: null,
      verifierContractsReproducible: null,
      programHashesReproducible: null,
    },
    stage2: {
      fraudProofSystemIsPermissionless: false,
      delayWith30DExitWindow: false,
      proofSystemOverriddenOnlyInCaseOfABug: false,
      daVerifier30DayExitWindow: false,
      daMechanismEconomicSecurity: false,
    },
  },
    {
      nodeSourceLink:
        'https://github.com/conduitxyz/ronin-migration-reth-docker',
    },
  ),
  chainConfig: {
    name: 'roninnetwork',
    chainId: 2020,
    explorerUrl: 'https://app.roninchain.com/explorer',
    sinceTimestamp: genesisTimestamp,
    gasTokens: ['RON'],
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 1,
        version: '3',
      },
    ],
    apis: [],
  },
  milestones: [
    {
      title: 'Ronin migrates to an Ethereum L2',
      url: 'https://blog.roninchain.com/p/ronin-is-coming-home-to-ethereum',
      date: '2026-05-12T00:00:00.00Z',
      description:
        'Ronin hard-forks at block 55,577,490 to become an OP Stack Optimium using EigenDA.',
      type: 'general',
    },
  ],
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: ChainSpecificAddress(
        'eth:0x64192819Ac13Ef72bF6b5AE239AC672B43a9AF08',
      ),
      name: 'MainchainGateway',
      description:
        'Legacy Ronin sidechain bridge — still the primary user-facing canonical bridge after the L2 migration. ETH, WETH, USDC, AXS and other ERC-20 deposits are held here and released on withdrawal via signatures from the Ronin BridgeOperators. Independent of the OP Stack canonical bridge, which is deployed but currently unused for asset bridging.',
      tokens: '*',
    }),
  ],
  nonTemplateContractRisks: CONTRACTS.UPGRADE_NO_DELAY_RISK,
  // No game has resolved/anchored yet, so the dispute game's absolute
  // prestate (Cannon MIPS64 image hash) cannot be read from a clone.
  // Remove once `AnchorStateRegistry.anchorGame` is set.
  nonTemplateProgramHashes: [],
  isNodeAvailable: 'UnderReview',
})
