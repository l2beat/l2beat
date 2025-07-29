import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ZK_CATALOG_TAGS } from '../../common/zkCatalogTags'
import { TRUSTED_SETUPS } from '../../common/zkCatalogTrustedSetups'
import type { BaseProject } from '../../types'

export const openvmprover: BaseProject = {
  id: ProjectId('openvmprover'),
  slug: 'openvmprover',
  name: 'Scroll',
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
    description:
      'OpenVM prover is a zk proving system for customizable modular VM built by Scroll.',
    links: {
      websites: ['https://docs.scroll.io/en/home/'],
      documentation: [
        'https://book.openvm.dev',
        'https://www.youtube.com/watch?v=NHwd-gJ8xg4',
      ],
      repositories: [
        'https://github.com/scroll-tech/zkvm-prover/tree/master/crates/prover1',
      ],
    },
    badges: [],
  },
  zkCatalogInfo: {
    creator: 'Scroll',
    techStack: {
      zkVM: [
        ZK_CATALOG_TAGS.STARK.ZkvmProver,
        ZK_CATALOG_TAGS.ISA.OpenVM,
        // ZK_CATALOG_TAGS.Arithmetization.AIR,
        ZK_CATALOG_TAGS.Field.BabyBear,
      ],
      finalWrap: [
        ZK_CATALOG_TAGS.Plonk.Halo2,
        ZK_CATALOG_TAGS.curve.BN254,
        ZK_CATALOG_TAGS.PCS.KZG,
      ],
    },
    proofSystemInfo: '',
    trustedSetups: [
      {
        proofSystem: ZK_CATALOG_TAGS.Plonk.Halo2,
        ...TRUSTED_SETUPS.Halo2KZG,
      },
    ],
    verifierHashes: [
      {
        // Custom verifier ID: SHA256 hash of the verifier byte code in the hex format '0x...'
        hash: '0xeea69613c0ab56b156122ce41ac52afc8434e8d2fa1b57cdd5e2c1491e06aaf9',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Halo2,
        knownDeployments: [
          'https://etherscan.io/address/0x7F1A3E1299F44baefE20CB2bcD62a75cA00c20d6',
        ],
        verificationStatus: 'notVerified',
        usedBy: [ProjectId('scroll')],
      },
    ],
  },
}
