import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ZK_CATALOG_TAGS } from '../../common/zkCatalogTags'
import { TRUSTED_SETUPS } from '../../common/zkCatalogTrustedSetups'
import type { BaseProject } from '../../types'

export const stwo: BaseProject = {
  id: ProjectId('stwo'),
  slug: 'stwo',
  name: 'Stwo',
  shortName: undefined,
  addedAt: UnixTime.fromDate(new Date('2025-10-29')),
  display: {
    description:
      'Stwo is a circle STARK optimized for proving performance, representing the next generation of Starkware prover after Stone.',
    links: {
      repositories: [
        'https://github.com/starkware-libs/stwo?tab=readme-ov-file',
        'https://github.com/starkware-libs/stwo-cairo',
        'https://github.com/keep-starknet-strange/awesome-stwo',
      ],
      documentation: [
        'https://zksecurity.github.io/stwo-book/introduction.html',
      ],
      socialMedia: ['https://x.com/StarkWareLtd'],
    },
    badges: [],
  },
  zkCatalogInfo: {
    creator: 'Starkware',
    techStack: {
      zkVM: [
        ZK_CATALOG_TAGS.STARK.Stwo,
        ZK_CATALOG_TAGS.ISA.CASM,
        ZK_CATALOG_TAGS.Field.Mersenne31,
      ],
    },
    proofSystemInfo: '',
    trustedSetups: [
      {
        ...TRUSTED_SETUPS.TransparentSetup,
        proofSystem: ZK_CATALOG_TAGS.STARK.Stone,
      },
    ],
    verifierHashes: [
      {
        hash: '0xf16d320ba0d2087a99ffd465041960fd0aedf5e723c0fb877533876c531191d3',
        proofSystem: ZK_CATALOG_TAGS.STARK.Stwo,
        knownDeployments: [
          {
            address: '0x13e120F6c8E747983F7aaF0f7731796bfcb0D934',
            chain: 'ethereum',
          },
        ],
        verificationStatus: 'notVerified',
        description:
          "Custom verifier ID: SHA256 hash of the address of the immutable verifier smart contract (GpsStatementVerifier) in hex string format '0x...'.",
      },
    ],
  },
}
