import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ZK_CATALOG_TAGS } from '../../common/zkCatalogTags'
import { TRUSTED_SETUPS } from '../../common/zkCatalogTrustedSetups'
import type { BaseProject } from '../../types'

export const aztecv1prover: BaseProject = {
  id: ProjectId('aztecv1prover'),
  slug: 'aztecv1prover',
  name: 'Aztec v1',
  shortName: undefined,
  addedAt: UnixTime.fromDate(new Date('2025-08-15')),
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description:
      'A Plonk proof system designed by Aztec for client-side proving of private token transfers on zk.money L2.',
    links: {
      websites: ['https://docs.aztec.network/aztec_connect_sunset'],
      documentation: [
        'https://github.com/AztecProtocol/aztec-v1/blob/develop/AZTEC.pdf',
        'https://github.com/AztecProtocol/aztec-v1-specification',
      ],
      repositories: ['https://github.com/AztecProtocol/aztec-v1/tree/develop'],
      socialMedia: ['https://x.com/aztecnetwork'],
    },
    badges: [],
  },
  zkCatalogInfo: {
    creator: 'Aztec',
    techStack: {
      snark: [
        ZK_CATALOG_TAGS.Plonk.AztecV1,
        ZK_CATALOG_TAGS.curve.BN254,
        ZK_CATALOG_TAGS.Other.CustomCircuits,
      ],
    },
    proofSystemInfo: '',
    trustedSetups: [
      {
        proofSystem: ZK_CATALOG_TAGS.Plonk.AztecV1,
        ...TRUSTED_SETUPS.AztecIgnition,
      },
    ],
    verifierHashes: [
      {
        hash: '0x7c8a64f644c60e33445be862185b65bf2096c00c9691f49bd03df5f3ce6b6abf',
        proofSystem: ZK_CATALOG_TAGS.Plonk.AztecV1,
        knownDeployments: [
          'https://etherscan.io/address/0x48Cb7BA00D087541dC8E2B3738f80fDd1FEe8Ce8',
        ],
        verificationStatus: 'notVerified',
        usedBy: [ProjectId('aztec')],
        description:
          'Custom verifier ID: SHA256 hash of the abi packed array of uint256 obtained from flattening VerificationKey structure returned by get_verification_key() of Rollup1x2Vk library.',
      },
    ],
  },
}
