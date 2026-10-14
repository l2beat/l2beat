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
        hash: '0x1532ef3582326b95ca539ef4e2c4684f018acef145cd47980aa56bf41e705be3',
        name: 'Lighter verifier',
        sourceLink:
          'https://github.com/elliottech/lighter-prover/tree/16c0f36d75f2306ee242e26e507e4c237f7f4074/circuit/src',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Gnark,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0xE586511973e02b5A3bB9e4290adc4F406Aa8f463',
            ),
          },
        ],
        verificationStatus: 'successful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        verificationSteps: readProjectMarkdown(
          'lighterprover',
          'verificationSteps-0x1532ef35',
        ),
        description:
          'Custom verifier ID: SHA256 hash of all VK_... values from the smart contract, abi packed in the same order they are defined.',
      },
      {
        hash: '0xa29ec4d3bd2bd13606a2504774017527b16f8e107649e09389e817da1ad205a2',
        name: 'Lighter on Robinhood verifier',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Gnark,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'robinhood',
              '0x7817a34136c56A6097C7042B3cAAe24b9eEd9fb4',
            ),
          },
        ],
        verificationStatus: 'notVerified',
        description:
          'Custom verifier ID: SHA256 hash of all VK_... values from the smart contract, abi packed in the same order they are defined.',
      },
      {
        // DesertVerifier
        hash: '0xe519ae1119a83c6ad569daf26ae1d61e9bbdac185aec5fae55c1e0a7c0aa4969',
        name: 'Lighter on Robinhood Desert verifier',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Gnark,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'robinhood',
              '0x93c83bdA3A45241729Ce150C1e3677bA7389c0D0',
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
