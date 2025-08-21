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
        ZK_CATALOG_TAGS.Plonk.Plonky2,
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
        hash: '0x664dceea25b57766a5b550cf25cca24a7305f36fd60a5835f9e0505bec14ce8e',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Gnark,
        knownDeployments: [
          'https://scrollscan.com/address/0x1d38545a33740Ab3480d9035bB3126914404423d',
        ],
        verificationStatus: 'notVerified',
        usedBy: [ProjectId('intmax')],
        description:
          'Custom verifier ID: SHA256 hash of all VK_... values from the smart contract, abi packed in the same order they are defined.',
      },
    ],
  },
}
