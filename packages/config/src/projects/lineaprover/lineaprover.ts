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
        hash: '0xbe73a8003797063d70b44eba376a814caf3399361069b5e5e43660cc435c27c9',
        name: 'Linea Plonk Type 0',
        // sourceLink:
        //   'https://github.com/Consensys/linea-monorepo/tree/b90a3c0b6735ba39dc19356628c09c03e42c016d/prover',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Gnark,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0xAFF26999780901ee8B48f0a1271a177ff46fD53F',
            ),
          },
        ],
        verificationStatus: 'notVerified',
        description:
          'Custom verifier ID: SHA256 hash of all VK_... values from the smart contract, abi packed in the same order they are defined.',
      },
      // {
      //   hash: '0xd92b8281296cbfe1963093c23f9fb7fef6f9debfa9115622ca412c32b848aa52',
      //   name: 'Linea Plonk Type 1',
      //   sourceLink:
      //     'https://github.com/Consensys/linea-monorepo/tree/988bbce27b61a5e5a29913468d06d0a124dea8e4/prover',
      //   proofSystem: ZK_CATALOG_TAGS.Plonk.Gnark,
      //   knownDeployments: [
      //     {
      //       address: ChainSpecificAddress.fromLong(
      //         'ethereum',
      //         '0x0D0f070386edC441A63fB8FAe8FB937Bbd88c5Cb',
      //       ),
      //     },
      //   ],
      //   verificationStatus: 'successful',
      //   verificationSteps: readProjectMarkdown(
      //     'lineaprover',
      //     'verificationSteps-0xd92b8281',
      //   ),
      //   description:
      //     'Custom verifier ID: SHA256 hash of all VK_... values from the smart contract, abi packed in the same order they are defined.',
      // },
      {
        hash: '0x6ffac481bc247d3ebf14238058f222f104b3b0c0d1617625c41b859045984621',
        name: 'Linea Plonk Type 1',
        sourceLink:
          'https://github.com/Consensys/linea-monorepo/tree/477b0a4288fc54da185a992c47772c377d3ac1e9/prover',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Gnark,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0x09ac9f7E5Fb37e241e0B1e52aaF01eFE0a488a77',
            ),
          },
        ],
        verificationStatus: 'successful',
        verificationSteps: readProjectMarkdown(
          'lineaprover',
          'verificationSteps-0x6ffac481',
        ),
        description:
          'Custom verifier ID: SHA256 hash of all VK_... values from the smart contract, abi packed in the same order they are defined.',
      },
    ],
  },
}
