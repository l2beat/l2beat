import { ChainSpecificAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ZK_CATALOG_TAGS } from '../../common/zkCatalogTags'
import { TRUSTED_SETUPS } from '../../common/zkCatalogTrustedSetups'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

export const stwo: BaseProject = {
  id: ProjectId('stwo'),
  slug: 'stwo',
  name: 'Stwo',
  shortName: undefined,
  aliases: ['StarkWare'],
  addedAt: UnixTime.fromDate(new Date('2025-10-29')),
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
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
    quantumResistant: true,
    techStack: {
      zkVM: [
        ZK_CATALOG_TAGS.STARK.Stwo,
        ZK_CATALOG_TAGS.ISA.CASM,
        ZK_CATALOG_TAGS.Field.Mersenne31,
      ],
    },
    proofSystemInfo: readProjectMarkdown('stwo', 'proofSystemInfo'),
    trustedSetups: [
      {
        ...TRUSTED_SETUPS.TransparentSetup,
        proofSystem: ZK_CATALOG_TAGS.STARK.Stwo,
      },
    ],
    projectsForTvs: [
      {
        projectId: ProjectId('starknet'),
        sinceTimestamp: UnixTime(1760824800),
      },
      {
        projectId: ProjectId('paradex'),
        sinceTimestamp: UnixTime(1763997779),
      },
    ],
    verifierHashes: [
      {
        hash: '0xf16d320ba0d2087a99ffd465041960fd0aedf5e723c0fb877533876c531191d3',
        name: 'Stwo verifier 2025_11',
        sourceLink:
          'https://etherscan.io/address/0x13e120F6c8E747983F7aaF0f7731796bfcb0D934#code',
        proofSystem: ZK_CATALOG_TAGS.STARK.Stwo,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0x13e120F6c8E747983F7aaF0f7731796bfcb0D934',
            ),
            overrideUsedIn: [ProjectId('starknet'), ProjectId('paradex')],
          },
        ],
        verificationStatus: 'successful',
        verificationSteps:
          'Onchain stwo verifier smart contracts contain code that directly checks proofs of correct Cairo program execution. Unlike SNARK final wraps, it does not contain any additional cryptographic components that need to be independently regenerated because it introduces no new zk circuits. The sources are verified on etherscan and can be examined directly to check the correct implementation of STARK verification protocol.',
        description:
          "Custom verifier ID: SHA256 hash of the address of the immutable verifier smart contract (GpsStatementVerifier) in hex string format '0x...'.",
      },
    ],
  },
}
