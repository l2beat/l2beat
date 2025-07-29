import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ZK_CATALOG_TAGS } from '../../common/zkCatalogTags'
import { TRUSTED_SETUPS } from '../../common/zkCatalogTrustedSetups'
import type { BaseProject } from '../../types'

export const risc0: BaseProject = {
  id: ProjectId('risc0'),
  slug: 'risc0',
  name: 'RISC Zero',
  shortName: undefined,
  addedAt: UnixTime.fromDate(new Date('2025-07-21')),
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description: 'Risc0 is a zkVM proving system for RISC-V programs.',
    links: {
      websites: ['https://risczero.com'],
      documentation: ['https://dev.risczero.com/'],
      repositories: ['https://github.com/risc0/risc0'],
      socialMedia: [
        'https://x.com/RiscZero',
        'https://youtube.com/@risczero',
        'https://discord.com/invite/risczero',
      ],
    },
    badges: [],
  },
  zkCatalogInfo: {
    creator: 'RISC Zero',
    techStack: {
      zkVM: [
        ZK_CATALOG_TAGS.STARK.RISC0,
        ZK_CATALOG_TAGS.ISA.RISCV,
        // ZK_CATALOG_TAGS.Arithmetization.AIR,
        ZK_CATALOG_TAGS.Field.BabyBear,
      ],
      finalWrap: [
        ZK_CATALOG_TAGS.Groth16.Snarkjs,
        ZK_CATALOG_TAGS.curve.BN254,
        // ZK_CATALOG_TAGS.Arithmetization.R1CS,
        // ZK_CATALOG_TAGS.PCS.KZG,
      ],
    },
    proofSystemInfo: '',
    trustedSetups: [
      {
        proofSystem: ZK_CATALOG_TAGS.Groth16.Snarkjs,
        ...TRUSTED_SETUPS.Risc0,
      },
    ],
    verifierHashes: [
      {
        // the value of internal pure function verifier_key_digest() of the RiscZeroGroth16Verifier.sol
        hash: '0x21c5fdd9b4d576b17581f50b755482ba7a2134a3b5186e8e454acfa1f69511ab',
        proofSystem: ZK_CATALOG_TAGS.Groth16.Snarkjs,
        knownDeployments: [
          'https://etherscan.io/address/0x20ff7c2cf391a5f096a2cc181cb41916680f8e97',
          'https://etherscan.io/address/0xafB31f5b70623CDF4b20Ada3f7230916A5A79df9',
          'https://arbiscan.io/address/0xac292cf957dd5ba174cda13b05c16afc71700327',
          'https://etherscan.io/address/0x34Eda8BfFb539AeC33078819847B36D221c6641c',
        ],
        verificationStatus: 'notVerified',
        usedBy: [ProjectId('taiko'), ProjectId('bob'), ProjectId('hibachi')],
      },
    ],
  },
}
