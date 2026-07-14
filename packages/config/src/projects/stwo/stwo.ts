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
            overrideUsedIn: [ProjectId('paradex')],
          },
        ],
        verificationStatus: 'successful',
        verificationSteps:
          'Onchain stwo verifier smart contracts contain code that directly checks proofs of correct Cairo program execution. Unlike SNARK final wraps, it does not contain any additional cryptographic components that need to be independently regenerated because it introduces no new zk circuits. The sources are verified on etherscan and can be examined directly to check the correct implementation of STARK verification protocol.',
        description:
          "Custom verifier ID: SHA256 hash of the address of the immutable verifier smart contract (GpsStatementVerifier) in hex string format '0x...'.",
      },
      {
        hash: '0x243611f51b76871574612cc0f140acb660c684a66b74e37b7547474c6683659a',
        name: 'Stwo GPS statement verifier 2026_13_4',
        sourceLink:
          'https://etherscan.io/address/0x4956bda1d23F75B988644329c5B06BD1494a72b6#code',
        proofSystem: ZK_CATALOG_TAGS.STARK.Stwo,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0x4956bda1d23F75B988644329c5B06BD1494a72b6',
            ),
            overrideUsedIn: [ProjectId('starknet')],
          },
        ],
        verificationStatus: 'successful',
        verificationSteps:
          'The immutable Solidity sources are verified on Etherscan and expose every selected CPU verifier, memory-page registry, outer bootloader contract, and bootloader configuration word. Source verification of the Solidity contracts does not by itself reproduce the Cairo programs hidden behind the recursive-verifier allowlist commitment.',
        description:
          "Custom verifier ID: SHA256 hash of the address of the immutable GPS statement verifier in hex string format '0x...'.",
      },
      {
        hash: '0x5c74473c5450f2d4ad933e8862bd570a5743b88fdf8a8c19bc42d04768b042af',
        name: 'Stwo GPS statement verifier 2026_13_3',
        sourceLink:
          'https://etherscan.io/address/0xE67515a751291445B85b2F176c1eCdf08e86b406#code',
        proofSystem: ZK_CATALOG_TAGS.STARK.Stwo,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0xE67515a751291445B85b2F176c1eCdf08e86b406',
            ),
            // TODO: Remove after the current GPS referral expires on 2026-08-01.
            overrideUsedIn: [ProjectId('starknet')],
          },
        ],
        verificationStatus: 'successful',
        verificationSteps:
          'The immutable Solidity sources are verified on Etherscan and expose every selected CPU verifier, memory-page registry, outer bootloader contract, and bootloader configuration word. Source verification of the Solidity contracts does not by itself reproduce the Cairo programs hidden behind the recursive-verifier allowlist commitment.',
        description:
          "This registry remains in Starknet's accepted fact chain only until the current verifier's referral expires. The custom verifier ID is the SHA256 hash of this address in checksummed hex-string format.",
      },
    ],
  },
}
