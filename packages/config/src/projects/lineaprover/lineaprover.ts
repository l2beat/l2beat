import { ChainSpecificAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ZK_CATALOG_TAGS } from '../../common/zkCatalogTags'
import { TRUSTED_SETUPS } from '../../common/zkCatalogTrustedSetups'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

export const lineaprover: BaseProject = {
  id: ProjectId('lineaprover'),
  slug: 'lineaprover',
  name: 'Linea',
  shortName: undefined,
  aliases: ['ConsenSys'],
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
        ZK_CATALOG_TAGS.Field.KoalaBear,
      ],
      finalWrap: [
        ZK_CATALOG_TAGS.Plonk.Gnark,
        ZK_CATALOG_TAGS.curve.BN254,
        // ZK_CATALOG_TAGS.PCS.KZG,
      ],
    },
    proofSystemInfo: readProjectMarkdown('lineaprover', 'proofSystemInfo'),
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
    projectsForTvs: [
      {
        projectId: ProjectId('linea'),
        sinceTimestamp: UnixTime(1689112800),
      },
    ],
    verifierHashes: [
      {
        hash: '0x29483dd4b0cd0a98968ab25795ae2363ed422fe575a20f55ac331519c3e846e1',
        name: 'Linea Plonk Type 0',
        sourceLink:
          'https://github.com/Consensys/linea-monorepo/tree/b90a3c0b6735ba39dc19356628c09c03e42c016d/prover',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Gnark,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0x218C3339ff3fea595c02Ac31Ca8A782f5028C4dc',
            ),
          },
        ],
        verificationStatus: 'successful',
        verificationSteps: readProjectMarkdown(
          'lineaprover',
          'verificationSteps-0x29483dd4',
        ),
        description:
          'Custom verifier ID: SHA256 hash of all VK_... values from the smart contract, abi packed in the same order they are defined.',
      },
      {
        hash: '0xd92b8281296cbfe1963093c23f9fb7fef6f9debfa9115622ca412c32b848aa52',
        name: 'Linea Plonk Type 1',
        sourceLink:
          'https://github.com/Consensys/linea-monorepo/tree/988bbce27b61a5e5a29913468d06d0a124dea8e4/prover',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Gnark,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0x0D0f070386edC441A63fB8FAe8FB937Bbd88c5Cb',
            ),
          },
        ],
        verificationStatus: 'successful',
        verificationSteps: readProjectMarkdown(
          'lineaprover',
          'verificationSteps-0xd92b8281',
        ),
        description:
          'Custom verifier ID: SHA256 hash of all VK_... values from the smart contract, abi packed in the same order they are defined.',
      },
    ],
  },
}
