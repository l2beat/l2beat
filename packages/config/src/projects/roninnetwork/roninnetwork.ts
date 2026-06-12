import {
  ChainSpecificAddress,
  EthereumAddress,
  UnixTime,
} from '@l2beat/shared-pure'
import { CONTRACTS, REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { PROGRAM_HASHES } from '../../common/programHashes'
import { getAltDaStage } from '../../common/stages/getAltDaStage'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { EIGENDA_DA_PROVIDER, opStackL2 } from '../../templates/opStack'
import { readProjectMarkdown } from '../../utils/readMarkdown'

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
    REASON_FOR_BEING_OTHER.NO_PROOFS,
    REASON_FOR_BEING_OTHER.NO_DA_ORACLE,
  ],
  stateValidationImage: 'opfp',
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
    coingeckoPlatform: 'ronin',
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
    apis: [
      {
        type: 'rpc',
        url: 'https://api.roninchain.com/rpc',
        callsPerMinute: 300,
      },
      {
        type: 'blockscout',
        url: 'https://explorer.roninchain.com/api',
      },
    ],
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
    // Legacy multi-sig bridge — residual escrow, drained over time as users
    // migrated to the CCIP-routed path. Still holds residual ETH plus dust of
    // USDC/AXS/WETH. WETH is excluded here because L2 totalSupply on Ronin is
    // historically over-issued vs L1 backing (legacy of the 2022 hack era).
    // Chainlink CCIP pools are NOT tracked as Ronin escrows; the CCIP-bridged
    // tokens are listed under `roninnetwork` in tokens.jsonc as source:external,
    // matching the L2BEAT pattern used by Arbitrum/Base/BOB/Soneium etc.
    discovery.getEscrowDetails({
      address: ChainSpecificAddress(
        'eth:0x64192819Ac13Ef72bF6b5AE239AC672B43a9AF08',
      ),
      name: 'MainchainGateway',
      description:
        'Legacy multi-sig-secured Ronin bridge (pre-CCIP). Holds residual ETH and ERC-20 deposits. Withdrawals authorised by the Ronin BridgeOperator threshold-signature set.',
      tokens: '*',
      // Tokens excluded to avoid double-counting with tokens.jsonc:
      //   AXS, USDC, WBTC, YGG → tracked via L2 totalSupply (Chainlink CCIP)
      //   WETH → L2 supply historically over-issued vs L1 backing, no clean
      //          attribution possible (see project description).
      excludedTokens: ['AXS', 'USDC', 'WBTC', 'YGG', 'WETH'],
      source: 'external',
      bridgedUsing: {
        bridges: [{ name: 'Ronin Bridge (legacy multi-sig)' }],
      },
    }),
  ],
  nonTemplateTechnology: {
    otherConsiderations: [
      {
        name: 'EVM compatible smart contracts are supported',
        description:
          'OP stack chains are pursuing the EVM Equivalence model. No changes to smart contracts are required regardless of the language they are written in, i.e. anything deployed on L1 can be deployed on L2.',
        risks: [],
        references: [
          {
            title: 'Introducing EVM Equivalence',
            url: 'https://medium.com/ethereum-optimism/introducing-evm-equivalence-5c2021deb306',
          },
        ],
      },
      {
        name: 'External bridge architecture',
        description:
          'The May 2026 L2 migration deployed the OP Stack canonical bridge (OptimismPortal2 and L1StandardBridge) but did not migrate user funds into it; it is currently empty. User assets are custodied on two separate L1 paths, neither of which is the canonical bridge analyzed on this page: (1) Chainlink CCIP TokenPools, the active bridge since April 2025, securing 12 tokens including AXS, USDC, WETH, WBTC (new contract), YGG, PIXEL and SLP via Chainlink DON attestations and the Risk Management Network; (2) the legacy MainchainGateway, deprecated in April 2025 but still holding residual balances (legacy WBTC, ETH backing of legacy WETH, dust), withdrawable through the Ronin BridgeOperator stake-weighted multisig. Sky Mavis has not announced a plan to migrate liquidity into the OP Stack bridge.',
        risks: [],
        references: [
          {
            title: 'MainchainGateway - Etherscan',
            url: 'https://etherscan.io/address/0x64192819Ac13Ef72bF6b5AE239AC672B43a9AF08',
          },
          {
            title: 'Ronin Bridge to Chainlink CCIP migration - Ronin Blog',
            url: 'https://blog.roninchain.com/p/the-ronin-bridge-chainlink-ccip-migration',
          },
        ],
      },
      {
        name: 'Proof system cannot execute for this chain',
        description: readProjectMarkdown(
          'roninnetwork',
          'technologyOtherConsiderations3',
        ),
        risks: [],
        references: [
          {
            title:
              'absolutePrestate hash registered in superchain-registry as op-program v1.3.1',
            url: 'https://github.com/ethereum-optimism/superchain-registry/blob/main/validation/standard/standard-prestates.toml',
          },
          {
            title: 'op-program v1.3.1 release (commit e3c2f04, 2024-08-23)',
            url: 'https://github.com/ethereum-optimism/optimism/releases/tag/op-program%2Fv1.3.1',
          },
          {
            title:
              'superchain-registry snapshot pinned at op-program v1.3.1 build (42bd03ba8313)',
            url: 'https://github.com/ethereum-optimism/superchain-registry/blob/42bd03ba8313/chainList.json',
          },
        ],
      },
    ],
  },
  nonTemplateContractRisks: CONTRACTS.UPGRADE_NO_DELAY_RISK,
  // The OP Stack template's prestate lookup walks the live game clone /
  // AnchorStateRegistry, both of which are still zero on Ronin (gameCount=0,
  // anchorGame=0x0). Surface the prestate directly from the factory's
  // `permissionedGameArgs` immutable args — first 32 bytes are the Cannon
  // MIPS64 v1.3.1 absolute prestate.
  nonTemplateProgramHashes: [
    PROGRAM_HASHES(
      '0x038512e02c4c3f7bdaec27d00edf55b7155e0905301e1a88083e4e0a6764d54c',
    ),
  ],
  activityConfig: {
    type: 'block',
    startBlock: 55577490,
    adjustCount: { type: 'SubtractOne' },
  },
  isNodeAvailable: 'UnderReview',
})
