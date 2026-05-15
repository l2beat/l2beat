import {
  ChainSpecificAddress,
  EthereumAddress,
  UnixTime,
} from '@l2beat/shared-pure'
import { CONTRACTS, ESCROW, REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { PROGRAM_HASHES } from '../../common/programHashes'
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
    REASON_FOR_BEING_OTHER.NO_PROOFS,
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
        'Predates the L2 migration and remains the primary user-facing bridge for bridged ETH and ERC-20 assets. Withdrawals are authorised by Chainlink CCIP DONs in combination with the Ronin BridgeOperator multisig, not by the OP Stack fault proof system.',
      tokens: '*',
      ...ESCROW.CANONICAL_ADD_TA,
      bridgedUsing: {
        bridges: [{ name: 'Ronin Bridge (Chainlink CCIP + BridgeOperators)' }],
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
        name: 'Dual-bridge architecture',
        description:
          'The May 2026 L2 migration changed how Ronin L2 state is settled on Ethereum but did not redeploy the bridge that custodies user assets. The risk analysis on this page covers the OP Stack canonical bridge (OptimismPortal2 and L1StandardBridge), which is deployed but currently empty. Bridged user assets continue to be held in MainchainGateway and bridged through Chainlink CCIP plus the Ronin BridgeOperator multisig. The two paths share no on-chain wiring and have different security models: the OP Stack path is secured by the permissioned fault proof system, while MainchainGateway is secured by CCIP DON attestations and a stake-weighted operator threshold. Sky Mavis has not announced a plan to migrate liquidity from MainchainGateway to the OP Stack bridge.',
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
        description: `The dispute games on this chain commit to the op-program v1.3.1 prestate (0x038512e0…6764d54c). That binary embeds the superchain-registry snapshot at commit 42bd03ba8313 (2024-08-21), which lists 17 chain IDs and does not include Ronin (chainId 2020). If a dispute game were stepped through to the VM, op-program's RollupConfigByChainID(2020) would not find a rollup config and would panic, producing an invalid output state — any claim (honest or fraudulent) could then be "disproven" against the panic. Users are not exposed today because the respected game type is PermissionedDisputeGame: only the proposer can create state proposals and only proposer/challenger can move or step. The proof system therefore reduces to an operator-attested delay timer rather than an adversarial fraud-proof. Fix would require redeploying games with either an updated registry snapshot or a chain-specific prestate.`,
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
  isNodeAvailable: 'UnderReview',
})
