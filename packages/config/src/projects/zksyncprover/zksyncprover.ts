import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ZK_CATALOG_TAGS } from '../../common/zkCatalogTags'
import { TRUSTED_SETUPS } from '../../common/zkCatalogTrustedSetups'
import type { BaseProject } from '../../types'

export const zksyncprover: BaseProject = {
  id: ProjectId('zksyncprover'),
  slug: 'zksyncprover',
  name: 'ZKsync Lite',
  shortName: undefined,
  addedAt: UnixTime.fromDate(new Date('2025-07-23')),
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
    proofSystemInfo: `
    ## Proof system

    ZKSync Lite prover is a monolithic SNARK proving system that generates validity proofs for the state transition of ZKSync Lite L2. It is a [Plonk system](https://docs.lite.zksync.io/userdocs/security/#primitives) over BN254 curve with [custom circuits](https://github.com/matter-labs/zksync/tree/master/core/lib/circuit/src) designed to prove the specific state transition function of the L2, including deposits and withdrawals, transfers, swaps, NFT operations. The proof system itself is implemented in the [bellman library](https://github.com/matter-labs/bellman), while many base cryptographic primitives are implemented in [franklin library](https://github.com/matter-labs/franklin-crypto/tree/dev).    
    `,
    trustedSetups: [
      {
        proofSystem: ZK_CATALOG_TAGS.Plonk.Zksync,
        ...TRUSTED_SETUPS.AztecIgnition,
      },
    ],
    verifierHashes: [
      {
        hash: '0xfa15bba967ebf892d9657359fb8ff07aea13e152c0d5160143a494abb4bc9df3',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Zksync,
        knownDeployments: [
          {
            address: '0x57B09100e6160503aBDEBC76012b6c358eA4e462',
            chain: 'ethereum',
          },
        ],
        verificationStatus: 'notVerified',
        description:
          'Custom verifier ID: SHA256 hash of the abi packed array of uint256 obtained from flattening VerificationKey structure returned by getVkAggregated1()',
      },
      {
        hash: '0xdfd9cbc5d113efddf3bfe382bcdd2cd67a9548fb62d758e9b18c8d8821ef1f22',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Zksync,
        knownDeployments: [
          {
            address: '0x57B09100e6160503aBDEBC76012b6c358eA4e462',
            chain: 'ethereum',
          },
        ],
        verificationStatus: 'notVerified',
        description:
          'Custom verifier ID: SHA256 hash of the abi packed array of uint256 obtained from flattening VerificationKey structure returned by getVkAggregated4()',
      },
      {
        hash: '0xdfd12090ec7d5f3cc8c98dcad49e938e9e33f6807b70679c6bdfe61fdf9fd329',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Zksync,
        knownDeployments: [
          {
            address: '0x57B09100e6160503aBDEBC76012b6c358eA4e462',
            chain: 'ethereum',
          },
        ],
        verificationStatus: 'notVerified',
        description:
          'Custom verifier ID: SHA256 hash of the abi packed array of uint256 obtained from flattening VerificationKey structure returned by getVkAggregated8()',
      },
      {
        hash: '0x730bd4aefc695fa8689235a3a8deafa82f785e5d9302481a6b7ecf95a7d0420a',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Zksync,
        knownDeployments: [
          {
            address: '0x44DedA2C824458A5DfE1e363c679dea33f1ffA39',
            chain: 'ethereum',
          },
        ],
        verificationStatus: 'notVerified',
        description:
          'Custom verifier ID: SHA256 hash of the abi packed array of uint256 obtained from flattening VerificationKey structure returned by getVkAggregated1()',
      },
      {
        hash: '0x4a13f5d7934015fbfc3e24c61d3356fdc5c200032ab19c514e1ba619d3039ace',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Zksync,
        knownDeployments: [
          {
            address: '0x44DedA2C824458A5DfE1e363c679dea33f1ffA39',
            chain: 'ethereum',
          },
        ],
        verificationStatus: 'notVerified',
        description:
          'Custom verifier ID: SHA256 hash of the abi packed array of uint256 obtained from flattening VerificationKey structure returned by getVkAggregated5()',
      },
      {
        hash: '0x75d87653bd7f2833ebbbec7128550beb4dd4f22e5224eb2b6bd73fa720da3a24',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Zksync,
        knownDeployments: [
          {
            address: '0x44DedA2C824458A5DfE1e363c679dea33f1ffA39',
            chain: 'ethereum',
          },
        ],
        verificationStatus: 'notVerified',
        description:
          'Custom verifier ID: SHA256 hash of the abi packed array of uint256 obtained from flattening VerificationKey structure returned by getVkAggregated10()',
      },
      {
        hash: '0x79cab0460ac9f99789702614b77a3eacd0c52b0c29fb69d4065952edc247dad9',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Zksync,
        knownDeployments: [
          {
            address: '0x44DedA2C824458A5DfE1e363c679dea33f1ffA39',
            chain: 'ethereum',
          },
        ],
        verificationStatus: 'notVerified',
        description:
          'Custom verifier ID: SHA256 hash of the abi packed array of uint256 obtained from flattening VerificationKey structure returned by getVkAggregated20()',
      },
    ],
  },
}
