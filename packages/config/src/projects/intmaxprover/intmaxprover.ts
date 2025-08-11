import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ZK_CATALOG_TAGS } from '../../common/zkCatalogTags'
import { TRUSTED_SETUPS } from '../../common/zkCatalogTrustedSetups'
import type { BaseProject } from '../../types'

export const intmaxprover: BaseProject = {
  id: ProjectId('intmaxprover'),
  slug: 'intmaxprover',
  name: 'INTMAX',
  shortName: undefined,
  addedAt: UnixTime.fromDate(new Date('2025-08-04')),
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description:
      'A zk proving system designed by INTMAX for client-side proving of private token transfers on INTMAX L2.',
    links: {
      websites: ['https://intmax.io'],
      documentation: [
        'https://intmax-wallet.gitbook.io/intmax-developers-hub/nodes/provers',
        'https://eprint.iacr.org/2023/1082.pdf',
      ],
      repositories: ['https://github.com/InternetMaximalism/intmax2-zkp'],
    },
    badges: [],
  },
  zkCatalogInfo: {
    creator: 'INTMAX',
    techStack: {
      snark: [
        ZK_CATALOG_TAGS.STARK.Plonky2,
        ZK_CATALOG_TAGS.Field.Goldilocks,
        ZK_CATALOG_TAGS.Other.CustomCircuits,
      ],
      finalWrap: [ZK_CATALOG_TAGS.Plonk.Gnark, ZK_CATALOG_TAGS.curve.BN254],
    },
    proofSystemInfo: '',
    trustedSetups: [
      {
        proofSystem: ZK_CATALOG_TAGS.Plonk.Gnark,
        ...TRUSTED_SETUPS.AztecIgnition,
      },
    ],
    verifierHashes: [
      {
        hash: '0xd734aa793e515feaa69cd93eeeeba1f383e521f360a04220c62485e7c8d746fd',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Gnark,
        knownDeployments: [
          'https://scrollscan.com/address/0xaBA5fD516B665C12d7577Db36831474ac16aEe0a',
        ],
        verificationStatus: 'notVerified',
        usedBy: [ProjectId('intmax')],
        description:
          'Custom verifier ID: SHA256 hash of all VK_... values from the smart contract, abi packed in the same order they are defined.',
      },
    ],
  },
}
