import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
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
      repositories: [
        'https://github.com/elliottech/lighter-prover/tree/main',
        'https://github.com/elliottech',
      ],
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

However Lighter wraps these STARK in a [gnark](https://github.com/Consensys/gnark) implementation of Plonk over BN254 curve, which requires a trusted setup.

### Circuits

The proof system operates on Lighter STF circuits and desert mode circuits. All published circuits are available [here](https://github.com/elliottech/lighter-prover/tree/053ceda7c59a9a0e05997661ca5a1bb7a92bb267/circuit), note that the Lighter team has not published the desert circuits yet. 

Lighter proof system defines circuits for proving all transactions, including internal, L1 and L2 transactions. The full list of available transactions that define Lighter STF can be seen [here](https://github.com/elliottech/lighter-prover/tree/053ceda7c59a9a0e05997661ca5a1bb7a92bb267/circuit/src/transactions). 

Transaction circuits use custom implementations for arithmetic operations ([bigint](https://github.com/elliottech/lighter-prover/tree/053ceda7c59a9a0e05997661ca5a1bb7a92bb267/circuit/src/bigint), [uint](https://github.com/elliottech/lighter-prover/tree/053ceda7c59a9a0e05997661ca5a1bb7a92bb267/circuit/src/uint)), cryptographic primitives ([ecdsa](https://github.com/elliottech/lighter-prover/tree/053ceda7c59a9a0e05997661ca5a1bb7a92bb267/circuit/src/ecdsa) on the Secp256k1 curve, [eddsa](https://github.com/elliottech/lighter-prover/tree/053ceda7c59a9a0e05997661ca5a1bb7a92bb267/circuit/src/eddsa) on the ECgFp5 curve, [keccak](https://github.com/elliottech/lighter-prover/tree/053ceda7c59a9a0e05997661ca5a1bb7a92bb267/circuit/src/keccak), [poseidon_bn128](https://github.com/elliottech/lighter-prover/tree/053ceda7c59a9a0e05997661ca5a1bb7a92bb267/circuit/src/poseidon_bn128)) and other helper circuits.

### Recursion

Lighter prover implements recursive aggregation of transaction proofs to make the whole pipeline more efficient and parallelizable. First, fixed-size blocks of consecutive transactions are processed and proven by [BlockTx circuit](https://github.com/elliottech/lighter-prover/blob/053ceda7c59a9a0e05997661ca5a1bb7a92bb267/circuit/src/block_tx_constraints.rs), which can be done on separate machines. Next, arbitrary number of BlockTx proofs are aggregated into a single proof by [BlockTxChain circuit](https://github.com/elliottech/lighter-prover/blob/053ceda7c59a9a0e05997661ca5a1bb7a92bb267/circuit/src/block_tx_chain_constraints.rs), which includes continuity checks across all BlockTx proofs.
`,
    trustedSetups: [
      {
        proofSystem: ZK_CATALOG_TAGS.Plonk.Gnark,
        ...TRUSTED_SETUPS.AztecIgnition,
      },
    ],
    projectsForTvs: [
      {
        projectId: ProjectId('lighter'),
        sinceTimestamp: UnixTime(1759356000),
      },
    ],
    verifierHashes: [
      {
        // ZKLighterVerifier
        hash: '0x4a5c9d5981ae8f323f0ce7f93733b6b1b66e502e035768a8f3e4f1a23a287338',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Gnark,
        knownDeployments: [
          {
            address: EthereumAddress(
              '0x7ddAD28962571F77fE5E9cB2fE74A896300EEed4',
            ),
            chain: 'ethereum',
          },
        ],
        verificationStatus: 'notVerified',
        description:
          'Custom verifier ID: SHA256 hash of all VK_... values from the smart contract, abi packed in the same order they are defined.',
      },
      {
        // DesertVerifier
        hash: '0xc3d58029fabf2a93d6cb9b96315c484e4bea2e238aaa081460c9027863c650e7',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Gnark,
        knownDeployments: [
          {
            address: EthereumAddress(
              '0xd4460475F00307845082d3a146f36661354FBc67',
            ),
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
