import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ZK_CATALOG_TAGS } from '../../common/zkCatalogTags'
import { TRUSTED_SETUPS } from '../../common/zkCatalogTrustedSetups'
import type { BaseProject } from '../../types'

export const lighterprover: BaseProject = {
  id: ProjectId('lighterprover'),
  slug: 'lighterprover',
  name: 'Lighter',
  shortName: undefined,
  addedAt: UnixTime.fromDate(new Date('2025-10-08')),
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description:
      'A ZK proving system designed by Lighter for proving their DEX L2 focused on trading perpetuals.',
    links: {
      websites: ['https://lighter.xyz'],
      documentation: ['https://docs.lighter.xyz'],
      repositories: ['https://github.com/elliottech'],
    },
    badges: [],
  },
  zkCatalogInfo: {
    creator: 'Lighter',
    techStack: {
      snark: [
        ZK_CATALOG_TAGS.Plonk.Plonky2,
        ZK_CATALOG_TAGS.Field.Goldilocks,
        ZK_CATALOG_TAGS.Other.CustomCircuits,
      ],
      finalWrap: [ZK_CATALOG_TAGS.Plonk.Gnark, ZK_CATALOG_TAGS.curve.BN254],
    },
    proofSystemInfo: `
    ## Description

Lighter prover is a zk proving system for Lighter L2 based on [Plonky2](https://github.com/0xPolygonZero/plonky2/tree/main) circuits. It verifies the logic for regular state transition of Lighter L2, as well as state transitions in the “desert mode” when L2 is shut down and users exit, using different sets of circuits. The circuits are proven with a STARK which is wrapped into a Plonk SNARK before settling onchain.

## Proof system

[Plonky2](https://github.com/0xPolygonZero/plonky2) implements a circuit aritmetization based on TurboPlonk over Goldilocks field, but it replaces KZG polynomial commitment scheme with a FRI-based polynomial testing scheme. In this way proving Plonky2 circuits requires no trusted setup, i.e. it is a STARK. 

However Lighter wraps these STARK in a [gnark](https://github.com/Consensys/gnark) implementation of Plonk over BN254 curve, which requires a trusted setup (see [below](#trusted-setups) for more details).

### Circuits

The proof system operates on Lighter STF circuits, desert mode circuits and state root upgrade verifier circuits. The Lighter team has not published any of these circuits yet.
`,
    trustedSetups: [
      {
        proofSystem: ZK_CATALOG_TAGS.Plonk.Gnark,
        ...TRUSTED_SETUPS.AztecIgnition,
      },
    ],
    verifierHashes: [
      {
        hash: '0x1653e6bc18d8da44afcae150e9c675f46e41a727c2867289b00cbe1afaed0316',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Gnark,
        knownDeployments: [
          {
            address: '0x9a3Cc15b31Aec100d0C49B16cC401eaEf5A0A500',
            chain: 'ethereum',
          },
        ],
        verificationStatus: 'notVerified',
        description:
          'Custom verifier ID: SHA256 hash of all VK_... values from the smart contract, abi packed in the same order they are defined.',
      },
    ],
  },
}
