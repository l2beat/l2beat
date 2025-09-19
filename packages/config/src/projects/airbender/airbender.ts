import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ZK_CATALOG_TAGS } from '../../common/zkCatalogTags'
import { TRUSTED_SETUPS } from '../../common/zkCatalogTrustedSetups'
import type { BaseProject } from '../../types'

export const airbender: BaseProject = {
  id: ProjectId('airbender'),
  slug: 'airbender',
  name: 'Airbender',
  shortName: undefined,
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
        ZK_CATALOG_TAGS.ISA.RISCV,
        ZK_CATALOG_TAGS.Field.Mersenne31,
      ],
      finalWrap: [
        // ZK_CATALOG_TAGS.Plonk.Bellman,
        ZK_CATALOG_TAGS.Fflonk.Zksync,
        ZK_CATALOG_TAGS.curve.BN254,
        // ZK_CATALOG_TAGS.PCS.KZG,
      ],
    },
    proofSystemInfo: `
    ## Description

    Airbender is the most advanced zkVM developed by Matter Labs. It operates on RISC-V ISA and is designed to prove state transition function of [zk stack](https://zkstack.io) chains in combination with [ZKsync OS](https://github.com/matter-labs/zksync-os), but also more general RISC-V programs. Airbender proofs could be [wrapped into Fflonk SNARK](https://github.com/matter-labs/zkos-wrapper) for efficient onchain verification. Airbender initial release [targets 81 bits of security](https://x.com/eth_proofs/status/1942468407896543694).

    ## Proof system

    Airbender implements a rather standard zkVM: AIR constraints, [DEEP-FRI](https://eprint.iacr.org/2019/336) polynomial testing, RISC-V instructions with the program being stored in read-only memory and accessed by lookup arguments, recursive proving. 

    Many parts of the stack are optimized for speed and efficiency, including a small Mersenne31 field over which the computation trace is generated and a simple degree 2 AIR constraints. Airbender prover could also be run in application mode without signed multiplication and division operations, thus reducing circuit complexity.

    ### Recursion circuits

    Airbender targets proving batches of size 2**22 (~4 M) clock cycles. The proofs of such batches are pairwise recursively aggregated using zkVM in recursion mode. For onchain verification, the final Airbender STARK is [compressed using Boojum compressor](https://github.com/matter-labs/zkos-wrapper) and then wrapped into a Fflonk SNARK with KZG. The KZG commitment is done over BN254 curve and it uses Aztec Ignition trusted setup ceremony, see [below](#trusted-setups) for more details.
    `,
    trustedSetups: [
      // I am assuming that Airbender will only have the FFLONK final wrap as their docs indicate
      {
        proofSystem: ZK_CATALOG_TAGS.Fflonk.Zksync,
        ...TRUSTED_SETUPS.AztecIgnition,
      },
    ],
    verifierHashes: [],
  },
}
