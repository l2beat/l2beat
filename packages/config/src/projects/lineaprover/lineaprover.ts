import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ZK_CATALOG_TAGS } from '../../common/zkCatalogTags'
import { TRUSTED_SETUPS } from '../../common/zkCatalogTrustedSetups'
import type { BaseProject } from '../../types'

export const lineaprover: BaseProject = {
  id: ProjectId('lineaprover'),
  slug: 'lineaprover',
  name: 'Linea',
  shortName: undefined,
  addedAt: UnixTime.fromDate(new Date('2025-07-18')),
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description:
      'Linea proving system is designed for proving EVM code execution and mainly used for proving Linea L2 state transitions.',
    links: {
      websites: ['https://linea.build/blog/the-linea-prover-explained'],
      documentation: [
        'https://eprint.iacr.org/2022/1633.pdf',
        'https://docs.linea.build/technology/prover',
      ],
      repositories: [
        'https://github.com/Consensys/linea-monorepo/tree/main/prover',
        'https://github.com/Consensys/gnark?tab=readme-ov-file',
      ],
    },
    badges: [],
  },
  zkCatalogInfo: {
    creator: 'Consensys',
    techStack: {
      zkVM: [
        ZK_CATALOG_TAGS.Plonk.linea,
        ZK_CATALOG_TAGS.ISA.EVM,
        ZK_CATALOG_TAGS.curve['BLS12-377'],
        ZK_CATALOG_TAGS.curve['BW6-761'],
      ],
      finalWrap: [
        ZK_CATALOG_TAGS.Plonk.Gnark,
        ZK_CATALOG_TAGS.curve.BN254,
        // ZK_CATALOG_TAGS.PCS.KZG,
      ],
    },
    proofSystemInfo: '',
    trustedSetups: [
      {
        proofSystem: ZK_CATALOG_TAGS.Plonk.Gnark,
        ...TRUSTED_SETUPS.AztecIgnition,
      },
      {
        proofSystem: ZK_CATALOG_TAGS.Plonk.Gnark,
        ...TRUSTED_SETUPS.Aleo,
      },
      {
        proofSystem: ZK_CATALOG_TAGS.Plonk.Gnark,
        ...TRUSTED_SETUPS.CeloPlumo,
      },
    ],
    verifierHashes: [
      {
        hash: '0x7a181b5c0d9f93a5935cd1249aaa8e60a0e8f729d78325303e3a7dd769413b5b',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Gnark,
        knownDeployments: [
          'https://etherscan.io/address/0x9473C37A9fE76fbbc3Fd7d3b59E1b550415bd873',
        ],
        verificationStatus: 'notVerified',
        usedBy: [ProjectId('linea')],
        description:
          'Custom verifier ID: SHA256 hash of all VK_... values from the smart contract, abi packed in the same order they are defined.',
      },
    ],
  },
}
