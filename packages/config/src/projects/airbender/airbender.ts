import { ChainSpecificAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ZK_CATALOG_TAGS } from '../../common/zkCatalogTags'
import { TRUSTED_SETUPS } from '../../common/zkCatalogTrustedSetups'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

export const airbender: BaseProject = {
  id: ProjectId('airbender'),
  slug: 'airbender',
  name: 'Airbender',
  shortName: undefined,
  aliases: ['Matter Labs', 'ZKsync'],
  addedAt: UnixTime.fromDate(new Date('2025-09-09')),
  display: {
    description:
      'Airbender is the latest prover of Matter Labs, it proves RISC-V programs.',
    links: {
      documentation: [
        'https://docs.zksync.io/zksync-protocol/zksync-airbender/overview',
        'https://github.com/matter-labs/zksync-airbender/blob/main/docs/README.md',
      ],
      repositories: [
        'https://github.com/matter-labs/zksync-airbender/tree/main',
      ],
      websites: ['https://www.zksync.io/airbender'],
    },
    badges: [],
  },
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  zkCatalogInfo: {
    creator: 'Matter Labs',
    techStack: {
      zkVM: [
        ZK_CATALOG_TAGS.STARK.Airbender,
        ZK_CATALOG_TAGS.ISA.RISCV32,
        ZK_CATALOG_TAGS.Field.Mersenne31,
      ],
      finalWrap: [
        // ZK_CATALOG_TAGS.Plonk.Bellman,
        ZK_CATALOG_TAGS.Fflonk.Zksync,
        ZK_CATALOG_TAGS.curve.BN254,
        // ZK_CATALOG_TAGS.PCS.KZG,
      ],
    },
    proofSystemInfo: readProjectMarkdown('airbender', 'proofSystemInfo'),
    trustedSetups: [
      {
        proofSystem: ZK_CATALOG_TAGS.Plonk.Bellman,
        ...TRUSTED_SETUPS.AztecIgnition,
      },
      {
        proofSystem: ZK_CATALOG_TAGS.Fflonk.Zksync,
        ...TRUSTED_SETUPS.AztecIgnition,
      },
    ],
    projectsForTvs: [
      {
        projectId: ProjectId('adi'),
        sinceTimestamp: UnixTime(1764107759),
      },
    ],
    verifierHashes: [
      // {
      //   // Used by ADI protocol versions v30.0 and v30.1 (until the 2026-09-09 v30.2 upgrade).
      //   hash: '0x124ebcd537a1e1c152774dd18f67660e35625bba0b669bf3b4836d636b105337',
      //   name: 'Airbender Plonk Adi v30.1 verifier',
      //   sourceLink:
      //     'https://github.com/matter-labs/zksync-os/tree/v0.2.5/zksync_os',
      //   proofSystem: ZK_CATALOG_TAGS.Plonk.Bellman,
      //   knownDeployments: [
      //     {
      //       address: ChainSpecificAddress.fromLong(
      //         'ethereum',
      //         '0x08513A4646d1Bc8c348C67A3680bb19626E7F13F',
      //       ),
      //     },
      //   ],
      //   verificationStatus: 'successful',
      //   attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
      //   verificationSteps: readProjectMarkdown(
      //     'airbender',
      //     'verificationSteps-0x124ebcd5',
      //   ),
      // },
      {
        hash: '0x194abd368017773c8a8b62fdee6885816bd30110ff293508f9ec9b58c8c10982',
        name: 'Airbender Plonk Adi v30.2 verifier',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Bellman,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0xC1288A84C5b2c93Ed4bF712fF4Bb96D862b32aa9',
            ),
          },
        ],
        verificationStatus: 'notVerified',
      },
    ],
  },
}
