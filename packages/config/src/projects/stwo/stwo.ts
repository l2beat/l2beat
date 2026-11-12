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
        hash: '0x356596561d32ae7213471ceb91210afa2e61f6120a7644a4d48830d15517bc12',
        name: 'Stwo GPS statement verifier 2026_14',
        sourceLink:
          'https://etherscan.io/address/0x91C57B64738b80f4494d83b485AD3f9C0f95E2A3#code',
        proofSystem: ZK_CATALOG_TAGS.STARK.Stwo,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0x91C57B64738b80f4494d83b485AD3f9C0f95E2A3',
            ),
            overrideUsedIn: [ProjectId('starknet'), ProjectId('paradex')],
          },
        ],
        verificationStatus: 'successful',
        verificationSteps:
          'The immutable Solidity sources are verified on Etherscan and expose every selected CPU verifier, memory-page registry, outer bootloader contract, and bootloader configuration hash. Source verification of the Solidity contracts does not by itself reproduce the Cairo programs hidden behind the bootloader configuration hash.',
        description:
          "Custom verifier ID: SHA256 hash of the address of the immutable GPS statement verifier in hex string format '0x...'.",
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
            // TODO: Remove after the referral of the 2026_14 verifier expires on 2026-11-28.
            overrideUsedIn: [ProjectId('starknet'), ProjectId('paradex')],
          },
        ],
        verificationStatus: 'successful',
        verificationSteps:
          'The immutable Solidity sources are verified on Etherscan and expose every selected CPU verifier, memory-page registry, outer bootloader contract, and bootloader configuration word. Source verification of the Solidity contracts does not by itself reproduce the Cairo programs hidden behind the recursive-verifier allowlist commitment.',
        description:
          "Previous default verifier. Its facts are accepted through the referral of the 2026_14 verifier until 2026-11-28. Custom verifier ID: SHA256 hash of the address of the immutable GPS statement verifier in hex string format '0x...'.",
      },
    ],
  },
}
