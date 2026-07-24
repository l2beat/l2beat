import { ChainSpecificAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ZK_CATALOG_TAGS } from '../../common/zkCatalogTags'
import { TRUSTED_SETUPS } from '../../common/zkCatalogTrustedSetups'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

export const zksyncprover: BaseProject = {
  id: ProjectId('zksyncprover'),
  slug: 'zksyncprover',
  name: 'ZKsync Lite',
  shortName: undefined,
  aliases: ['Matter Labs'],
  addedAt: UnixTime.fromDate(new Date('2025-07-23')),
  // archivedAt: UnixTime.fromDate(new Date('2026-05-05')),
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description:
      'Plonk proving system designed by Matter Labs to prove custom predefined state transitions of ZKsync Lite.',
    links: {
      websites: ['https://lite.zksync.io/'],
      documentation: [
        'https://github.com/matter-labs/zksync/tree/master/docs',
        'https://docs.lite.zksync.io/userdocs/',
      ],
      repositories: ['https://github.com/matter-labs/zksync/tree/master'],
    },
    badges: [],
  },
  zkCatalogInfo: {
    creator: 'Matter Labs',
    techStack: {
      snark: [
        ZK_CATALOG_TAGS.Plonk.Zksync,
        // ZK_CATALOG_TAGS.Arithmetization.R1CS,
        // ZK_CATALOG_TAGS.PCS.KZG,
        ZK_CATALOG_TAGS.curve.BN254,
        ZK_CATALOG_TAGS.Other.CustomCircuits,
      ],
    },
    proofSystemInfo: readProjectMarkdown('zksyncprover', 'proofSystemInfo'),
    trustedSetups: [
      {
        proofSystem: ZK_CATALOG_TAGS.Plonk.Zksync,
        ...TRUSTED_SETUPS.AztecIgnition,
      },
    ],
    projectsForTvs: [
      {
        projectId: ProjectId('zksync'),
        sinceTimestamp: UnixTime(1592431200),
      },
      {
        projectId: ProjectId('zkspace'),
        sinceTimestamp: UnixTime(1639954800),
      },
      {
        projectId: ProjectId('apex'),
        sinceTimestamp: UnixTime(1717970400),
      },
    ],
    verifierHashes: [
      {
        hash: '0xa43ed825e5cd25608fc1bf63fa12bbf73a05523066b040a90069b2c201e76d1e',
        name: 'ZkLink verifier ApeX Omni',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Zksync,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'arbitrum',
              '0x235118AfB54B6d6c7b48F1B5434c25CD6Eb6B68F',
            ),
          },
        ],
        verificationStatus: 'notVerified',
        description:
          'Custom verifier ID: SHA256 hash of the abi packed array of uint256 obtained from flattening VerificationKey structure returned by getVkAggregated1()',
      },
      {
        hash: '0xfa15bba967ebf892d9657359fb8ff07aea13e152c0d5160143a494abb4bc9df3',
        name: 'ZKsync Lite verifier 1',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Zksync,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0x57B09100e6160503aBDEBC76012b6c358eA4e462',
            ),
          },
        ],
        verificationStatus: 'notVerified',
        description:
          'Custom verifier ID: SHA256 hash of the abi packed array of uint256 obtained from flattening VerificationKey structure returned by getVkAggregated1()',
      },
      {
        hash: '0xdfd9cbc5d113efddf3bfe382bcdd2cd67a9548fb62d758e9b18c8d8821ef1f22',
        name: 'ZKsync Lite verifier 4',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Zksync,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0x57B09100e6160503aBDEBC76012b6c358eA4e462',
            ),
          },
        ],
        verificationStatus: 'notVerified',
        description:
          'Custom verifier ID: SHA256 hash of the abi packed array of uint256 obtained from flattening VerificationKey structure returned by getVkAggregated4()',
      },
      {
        hash: '0xdfd12090ec7d5f3cc8c98dcad49e938e9e33f6807b70679c6bdfe61fdf9fd329',
        name: 'ZKsync Lite verifier 8',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Zksync,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0x57B09100e6160503aBDEBC76012b6c358eA4e462',
            ),
          },
        ],
        verificationStatus: 'notVerified',
        description:
          'Custom verifier ID: SHA256 hash of the abi packed array of uint256 obtained from flattening VerificationKey structure returned by getVkAggregated8()',
      },
      // {
      //   hash: '0x730bd4aefc695fa8689235a3a8deafa82f785e5d9302481a6b7ecf95a7d0420a',
      //   proofSystem: ZK_CATALOG_TAGS.Plonk.Zksync,
      //   knownDeployments: [
      //     {
      //       address: EthereumAddress(
      //         '0x44DedA2C824458A5DfE1e363c679dea33f1ffA39',
      //       ),
      //       chain: 'ethereum',
      //     },
      //   ],
      //   verificationStatus: 'notVerified',
      //   description:
      //     'Custom verifier ID: SHA256 hash of the abi packed array of uint256 obtained from flattening VerificationKey structure returned by getVkAggregated1()',
      // },
      // {
      //   hash: '0x4a13f5d7934015fbfc3e24c61d3356fdc5c200032ab19c514e1ba619d3039ace',
      //   proofSystem: ZK_CATALOG_TAGS.Plonk.Zksync,
      //   knownDeployments: [
      //     {
      //       address: EthereumAddress(
      //         '0x44DedA2C824458A5DfE1e363c679dea33f1ffA39',
      //       ),
      //       chain: 'ethereum',
      //     },
      //   ],
      //   verificationStatus: 'notVerified',
      //   description:
      //     'Custom verifier ID: SHA256 hash of the abi packed array of uint256 obtained from flattening VerificationKey structure returned by getVkAggregated5()',
      // },
      // {
      //   hash: '0x75d87653bd7f2833ebbbec7128550beb4dd4f22e5224eb2b6bd73fa720da3a24',
      //   proofSystem: ZK_CATALOG_TAGS.Plonk.Zksync,
      //   knownDeployments: [
      //     {
      //       address: EthereumAddress(
      //         '0x44DedA2C824458A5DfE1e363c679dea33f1ffA39',
      //       ),
      //       chain: 'ethereum',
      //     },
      //   ],
      //   verificationStatus: 'notVerified',
      //   description:
      //     'Custom verifier ID: SHA256 hash of the abi packed array of uint256 obtained from flattening VerificationKey structure returned by getVkAggregated10()',
      // },
      // {
      //   hash: '0x79cab0460ac9f99789702614b77a3eacd0c52b0c29fb69d4065952edc247dad9',
      //   proofSystem: ZK_CATALOG_TAGS.Plonk.Zksync,
      //   knownDeployments: [
      //     {
      //       address: EthereumAddress(
      //         '0x44DedA2C824458A5DfE1e363c679dea33f1ffA39',
      //       ),
      //       chain: 'ethereum',
      //     },
      //   ],
      //   verificationStatus: 'notVerified',
      //   description:
      //     'Custom verifier ID: SHA256 hash of the abi packed array of uint256 obtained from flattening VerificationKey structure returned by getVkAggregated20()',
      // },
    ],
  },
}
