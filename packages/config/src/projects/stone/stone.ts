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
        hash: '0x243611f51b76871574612cc0f140acb660c684a66b74e37b7547474c6683659a',
        name: 'GPS statement verifier 2026_13_4',
        sourceLink:
          'https://etherscan.io/address/0x4956bda1d23F75B988644329c5B06BD1494a72b6#code',
        proofSystem: ZK_CATALOG_TAGS.STARK.Stone,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0x4956bda1d23F75B988644329c5B06BD1494a72b6',
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
    ],
  },
}
