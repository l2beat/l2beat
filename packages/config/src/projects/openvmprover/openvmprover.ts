import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ZK_CATALOG_TAGS } from '../../common/zkCatalogTags'
import { TRUSTED_SETUPS } from '../../common/zkCatalogTrustedSetups'
import type { BaseProject } from '../../types'

export const openvmprover: BaseProject = {
  id: ProjectId('openvmprover'),
  slug: 'openvmprover',
  name: 'OpenVM',
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
      'OpenVM prover is a zk proving system for customizable modular VM built by Axiom and used to prove Scroll L2 STF.',
    links: {
      websites: ['https://openvm.dev'],
      documentation: [
        'https://book.openvm.dev',
        'https://openvm.dev/whitepaper.pdf',
        'https://www.youtube.com/watch?v=NHwd-gJ8xg4',
      ],
      repositories: [
        'https://github.com/openvm-org/openvm',
        'https://github.com/scroll-tech/zkvm-prover/tree/master',
      ],
      socialMedia: ['https://t.me/openvm'],
    },
    badges: [],
  },
  milestones: [
    {
      title:
        '[Disclosed vulnerability] Plonky3 final polynomial degree check vulnerability',
      url: 'https://forum.scroll.io/t/security-council-report-scroll-mainnet-emergency-upgrade-on-2025-05-26/810',
      date: '2025-05-26T00:00:00Z',
      description:
        'Fix of a bug in OpenVM that was analogous to an identified vulnerability in Plonky3 library.',
      type: 'incident',
    },
  ],
  zkCatalogInfo: {
    creator: 'Axiom',
    techStack: {
      zkVM: [
        ZK_CATALOG_TAGS.STARK.Plonky3,
        ZK_CATALOG_TAGS.ISA.OpenVM,
        // ZK_CATALOG_TAGS.Arithmetization.AIR,
        ZK_CATALOG_TAGS.Field.BabyBear,
      ],
      finalWrap: [
        ZK_CATALOG_TAGS.Plonk.Halo2,
        ZK_CATALOG_TAGS.curve.BN254,
        ZK_CATALOG_TAGS.PCS.KZG,
      ],
    },
    proofSystemInfo: `
    
    ## Description

    [OpenVM](https://github.com/openvm-org/openvm?tab=readme-ov-file) is a STARK proving system based on [Plonky3 proving library](https://github.com/Plonky3/Plonky3), that has “no-CPU” design paradigm and allows adding new custom instructions to its instruction set architecture (ISA). It supports [recursive STARK aggregation](https://docs.openvm.dev/book/guest-libraries/verify-stark) and provides an [SDK](https://github.com/openvm-org/openvm-solidity-sdk) for creating Solidity verifier smart contracts. 

    ## Proof system

    The proof system is split into ZK frontend, i.e. arithmetization, and ZK backend, i.e. a polynomial IOP with the Fiat-Shamir heuristic. In practice, a batched FRI-based polynomial commitment is used as the backend. OpenVM backend relies on Plonky3 prover system.

    OpenVM arithmetizes the execution trace using AIR with Interactions over BabyBear prime field. Interactions which include LogUp, permutation check and others.

    ### zkVM design

    OpenVM uses read-only program memory, read/write data memory as well as inputs and hints from host to enable non-deterministic computation. The execution logic is organized into a set of system chips and custom chips, without any centralized CPU-like chip. Interactions between chips are managed by program, execution and memory buses.

    Currently OpenVM ISA supports RISC-V instructions, keccak-256 and SHA256 hash functions, int256 arithmetic, modular arithmetic over arbitrary fields, some elliptic curve operations for the secp256k1 and secp256r1 curves and pairing operations on the BN254 and BLS12-381 curves.

    ### Recursion circuits

    OpenVM supports recursive proving and continuations, i.e. splitting a single execution trace into several rather independent ones, by recursive verification of generated STARK proofs in a specialized OpenVM program optimized for efficient proof verification (called native VM).

    ### Final wrap

The STARK proof is wrapped in Halo2 SNARK with KZG commitments over BN254 curve for efficient onchain processing. KZG commitment relies on Perpetual Powers of Tau trusted setup ceremony, see [below](#trusted-setups) for more details.
`,
    trustedSetups: [
      {
        proofSystem: ZK_CATALOG_TAGS.Plonk.Halo2,
        ...TRUSTED_SETUPS.Halo2KZG,
      },
    ],
    verifierHashes: [
      {
        hash: '0xeea69613c0ab56b156122ce41ac52afc8434e8d2fa1b57cdd5e2c1491e06aaf9',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Halo2,
        knownDeployments: [
          {
            address: '0x39854DF30b3482Ef546F68B8981Fae5A2C426eA4',
            chain: 'ethereum',
          },
        ],
        verificationStatus: 'notVerified',
        description:
          "Custom verifier ID: SHA256 hash of the verifier byte code string in the hex format '0x...'.",
      },
    ],
  },
}
