import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ZK_CATALOG_TAGS } from '../../common/zkCatalogTags'
import { TRUSTED_SETUPS } from '../../common/zkCatalogTrustedSetups'
import type { BaseProject } from '../../types'

export const zircuitprover: BaseProject = {
  id: ProjectId('zircuitprover'),
  slug: 'zircuitprover',
  name: 'Zircuit',
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
      'Modular proving system based on Halo2 with KZG designed by Zircuit for proving STF of their L2.',
    links: {
      documentation: [
        'https://docs.zircuit.com/architecture-and-concepts/architecture/modular-prover-design',
      ],
      repositories: ['https://github.com/zircuit-labs'],
    },
    badges: [],
  },
  zkCatalogInfo: {
    creator: 'Zircuit Labs',
    techStack: {
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
        ...TRUSTED_SETUPS.Zircuit,
      },
    ],
    verifierHashes: [
      {
        hash: '0x167f5fa574c6c6d9dec2cca7c084f607c905044487a03eb3290089b218bd1f0f',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Halo2,
        knownDeployments: [
          'https://etherscan.io/address/0x5d4f36e70ab3ccd8ca898a06c2d725b22a1d57f0',
        ],
        verificationStatus: 'notVerified',
        usedBy: [ProjectId('zircuit')],
      },
    ],
  },
}
