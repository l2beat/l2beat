import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
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
    projectsForTvs: [
      {
        projectId: ProjectId('scroll'),
        sinceTimestamp: UnixTime(1697493600),
      },
    ],
    verifierHashes: [
      {
        hash: '0xeea69613c0ab56b156122ce41ac52afc8434e8d2fa1b57cdd5e2c1491e06aaf9',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Halo2,
        knownDeployments: [
          {
            address: EthereumAddress(
              '0x39854DF30b3482Ef546F68B8981Fae5A2C426eA4',
            ),
            chain: 'ethereum',
          },
        ],
        verificationStatus: 'notVerified',
        description:
          "Custom verifier ID: SHA256 hash of the verifier byte code string in the hex format '0x...'.",
      },
      {
        hash: '0xd20da378d89e8ff0cb8da8f2e3316b11a1da263111de94a6d2ab0bd9a69c0160',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Halo2,
        knownDeployments: [
          {
            address: EthereumAddress(
              '0x749fC77A1a131632a8b88e8703E489557660C75e',
            ),
            chain: 'ethereum',
          },
        ],
        verificationStatus: 'notVerified',
        description:
          "Custom verifier ID: SHA256 hash of the verifier byte code string in the hex format '0x...'.",
      },
      {
        hash: '0xdd4e59c1c10f04e88f31d9a6cc28e8915b18a3b9770454818f9332bf8c5bb86e',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Halo2,
        knownDeployments: [
          {
            address: EthereumAddress(
              '0xd1638c0C7Bd6bf49D655D855d353aC8b4f949582',
            ),
            chain: 'ethereum',
          },
        ],
        verificationStatus: 'notVerified',
        description:
          "Custom verifier ID: SHA256 hash of the verifier byte code string in the hex format '0x...'.",
      },
      {
        hash: '0x84bee8abb47e23e48f2803a65467c82e2ce7241ee3a2166b0c50f1961afc5636',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Halo2,
        knownDeployments: [
          {
            address: EthereumAddress(
              '0x8c1b52757b5c571ADcB5572E992679d4D48e30f7',
            ),
            chain: 'ethereum',
          },
        ],
        verificationStatus: 'notVerified',
        description:
          "Custom verifier ID: SHA256 hash of the verifier byte code string in the hex format '0x...'.",
      },
      {
        hash: '0x4ec51340896884b1ee3cbbe582a591603fe6079a269658f5885598e9681b8da3',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Halo2,
        knownDeployments: [
          {
            address: EthereumAddress(
              '0x8759E83b6570A0bA46c3CE7eB359F354F816c9a9',
            ),
            chain: 'ethereum',
          },
        ],
        verificationStatus: 'notVerified',
        description:
          "Custom verifier ID: SHA256 hash of the verifier byte code string in the hex format '0x...'.",
      },
      {
        hash: '0x2d16d04b31777cac46405a5f8db57df83992422fa9eba9eedd5b23567e1b92ac',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Halo2,
        knownDeployments: [
          {
            address: EthereumAddress(
              '0x03a72B00D036C479105fF98A1953b15d9c510110',
            ),
            chain: 'ethereum',
          },
        ],
        verificationStatus: 'notVerified',
        description:
          "Custom verifier ID: SHA256 hash of the verifier byte code string in the hex format '0x...'.",
      },
      {
        hash: '0x566598f3b1e7cc2f2eb7ee51aecdb6d7b2607ed3ecd7426e6bdfd40ea478c59f',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Halo2,
        knownDeployments: [
          {
            address: EthereumAddress(
              '0x2293cd12e8564e8219d314b075867c2f66ac6941',
            ),
            chain: 'ethereum',
          },
        ],
        verificationStatus: 'notVerified',
        description:
          "Custom verifier ID: SHA256 hash of the verifier byte code string in the hex format '0x...'.",
      },
      {
        hash: '0xf4d2667a66e6ce10c953f77163ebb17a9e6add82a825e5aad4e55760dd1a5945',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Halo2,
        knownDeployments: [
          {
            address: EthereumAddress(
              '0x4B8Aa8A96078689384DAb49691E9bA51F9d2F9E1',
            ),
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
