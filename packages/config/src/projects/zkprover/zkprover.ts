import { ChainSpecificAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ZK_CATALOG_ATTESTERS } from '../../common/zkCatalogAttesters'
import { ZK_CATALOG_TAGS } from '../../common/zkCatalogTags'
import { TRUSTED_SETUPS } from '../../common/zkCatalogTrustedSetups'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

export const zkprover: BaseProject = {
  id: ProjectId('zkprover'),
  slug: 'zkprover',
  name: 'zkProver',
  shortName: undefined,
  aliases: ['Polygon Zero'],
  addedAt: UnixTime.fromDate(new Date('2025-07-18')),
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description:
      'zkProver prover originally built by Polygon Zero team to prove state transition of Polygon zkEVM chain.',
    links: {
      documentation: [
        'https://docs.polygon.technology/tools/zkevm/architecture/#zkprover',
      ],
      repositories: [
        'https://github.com/0xPolygon/zkevm-prover',
        'https://github.com/0xPolygon/zkevm-proverjs',
      ],
    },
    badges: [],
  },
  zkCatalogInfo: {
    creator: 'Polygon Labs',
    techStack: {
      zkVM: [
        ZK_CATALOG_TAGS.STARK['PIL-STARK'],
        ZK_CATALOG_TAGS.ISA.ZkASM,
        // ZK_CATALOG_TAGS.Arithmetization.eAIR,
        ZK_CATALOG_TAGS.Field.Goldilocks,
      ],
      finalWrap: [
        ZK_CATALOG_TAGS.Fflonk.Snarkjs,
        ZK_CATALOG_TAGS.curve.BN254,
        // ZK_CATALOG_TAGS.PCS.KZG,
        // ZK_CATALOG_TAGS.Arithmetization.R1CS,
      ],
    },
    proofSystemInfo: readProjectMarkdown('zkprover', 'proofSystemInfo'),
    trustedSetups: [
      {
        proofSystem: ZK_CATALOG_TAGS.Fflonk.Snarkjs,
        ...TRUSTED_SETUPS.PolygonZkEVM,
      },
    ],
    projectsForTvs: [
      {
        projectId: ProjectId('polygonzkevm'),
        sinceTimestamp: UnixTime(1679868000),
        untilTimestamp: UnixTime(1764716400),
      },
      {
        projectId: ProjectId('silicon'),
        sinceTimestamp: UnixTime(1724796000),
      },
      {
        projectId: ProjectId('ternoa'),
        sinceTimestamp: UnixTime(1738105200),
      },
      {
        projectId: ProjectId('penchain'),
        sinceTimestamp: UnixTime(1749938400),
      },
      {
        projectId: ProjectId('wirex'),
        sinceTimestamp: UnixTime(1724796000),
      },
      {
        projectId: ProjectId('astarzkevm'),
        sinceTimestamp: UnixTime(1709679600),
        // untilTimestamp: UnixTime(1743372000),
      },
      {
        projectId: ProjectId('gpt'),
        sinceTimestamp: UnixTime(1724450400),
        // untilTimestamp: UnixTime(1737676800),
      },
      {
        projectId: ProjectId('witness'),
        sinceTimestamp: UnixTime(1719871200),
        // untilTimestamp: UnixTime(1738022400),
      },
    ],
    verifierHashes: [
      // wirex was the last chain using this verifier:
      {
        hash: '0x28ddf3744fb9b64bc428bee318e026bee0cf210e23ff5932f645e32aa916c28f',
        proofSystem: ZK_CATALOG_TAGS.Fflonk.Snarkjs,
        name: 'zkProver Fflonk verifier Wirex',
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0x0775e11309d75aA6b0967917fB0213C5673eDf81',
            ),
          },
        ],
        verificationStatus: 'notVerified',
        description:
          'Custom verifier ID: SHA256 hash of the following values from the verifier smart contract, abi packed in the same order they are defined: verification key data, omegas, verifier preprocessed inputs (all values from k1 to X2y2).',
      },
      {
        hash: '0x237bc5d6efad6d844534c4a45f5f19fa86344615ac00054821915c219e9abd81',
        name: 'zkProver Fflonk v8.0.0-fork.12',
        sourceLink:
          'https://github.com/0xPolygon/zkevm-proverjs/tree/v8.0.0-fork.12',
        proofSystem: ZK_CATALOG_TAGS.Fflonk.Snarkjs,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0x9B9671dB83CfcB4508bF361942488C5cA2b1286D',
            ),
          },
        ],
        verificationStatus: 'successful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        verificationSteps: readProjectMarkdown(
          'zkprover',
          'verificationSteps-0x237bc5d6',
        ),
        description:
          'Custom verifier ID: SHA256 hash of the following values from the verifier smart contract, abi packed in the same order they are defined: verification key data, omegas, verifier preprocessed inputs (all values from k1 to X2y2).',
      },
    ],
  },
}
