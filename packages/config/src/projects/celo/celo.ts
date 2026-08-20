import {
  EthereumAddress,
  formatSeconds,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { CONTRACTS, DA_LAYERS } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import {
  EIGENDA_DA_PROVIDER,
  getOpStackDaTracking,
  opStackL2,
} from '../../templates/opStack'

const discovery = new ProjectDiscovery('celo')
const chainId = 42220

// Celo's L1 contracts are owned by CeloProxyAdminOwner, a 2/2 of the community
// Security Council and cLabs. Only the shared SuperchainConfig stays under
// Optimism's own 2/2, which is also where the Superchain-wide pause lives.
const celoOwnerStats = discovery.getMultisigStats('CeloProxyAdminOwner')
const celoCouncilStats = discovery.getMultisigStats('Celo Security Council')
const cLabsStats = discovery.getMultisigStats('Celo cLabs Multisig')
const superchainOwnerStats = discovery.getMultisigStats(
  'SuperchainProxyAdminOwner',
)
const opCouncilStats = discovery.getMultisigStats('Optimism Security Council')

const celoCouncilThreshold = discovery.getContractValue<number>(
  'Celo Security Council',
  '$threshold',
)
const celoCouncilSize = discovery.getContractValue<string[]>(
  'Celo Security Council',
  '$members',
).length
const cLabsThreshold = discovery.getContractValue<number>(
  'Celo cLabs Multisig',
  '$threshold',
)
const upgradeSignaturesRequired = celoCouncilThreshold + cLabsThreshold
const pauseExpiry = formatSeconds(
  discovery.getContractValue<number>('SuperchainConfig', 'pauseExpiry'),
)
const challengerCount = discovery.getContractValue<string[]>(
  'AccessManager',
  'challengers',
).length
const proposerCount = discovery.getContractValue<string[]>(
  'AccessManager',
  'proposers',
).length
const fallbackTimeout = formatSeconds(
  discovery.getContractValue<number>('AccessManager', 'FALLBACK_TIMEOUT'),
)
const maxChallengeDuration = formatSeconds(
  discovery.getContractValue<number>(
    'OPSuccinctFaultDisputeGame',
    'maxChallengeDuration',
  ),
)

export const celo: ScalingProject = opStackL2({
  ecosystemInfo: {
    id: ProjectId('superchain'),
    isPartOfSuperchain: true,
  },
  capability: 'universal',
  addedAt: UnixTime(1718876598), // '2024-06-20T09:43:18Z'
  additionalBadges: [BADGES.Other.MigratedFromL1, BADGES.Stack.OPSuccinct],
  daProvider: EIGENDA_DA_PROVIDER(true, DA_LAYERS.ETH_BLOBS),
  isPartOfSuperchain: true,
  stage1Principle: false,
  daAttestedByIndependentParty: true,
  daVerifierSecureOnL1: true,
  daVerifier7DayExitWindow: false,
  daCommitteeDecentralized: true,
  daVerifier30DayExitWindow: false,
  daMechanismEconomicSecurity: false,
  zkVerifierContractsReproducible: true,
  nodeSourceLink: 'https://github.com/celo-org/op-geth',
  proverSourceLink: 'https://github.com/succinctlabs/sp1',
  securityCouncilReference:
    'https://docs.celo.org/home/protocol/security-council',
  additionalStateValidationReferences: [
    {
      url: 'https://docs.celo.org/home/protocol/challengers',
      title: 'Celo Challengers',
    },
  ],
  architectureImage: 'celo',
  display: {
    name: 'Celo',
    slug: 'celo',
    description:
      'Celo is an Ethereum Optimium based on the OP stack, scaling real-world solutions & leading a thriving new digital economy for all.',
    stacks: ['OP Stack'],
    links: {
      websites: ['https://celo.org/', 'https://forum.celo.org/'],
      bridges: ['https://superbridge.app/celo'],
      documentation: ['https://docs.celo.org/'],
      explorers: [
        'https://explorer.celo.org/mainnet/',
        'https://celoscan.io',
        'https://celo.blockscout.com/',
      ],
      repositories: ['https://github.com/celo-org'],
      socialMedia: [
        'https://x.com/Celo',
        'https://discord.com/invite/celo',
        'https://blog.celo.org/',
      ],
      other: ['https://growthepie.com/chains/celo'],
    },
  },
  hasSuperchainScUpgrades: true,
  hasProperSecurityCouncil: true,
  associatedTokens: ['CELO'],
  chainConfig: {
    gasTokens: ['CELO'],
    name: 'celo',
    chainId,
    explorerUrl: 'https://celoscan.io',
    coingeckoPlatform: 'celo',
    sinceTimestamp: UnixTime(1742960663),
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 13112599,
        version: '3',
      },
    ],
    apis: [
      {
        type: 'rpc',
        url: 'https://celo.chainvibes.nl',
        callsPerMinute: 4000,
      },
      {
        type: 'etherscan',
        chainId,
        contractCreationUnsupported: true,
      },
    ],
  },
  nonTemplateContractRisks: CONTRACTS.UPGRADE_NO_DELAY_RISK,
  upgradesAndGovernance: {
    content: `Celo's L1 contracts are upgradable by a \`ProxyAdmin\` owned by the ${celoOwnerStats} \`CeloProxyAdminOwner\`, a nested Safe whose two signers are the ${celoCouncilStats} \`Celo Security Council\` and the ${cLabsStats} \`Celo cLabs Multisig\`. Both halves must approve, and there is no delay on upgrades. The shared \`SuperchainConfig\` is the exception: it remains under the ${superchainOwnerStats} \`SuperchainProxyAdminOwner\` controlled by the Optimism Foundation and the Optimism Security Council, outside Celo's control.\n\nPause powers sit apart from the upgrade path. The \`CeloSuperchainConfig\` guardian, which can pause Celo withdrawals, is the \`Celo cLabs Multisig\` acting alone; the shared \`SuperchainConfig\` guardian, which can pause the whole Superchain including Celo, resolves to the Optimism Security Council. The \`Celo Security Council\` holds no pause power at all. \`Celo cLabs Multisig\` also owns \`SystemConfig\` and the OP Succinct \`AccessManager\` on its own, so it sets the sequencer, gas configuration and the proposer and challenger allowlists without Council approval.`,
    governanceInfo: {
      securityCouncil: {
        Composition: `**${celoCouncilStats}** community Security Council, nested as one of two signers in the ${celoOwnerStats} \`CeloProxyAdminOwner\` alongside the ${cLabsStats} \`Celo cLabs Multisig\`. An L1 upgrade therefore needs ${upgradeSignaturesRequired} signatures across two bodies, and neither side can move alone — the stated design goal is a non-cLabs quorum-blocking group. The policy explicitly permits nested multisigs, and one of the ${celoCouncilSize} Council seats is itself a 2/3 Safe, so a single seat can be held by a group rather than a person.`,
        'Members public': `**Named, not mapped** — the [docs](https://docs.celo.org/home/protocol/security-council) name ${celoCouncilSize} members (L2Beat, Hyperlane, Valora, Mento, Nitya Subramanian, Kris Kaczor, Tim Moreton, Aaron Boyd) without addresses, and the [founding proposal](https://forum.celo.org/t/proposing-celo-l2s-security-council/10578) lists ${celoCouncilSize} signer addresses "in no particular order", so no member can be tied to a signer. Membership is mostly Celo-ecosystem projects, and cLabs sits on the other half of the 2/2 rather than inside the Council.`,
        Charter: `**No charter** — the [docs page](https://docs.celo.org/home/protocol/security-council) is explicitly a work in progress restating the [founding forum proposal](https://forum.celo.org/t/proposing-celo-l2s-security-council/10578), which deferred term lengths to "a later date" and never defined renewal, removal or rotation. Review feedback on that thread flagged missing emergency protocols, timezone coverage, compensation and reporting cadence; none have since been published. The Council does follow the Optimism multisig security policy.`,
        'Can bypass DAO?': `**Entirely** — every L1 upgrade runs on the ${celoOwnerStats} \`CeloProxyAdminOwner\` with no CELO vote at any step. cLabs goes further and acts alone outside the 2/2: it owns \`SystemConfig\` (sequencer and gas configuration), owns the OP Succinct \`AccessManager\` gating the ${proposerCount} proposers and ${challengerCount} challengers, and is the \`CeloSuperchainConfig\` guardian able to pause Celo withdrawals by itself.`,
        'DAO can override SC?': `**No — the Council administers itself.** Seats are changed by the Council Safe calling itself, so ${celoCouncilThreshold} of the ${celoCouncilSize} sitting members decide who joins or leaves. CELO governance ratified the inaugural cohort by vote but holds no standing power, because the \`Governance\` contract reaches Celo core contracts and the Community Fund rather than the Ethereum-side rollup contracts.`,
      },
      upgrades: {
        'Normal upgrade path': `A task is published in the public [celo-superchain-ops](https://github.com/celo-org/celo-superchain-ops) repo → **${celoCouncilStats} Security Council approval** → **${cLabsStats} cLabs approval** → execution through the ${celoOwnerStats} \`CeloProxyAdminOwner\`. Task files carry a nonce per signing layer, including a \`grand_child\` entry for the nested Safe inside the Council. No timelock at any step.`,
        'Emergency upgrade path': `**No separate path** — the normal path executes as soon as both halves have signed, so there is no lower emergency threshold. The fast levers are pauses, and neither belongs to the Security Council: the ${cLabsStats} \`Celo cLabs Multisig\` is the \`CeloSuperchainConfig\` guardian and can pause Celo withdrawals alone, while the shared \`SuperchainConfig\` guardian resolves to the ${opCouncilStats} \`Optimism Security Council\`, which can pause the whole Superchain including Celo without any Celo party consenting. Pauses lapse after ${pauseExpiry}. Celo can reassign its own guardian but cannot remove Optimism's, since the shared config is upgradable only by the ${superchainOwnerStats} \`SuperchainProxyAdminOwner\`.`,
        'Exit window': `**None** — nothing separates the second approval from the upgrade taking effect, so users get no notice and cannot withdraw ahead of an unwanted change. Routine changes run through the same gate: rotating the OP Succinct verification keys is a \`DisputeGameFactory.setImplementation\` call and needs the full ${celoOwnerStats}.`,
        'Proof-system levers': `Beyond upgrades, whoever controls the proof system controls withdrawals. \`AccessManager\` is cLabs-owned and currently allowlists ${proposerCount} proposers and ${challengerCount} challengers (5 independent plus one cLabs). A game can be challenged for ${maxChallengeDuration}, and if no proposal lands for ${fallbackTimeout} the system falls back to permissionless proposing.`,
      },
      tokenGovernance: {
        'Governance token':
          '\`CELO\` — 1,000,000,000 total supply. Voting weight comes from Locked CELO, not raw balance. Governance is native to the Celo chain and predates the L2 migration.',
        'Voting venue':
          'The onchain \`Governance\` contract on Celo, with proposals raised as CGPs and discussed on the [Celo forum](https://forum.celo.org). Ethereum-side rollup contracts are not reachable from it.',
        'Proposal threshold':
          '**10,000 CELO deposit** to queue a proposal. Queued proposals expire after 4 weeks, and only the 3 most-upvoted are promoted to a vote each day.',
        Quorum:
          'Participation must clear a moving baseline — currently ~23% of Locked CELO, scaled by a 0.5 quorum factor to roughly **12%**, with a 5% floor. The baseline is an exponential moving average of past turnout, so quorum drifts with participation rather than being fixed.',
        'Execution model': `**7d referendum → 3d execution window.** A 3/14 approver multisig must approve before execution, after which anyone can execute. Scope is the limiting factor: this path governs Celo's L2 core contracts and the Community Fund, while every L1 rollup contract sits behind the ${celoOwnerStats} \`CeloProxyAdminOwner\` instead.`,
      },
    },
  },
  isNodeAvailable: true,
  interopConfig: {
    name: 'Celo Canonical',
    durationSplit: {
      lockAndMint: [
        {
          label: 'L1 -> L2',
          transferTypes: [
            'opstack.L1ToL2Transfer',
            'opstack-standardbridge.L1ToL2Transfer',
          ],
        },
        {
          label: 'L2 -> L1',
          transferTypes: [
            'opstack.L2ToL1Transfer',
            'opstack-standardbridge.L2ToL1Transfer',
          ],
        },
      ],
    },
    plugins: [
      {
        chain: 'celo',
        plugin: 'opstack',
        bridgeType: 'lockAndMint',
      },
      {
        chain: 'celo',
        plugin: 'opstack-standardbridge',
        bridgeType: 'lockAndMint',
      },
    ],
    type: 'canonical',
  },
  discovery,
  genesisTimestamp: UnixTime(1742960663), // ts of first batch posted, block 0 from the rpc: 1587571200
  milestones: [
    {
      title: 'Jello hardfork activates OP Succinct Lite',
      url: 'https://forum.celo.org/t/jello-hardfork-successfully-activates-on-mainnet-introducing-op-succinct-lite/12754',
      date: '2025-12-10T00:00:00.00Z',
      description:
        'Celo implements OP Succinct Lite, introducing ZK proofs for dispute resolution and DA verification.',
      type: 'general',
    },
    {
      title: 'Celo becomes an Ethereum L2',
      url: 'https://blog.celo.org/celo-l2-is-now-live-a-note-from-our-founders-c585bd57b5fa',
      date: '2025-03-26T00:00:00.00Z',
      description:
        'Celo migrates from an L1 to an L2 architecture on Ethereum and EigenDA.',
      type: 'general',
    },
  ],
  activityConfig: {
    type: 'block',
    startBlock: 31060842,
    adjustCount: { type: 'SubtractOne' },
  },
  daTracking: [
    getOpStackDaTracking(discovery, { sinceBlock: 22038831 }),
    {
      type: 'eigen-da',
      customerId: '0xecf08b0a4f196e06e9aece95d5dd724bc121f09c',
      daLayer: ProjectId('eigenda'),
      sinceTimestamp: UnixTime(1741806000),
    },
  ],
})
