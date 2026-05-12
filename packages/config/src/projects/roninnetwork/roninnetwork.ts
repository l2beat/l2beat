import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
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
  additionalBadges: [BADGES.RaaS.Conduit],
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
  nonTemplateContractRisks: CONTRACTS.UPGRADE_NO_DELAY_RISK,
  // No state proposals yet (gameCount = 0), so the dispute game's
  // absolute prestate is not initialised — skip the program-hash lookup.
  nonTemplateProgramHashes: [],
  // The opStackSequencerInbox handler infers the batch inbox from the
  // batcher's recent L1 txs. Ronin migrated minutes ago and no batches
  // have landed yet, so the heuristic returns 0x0. Pin the reference link
  // to the actual `batchInbox` configured in SystemConfig.
  nonTemplateTechnology: {
    dataAvailability: {
      name: 'Data is posted to EigenDA',
      description:
        'Transactions roots are posted onchain and the full data is posted on EigenDA. The sequencer is publishing data to EigenDA v2. Since the DACert Verifier is not used, availability of the data is not verified against EigenDA operators, meaning that the Sequencer can single-handedly publish unavailable commitments.',
      risks: [
        {
          category: 'Funds can be lost if',
          text: 'the sequencer posts an unavailable transaction root.',
          isCritical: true,
        },
        {
          category: 'Funds can be lost if',
          text: 'the data is not available on the external provider.',
          isCritical: true,
        },
      ],
      references: [
        { title: 'EigenDA Docs - Overview', url: 'https://docs.eigenda.xyz/overview' },
        {
          title: 'Derivation: Batch submission - OP Mainnet specs',
          url: 'https://github.com/ethereum-optimism/specs/blob/main/specs/protocol/derivation.md#batch-submission',
        },
        {
          title: 'BatchInbox - address',
          url: 'https://etherscan.io/address/0x003A7A2d3129838Adb01c8d9b7DA62Ac6Ec27961#code',
        },
      ],
    },
  },
  isNodeAvailable: 'UnderReview',
})
