import {
  assert,
  type ChainSpecificAddress,
  formatSeconds,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { PRIVACY_ATTRIBUTES } from '../../common/privacyAttributes'
import { PRIVACY_CATEGORIES } from '../../common/privacyCategories'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { generateDiscoveryDrivenContracts } from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'
import { interfoldAdversaries } from './adversaries'

const discovery = new ProjectDiscovery('interfold')

// Members that can rebuild the BFV secret key (T + 1) per committee size, from
// the ActiveCryptoConfig constants in the verified Interfold source. Only the
// member counts are readable onchain, so they guard the compiled thresholds.
const COMMITTEES = [
  { field: 'committeeMembersMinimum', members: 3, decryptionThreshold: 2 },
  { field: 'committeeMembersMicro', members: 9, decryptionThreshold: 5 },
  { field: 'committeeMembersSmall', members: 19, decryptionThreshold: 10 },
] as const
for (const { field, members } of COMMITTEES) {
  assert(
    discovery.getContractValue<number>('Interfold', field) === members,
    `Interfold ${field} changed: update the committee thresholds.`,
  )
}

// getE3Settings: [committee size, BFV parameter set, compute provider params].
const [voteCommitteeSize] = discovery.getContractValue<
  [number, number, string]
>('CrispTokenVoting', 'getE3Settings')
const voteCommittee = COMMITTEES[voteCommitteeSize]
assert(voteCommittee, 'Unknown CRISP vote committee size.')
const minimumCommittee = COMMITTEES[0]

const ballotVerifier = discovery.getContract('CrispOnchainBallotVerifier')
assert(
  ballotVerifier.unverified,
  'The CRISP ballot verifier is verified now: update the reproducibility and future adversary texts.',
)

// IPP stages: [bodies, maxAdvance, minAdvance, voteDuration, ...]. Stage 0 is
// the CRISP vote, stage 1 InterfoldSafeB's approval.
const ippStages = discovery.getContractValue<
  [[ChainSpecificAddress, boolean, boolean, number][], number, number, number][]
>('ProtocolProposalProcessor', 'currentStages')
assert(
  ippStages.length === 2 &&
    ippStages[0][0][0][0] ===
      discovery.getContract('CrispTokenVoting').address &&
    ippStages[1][0][0][0] === discovery.getContract('InterfoldSafeB').address,
  'IPP stages changed: update the governance text.',
)

const safeSigners = ['InterfoldSafeA', 'InterfoldSafeB'].map((name) =>
  discovery.getContractValue<string[]>(name, '$members').slice().sort().join(),
)
assert(
  safeSigners[0] === safeSigners[1],
  'The Interfold multisigs no longer share their signers: update the governance text.',
)

const veMultisigMembers = discovery.getContractValue<string[]>(
  'VotingEscrowMultisig',
  '$members',
).length
const veMultisigThreshold = discovery.getContractValue<number>(
  'VotingEscrowMultisig',
  '$threshold',
)

export const interfold: BaseProject = {
  id: ProjectId('interfold'),
  slug: 'interfold-crisp',
  name: 'Interfold CRISP',
  shortName: undefined,
  addedAt: UnixTime.fromDate(new Date('2026-10-19')),
  discoveryInfo: getDiscoveryInfo([discovery]),
  statuses: {
    yellowWarning:
      'Early mainnet: Interfold runs with an initial set of ciphernode operators, and only a few votes have taken place. L2BEAT does not measure the anonymity set of past votes; the rating reflects the protocol design only.',
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description:
      "A secret ballot on Interfold's encrypted-computation network: voters cast FHE-encrypted ballots, and a committee of ciphernodes decrypts only the totals.",
    detailedDescription: readProjectMarkdown(
      'interfold',
      'detailedDescription',
      {
        committeeMembers: voteCommittee.members,
        decryptionThreshold: voteCommittee.decryptionThreshold,
        bond: (
          BigInt(
            discovery.getContractValue<string>(
              'BondingRegistry',
              'requiredCiphernodeBond',
            ),
          ) /
          10n ** 18n
        ).toLocaleString('en-US'),
      },
    ),
    links: {
      websites: [
        'https://theinterfold.com',
        'https://governance.theinterfold.com',
      ],
      documentation: ['https://docs.theinterfold.com'],
      repositories: [
        'https://github.com/theinterfold/interfold',
        'https://github.com/theinterfold/CRISP',
        'https://github.com/theinterfold/the-interfold-governance',
      ],
    },
    badges: [],
  },
  milestones: [
    {
      title: 'Network Alpha live on Ethereum',
      url: 'https://blog.theinterfold.com/network-alpha-mainnet/',
      date: '2026-08-19T00:00:00Z',
      description:
        'Interfold launches its mainnet and the FOLD token, with an initial set of ciphernode operators.',
      type: 'general',
    },
    {
      // Interfold RequestsPausedSet(true) 2026-09-29 13:44 UTC (tx
      // 0x28446d92…), RequestsPausedSet(false) 2026-10-12 19:02 UTC (tx
      // 0x5212c536…), after the coordinator upgrade at 13:43 UTC. An earlier
      // pause ran from 2026-09-22 to 2026-09-25. No public explanation found.
      title: 'New votes paused for two weeks',
      url: 'https://etherscan.io/tx/0x28446d923bd9a9b99b2881cbfdeac13a5ab0cc7f2449e2d074c820f806690e86',
      date: '2026-09-29T00:00:00Z',
      description:
        'Interfold pauses new computation requests, and with them new votes, until an upgrade on October 12.',
      type: 'incident',
    },
    {
      // E3 2 on CRISPProgramV2, third attempt (IPFS bafkreiaddd2q…): decodeTally
      // = [184110402, 0, 0], 68 inputs to 37 addresses. Signaling only, no
      // actions. The constitution is up for a vote again on the IPP (E3 3).
      title: 'First CRISP vote backs the constitution',
      url: 'https://etherscan.io/tx/0x71b8f01267c7edaf4015a58407eef393418e3eb56feb66950bed04c4a96c0660',
      date: '2026-10-02T00:00:00Z',
      description:
        'The third constitution vote is the first CRISP vote to be decrypted, with every vote on yes.',
      type: 'general',
    },
    {
      // CrispTokenVoting proxy deployed 2026-10-10 06:55 UTC (tx 0xb74ac86c…)
      // and set as stage 0 of the ProtocolProposalProcessor.
      title: 'Protocol proposals move to secret ballots',
      url: 'https://blog.theinterfold.com/how-to-vote-on-interfold/',
      date: '2026-10-10T00:00:00Z',
      description:
        'Interfold Protocol Proposals now pass a CRISP vote before InterfoldSafeB approves them.',
      type: 'general',
    },
  ],
  privacyInfo: {
    category: PRIVACY_CATEGORIES.secretBallot,
    trackedOn: ['ethereum'],
    tokens: [],
    anonymitySet: {
      type: 'not-applicable',
      description:
        'Every ballot names the address it counts for. Only the choice is hidden, among the voters of the same vote.',
    },
    exitWindow: {
      value: 'None',
      sentiment: 'bad',
      orderHint: 0,
      description: `A ${veMultisigThreshold}-of-${veMultisigMembers} multisig plugin can upgrade the escrow that holds locked FOLD instantly, and the Interfold multisigs can upgrade the bonding registry instantly.`,
      walkawayTest: {
        passed: false,
        reason:
          "Every ballot needs a signature from Interfold's CRISP server, whose address is fixed in CRISPProgram.",
      },
    },
    reproducibility: {
      value: 'Partially reproducible',
      sentiment: 'warning',
      description:
        'The contracts, ciphernode software, circuits, CRISP server and app are open source. The two contracts that verify ballot proofs are unverified.',
    },
    attributes: [PRIVACY_ATTRIBUTES.fhe, PRIVACY_ATTRIBUTES.zk],
    // Ballot proofs are Noir/UltraHonk, verified with Barretenberg's Aztec Ignition setup.
    zkCatalogId: ProjectId('barretenberg'),
    adversaries: interfoldAdversaries(
      voteCommittee.decryptionThreshold,
      voteCommittee.members,
      minimumCommittee.decryptionThreshold,
      minimumCommittee.members,
    ),
    riskSummary: readProjectMarkdown('interfold', 'riskSummary', {
      committeeMembers: voteCommittee.members,
      decryptionThreshold: voteCommittee.decryptionThreshold,
    }),
    upgradesAndGovernance: {
      content: readProjectMarkdown('interfold', 'upgradesAndGovernance', {
        safeAStats: discovery.getMultisigStats('InterfoldSafeA'),
        safeBStats: discovery.getMultisigStats('InterfoldSafeB'),
        voteDuration: formatSeconds(ippStages[0][3], { fullUnit: true }),
        approvalWindow: formatSeconds(ippStages[1][1], { fullUnit: true }),
        veMultisigMembers,
        veMultisigThreshold,
      }),
    },
  },
  permissions: discovery.getDiscoveredPermissions(),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [],
  },
}
