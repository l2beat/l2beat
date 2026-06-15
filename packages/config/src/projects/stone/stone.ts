import { ChainSpecificAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ZK_CATALOG_TAGS } from '../../common/zkCatalogTags'
import { TRUSTED_SETUPS } from '../../common/zkCatalogTrustedSetups'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

export const stone: BaseProject = {
  id: ProjectId('stone'),
  slug: 'stone',
  name: 'Stone',
  shortName: undefined,
  aliases: ['StarkWare'],
  addedAt: UnixTime.fromDate(new Date('2025-07-14')),
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description:
      'Stone is a proving system for programs written with Cairo language. Originally built by Starkware for proving Starknet state transition.',
    links: {
      websites: [
        'https://starkware.co',
        'https://starkware.co/blog/open-sourcing-the-battle-tested-stone-prover/',
      ],
      documentation: ['https://docs.starknet.io/architecture/sharp/'],
      repositories: ['https://github.com/starkware-libs/stone-prover'],
    },
    badges: [],
  },
  zkCatalogInfo: {
    creator: 'Starkware',
    quantumResistant: true,
    techStack: {
      zkVM: [
        ZK_CATALOG_TAGS.STARK.Stone,
        ZK_CATALOG_TAGS.ISA.CASM,
        // ZK_CATALOG_TAGS.Arithmetization.AIR,
        ZK_CATALOG_TAGS.Field.felt252,
      ],
    },
    proofSystemInfo: readProjectMarkdown('stone', 'proofSystemInfo'),
    trustedSetups: [
      {
        ...TRUSTED_SETUPS.TransparentSetup,
        proofSystem: ZK_CATALOG_TAGS.STARK.Stone,
      },
    ],
    projectsForTvs: [
      {
        projectId: ProjectId('starknet'),
        sinceTimestamp: UnixTime(1638140400),
        untilTimestamp: UnixTime(1760824800),
      },
      {
        projectId: ProjectId('paradex'),
        sinceTimestamp: UnixTime(1696111200),
        untilTimestamp: UnixTime(1763997779),
      },
      {
        projectId: ProjectId('immutablex'),
        sinceTimestamp: UnixTime(1617832800),
        untilTimestamp: UnixTime(1772672831),
      },
      {
        projectId: ProjectId('sorare'),
        sinceTimestamp: UnixTime(1627250400),
      },
      {
        projectId: ProjectId('brine'),
        sinceTimestamp: UnixTime(1682546400),
      },
      {
        projectId: ProjectId('myria'),
        sinceTimestamp: UnixTime(1661464800),
      },
      {
        projectId: ProjectId('deversifi'),
        sinceTimestamp: UnixTime(1591135200),
      },
      {
        projectId: ProjectId('dydx'),
        sinceTimestamp: UnixTime(1617660000),
      },
      {
        projectId: ProjectId('edgex'),
        sinceTimestamp: UnixTime(1722636000),
      },
      {
        projectId: ProjectId('layer2financezk'),
        sinceTimestamp: UnixTime(1645130774),
      },
    ],
    verifierHashes: [
      {
        // Custom verifier ID: SHA256 hash of the address of the immutable verifier smart contract (GpsStatementVerifier)
        // in hex format '0x...'
        hash: '0x5ed8957171b466464570ba10b3d5c5adfc54546ba56278129af5ae63a0d4ad22',
        name: 'Stone verifier 2024_10',
        sourceLink:
          'https://etherscan.io/address/0x9fb7F48dCB26b7bFA4e580b2dEFf637B13751942#code',
        proofSystem: ZK_CATALOG_TAGS.STARK.Stone,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0x9fb7F48dCB26b7bFA4e580b2dEFf637B13751942',
            ),
            overrideUsedIn: [
              ProjectId('edgex'),
              ProjectId('myria'),
              ProjectId('sorare'),
              ProjectId('brine'),
            ],
          },
        ],
        verificationStatus: 'successful',
        verificationSteps:
          'Onchain stone verifier smart contracts contain code that directly checks proofs of correct Cairo program execution. Unlike SNARK final wraps, it does not contain any additional cryptographic components that need to be independently regenerated because it introduces no new zk circuits. The sources are verified on etherscan and can be examined directly to check the correct implementation of STARK verification protocol.',
        description:
          "Custom verifier ID: SHA256 hash of the address of the immutable verifier smart contract (GpsStatementVerifier) in hex string format '0x...'.",
      },
      // {
      //   hash: '0xe12a7131035327b1f54cf3163d124b71da052535e71f64bbd9c2a460ec3a43f0',
      //   proofSystem: ZK_CATALOG_TAGS.STARK.Stone,
      //   knownDeployments: [
      //     'https://etherscan.io/address/0x894c4a12548FB18EaA48cF34f9Cd874Fc08b7FC3',
      //   ],
      //   verificationStatus: 'notVerified',
      //   usedBy: [ProjectId('dydx')],
      //   description:
      //     "Custom verifier ID: SHA256 hash of the address of the immutable verifier smart contract (GpsStatementVerifier) in hex string format '0x...'.",
      // },
    ],
  },
}
