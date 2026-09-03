import { ChainSpecificAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ZK_CATALOG_ATTESTERS } from '../../common/zkCatalogAttesters'
import { ZK_CATALOG_TAGS } from '../../common/zkCatalogTags'
import { TRUSTED_SETUPS } from '../../common/zkCatalogTrustedSetups'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

export const lighterprover: BaseProject = {
  id: ProjectId('lighterprover'),
  slug: 'lighterprover',
  name: 'Lighter',
  shortName: undefined,
  addedAt: UnixTime.fromDate(new Date('2025-10-08')),
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description:
      'A ZK proving system designed by Lighter for proving their DEX L2 focused on trading perpetuals.',
    links: {
      websites: ['https://lighter.xyz'],
      documentation: ['https://docs.lighter.xyz'],
      repositories: [
        'https://github.com/elliottech/lighter-prover/tree/main',
        'https://github.com/elliottech',
      ],
    },
    badges: [],
  },
  zkCatalogInfo: {
    creator: 'Lighter',
    techStack: {
      snark: [
        ZK_CATALOG_TAGS.Plonk.Plonky2,
        ZK_CATALOG_TAGS.Field.Goldilocks,
        ZK_CATALOG_TAGS.Other.CustomCircuits,
      ],
      finalWrap: [ZK_CATALOG_TAGS.Plonk.Gnark, ZK_CATALOG_TAGS.curve.BN254],
    },
    proofSystemInfo: readProjectMarkdown('lighterprover', 'proofSystemInfo'),
    trustedSetups: [
      {
        proofSystem: ZK_CATALOG_TAGS.Plonk.Gnark,
        ...TRUSTED_SETUPS.AztecIgnition,
      },
    ],
    projectsForTvs: [
      {
        projectId: ProjectId('lighter'),
        sinceTimestamp: UnixTime(1759356000),
      },
      {
        projectId: ProjectId('lighter-robinhood'),
        sinceTimestamp: UnixTime(1782502424), // first BatchVerification event
      },
    ],
    verifierHashes: [
      {
        hash: '0x4fd08a9ad74918c2052e6ea7c6b71ce71e62e07bec2bc539c0933579683f59c7',
        name: 'Lighter verifier',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Gnark,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0xA437933830d65a61F8Beaa7D4C65f424bBe90b4C',
            ),
          },
        ],
        verificationStatus: 'notVerified',
        verificationSteps:
          'The sources for the verifier circuits are not published and thus the verifier cannot be independently regenerated.',
        description:
          'Custom verifier ID: SHA256 hash of all VK_... values from the smart contract, abi packed in the same order they are defined.',
      },
      {
        hash: '0x32f44b5cbcd701d03206b427e62eae6f171d4b145c4f0717bd9ad004bc24993c',
        name: 'Lighter verifier',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Gnark,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0xB1386c4266974D81256afB9908e104B00587112A',
            ),
          },
        ],
        verificationStatus: 'notVerified',
        verificationSteps:
          'The sources for the verifier circuits are not published and thus the verifier cannot be independently regenerated.',
        description:
          'Custom verifier ID: SHA256 hash of all VK_... values from the smart contract, abi packed in the same order they are defined.',
      },
      {
        hash: '0x0b3f7515b28812264c235ac2bba289e19a42cecfbceb2eef9856bd6f591a2308',
        name: 'Lighter on Robinhood verifier',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Gnark,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'robinhood',
              '0x61CA82e45F5a57d00E66b522Be72D8bA41e634Aa',
            ),
          },
        ],
        verificationStatus: 'notVerified',
        description:
          'Custom verifier ID: SHA256 hash of all VK_... values from the smart contract, abi packed in the same order they are defined.',
      },
      {
        // DesertVerifier
        hash: '0xc8ffb171b6ebf0bba84df27eaa1021550c5242b146739c704221b456203630a9',
        name: 'Lighter Desert verifier',
        sourceLink:
          'https://github.com/elliottech/lighter-prover/tree/23d1596b832db24f1007e20220ba1556d23b0c68/desertexit/circuits',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Gnark,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0x866418061d4C1168e1c8E8f6facE79675395E008',
            ),
          },
          {
            address: ChainSpecificAddress.fromLong(
              'robinhood',
              '0x56aeED6920DBB9E198C2C0072147A45684A06E10',
            ),
          },
        ],
        verificationStatus: 'successful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        verificationSteps: readProjectMarkdown(
          'lighterprover',
          'verificationSteps-0xc8ffb171',
        ),
        description:
          'Custom verifier ID: SHA256 hash of all VK_... values from the smart contract, abi packed in the same order they are defined.',
      },
    ],
  },
}
