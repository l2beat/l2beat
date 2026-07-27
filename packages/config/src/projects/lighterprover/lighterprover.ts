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
        hash: '0xc5abe8a935b2a7a05f47ee05d8a4ca6e3310df45f9e203d4ea4aa947d978fccb',
        name: 'Lighter verifier',
        sourceLink:
          'https://github.com/elliottech/lighter-prover/tree/642cca8e1d4853cdcbb21eed4f15c04bbd154ce4/circuit/src',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Gnark,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0xEd0a60EDaCd8c9B1221d2D9F753b6dF09Ea3baaa',
            ),
          },
        ],
        verificationStatus: 'successful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        verificationSteps: readProjectMarkdown(
          'lighterprover',
          'verificationSteps-0xc5abe8a9',
        ),
        description:
          'Custom verifier ID: SHA256 hash of all VK_... values from the smart contract, abi packed in the same order they are defined.',
      },
      {
        hash: '0x1ea7019dfa94b4b4c58254a958d8fa81a2a8d5d651477acae75bd9405ee5f181',
        name: 'Lighter on Robinhood verifier',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Gnark,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'robinhood',
              '0xA3c70B197AcE329D9e09C753DA7874B78F1D00f4',
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
