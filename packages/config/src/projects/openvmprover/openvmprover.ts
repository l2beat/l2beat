import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ZK_CATALOG_ATTESTERS } from '../../common/zkCatalogAttesters'
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
        hash: '0x30af8474d8e13b8ce6a96eae63293310e7c1072b890bde77f96786497a9e5f4b',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Halo2,
        knownDeployments: [
          {
            address: EthereumAddress(
              '0x39854DF30b3482Ef546F68B8981Fae5A2C426eA4',
            ),
            chain: 'ethereum',
          },
        ],
        verificationStatus: 'successful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        verificationSteps: `
The verification steps are based on [this guide](https://github.com/scroll-tech/scroll-sc-tools/tree/feat/feynman?tab=readme-ov-file), with slight adjustments to resolve build failures. Memory usage peaks around 60 GiB on an ubuntu machine.

1. Install dependency packages: \`sudo apt-get update && sudo apt-get install build-essential pkg-config libssl-dev\`.
2. Install specifically required rust toolchain and solidity compiler:
\`\`\`
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
. .cargo/env
rustup toolchain install nightly-2025-02-14

cargo install svm-rs
svm install 0.8.19
solc --version  # should be 0.8.19
\`\`\`
3. Check out the correct version of the [scroll-sc-tools](https://github.com/scroll-tech/scroll-sc-tools) repo: \`git checkout feat/feynman\`. The commit hash should be \`74c0bd1994171dcb69c6da82e93cf6d273f9b984\`.
4. Modify the script to download all required trusted setup params: line 8 of \`scripts/download-params.sh\` should be changed to \`degrees=("22" "24")\`.
5. Download trusted setup params (around 3 GiB): \`bash scripts/download-params.sh\`.
6. Generate the verifier file and output its code hash: \`RUST_MIN_STACK=16777216 cargo run --release -- generate-verifier\`.
7. Verify that the deployed verifier smart contract has the same codehash: \`cast keccak $(cast code 0x39854DF30b3482Ef546F68B8981Fae5A2C426eA4 --rpc-url <YOUR_ETHEREUM_RPC_URL>)\`.
        `,
        description:
          'Custom verifier ID: solidity codehash of the verifier smart contract, i.e. keccak256 of the EVM bytecode.',
      },
      {
        hash: '0xf86ce35d4f5b1478f21194d9c6fc825f8d8afc0468425c981dc017149f0cac5e',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Halo2,
        knownDeployments: [
          {
            address: EthereumAddress(
              '0x749fC77A1a131632a8b88e8703E489557660C75e',
            ),
            chain: 'ethereum',
          },
        ],
        verificationStatus: 'successful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        description:
          'Custom verifier ID: solidity codehash of the verifier smart contract, i.e. keccak256 of the EVM bytecode.',
        verificationSteps: `
The verification steps are based on [this guide](https://github.com/scroll-tech/scroll-sc-tools/tree/feat/galileo?tab=readme-ov-file), with slight adjustments to resolve build failures. Memory usage peaks around 50 GiB on an ubuntu machine.

1. Install dependency packages: \`sudo apt-get update && sudo apt-get install build-essential pkg-config libssl-dev\`.
2. Install specifically required rust toolchain and solidity compiler:
\`\`\`
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
. .cargo/env
rustup toolchain install nightly-2025-02-14

cargo install svm-rs
svm install 0.8.19
solc --version  # should be 0.8.19
\`\`\`
3. Check out the correct version of the [scroll-sc-tools](https://github.com/scroll-tech/scroll-sc-tools) repo: \`git checkout feat/galileo\`. The commit hash should be \`f880a705954dc205cae7e1add474bd9e6cad1610\`.
4. Modify the script to download all required trusted setup params: line 8 of \`scripts/download-params.sh\` should be changed to \`degrees=("22" "23" "24")\`.
5. Download trusted setup params (around 4 GiB): \`bash scripts/download-params.sh\`.
6. Generate the verifier file and output its code hash: \`RUST_MIN_STACK=16777216 cargo run --release -- generate-verifier --recompute\`. If this step produces a build failure because of \`SOLC_VERSION_0_8_31_CHECKSUM\` duplication, open the problematic \`builds.rs\` file and remove all occurances of the duplicate (second version of \`SOLC_VERSION_0_8_31_CHECKSUM\`). This requires altering several lines, including changing the hardcoded length of \`ALL_SOLC_VERSIONS\` array. Rerun the command after altering the file.
7. Verify that the deployed verifier smart contract has the same codehash: \`cast keccak $(cast code 0x749fC77A1a131632a8b88e8703E489557660C75e --rpc-url <YOUR_ETHEREUM_RPC_URL>)\`.
        `,
      },
      // Verifiers below could not be used by scroll because their version is <7
      // {
      //   hash: '0x91816743ec15118a4ddacb13c830e56e9f8b28f1c875dfc458a27142a88c9fc8',
      //   proofSystem: ZK_CATALOG_TAGS.Plonk.Halo2,
      //   knownDeployments: [
      //     {
      //       address: EthereumAddress(
      //         '0xd1638c0C7Bd6bf49D655D855d353aC8b4f949582',
      //       ),
      //       chain: 'ethereum',
      //     },
      //   ],
      //   verificationStatus: 'notVerified',
      //   description:
      //     'Custom verifier ID: solidity codehash of the verifier smart contract, i.e. keccak256 of the EVM bytecode.',
      // },
      // {
      //   hash: '0x14fc3c8162cc5ead23a04f8221bbd7f18f21946a6e92df34831fab6482b19a37',
      //   proofSystem: ZK_CATALOG_TAGS.Plonk.Halo2,
      //   knownDeployments: [
      //     {
      //       address: EthereumAddress(
      //         '0x8c1b52757b5c571ADcB5572E992679d4D48e30f7',
      //       ),
      //       chain: 'ethereum',
      //     },
      //   ],
      //   verificationStatus: 'notVerified',
      //   description:
      //     'Custom verifier ID: solidity codehash of the verifier smart contract, i.e. keccak256 of the EVM bytecode.',
      // },
      // {
      //   hash: '0xaeaf8626da1244ce080122af824423c2a78bb8a043a821473d2247e8462f28af',
      //   proofSystem: ZK_CATALOG_TAGS.Plonk.Halo2,
      //   knownDeployments: [
      //     {
      //       address: EthereumAddress(
      //         '0x8759E83b6570A0bA46c3CE7eB359F354F816c9a9',
      //       ),
      //       chain: 'ethereum',
      //     },
      //   ],
      //   verificationStatus: 'notVerified',
      //   description:
      //     'Custom verifier ID: solidity codehash of the verifier smart contract, i.e. keccak256 of the EVM bytecode.',
      // },
      // {
      //   hash: '0xa69a3ce200bf287833cb53d85a93e5a943ac51473dd9ee4dff855dcfbaeabb6a',
      //   proofSystem: ZK_CATALOG_TAGS.Plonk.Halo2,
      //   knownDeployments: [
      //     {
      //       address: EthereumAddress(
      //         '0x03a72B00D036C479105fF98A1953b15d9c510110',
      //       ),
      //       chain: 'ethereum',
      //     },
      //   ],
      //   verificationStatus: 'notVerified',
      //   description:
      //     'Custom verifier ID: solidity codehash of the verifier smart contract, i.e. keccak256 of the EVM bytecode.',
      // },
      // {
      //   hash: '0x3b69f45dffa4aa394e991c0bbf0a31b5652a89639f075fa88ab7ea7245a4563a',
      //   proofSystem: ZK_CATALOG_TAGS.Plonk.Halo2,
      //   knownDeployments: [
      //     {
      //       address: EthereumAddress(
      //         '0x2293cd12e8564e8219d314b075867c2f66ac6941',
      //       ),
      //       chain: 'ethereum',
      //     },
      //   ],
      //   verificationStatus: 'notVerified',
      //   description:
      //     'Custom verifier ID: solidity codehash of the verifier smart contract, i.e. keccak256 of the EVM bytecode.',
      // },
      // {
      //   hash: '0x9accf42dcd17d7f7f61eeedd3843ff669028f2cb5fd2c879c02da54945f6dbb9',
      //   proofSystem: ZK_CATALOG_TAGS.Plonk.Halo2,
      //   knownDeployments: [
      //     {
      //       address: EthereumAddress(
      //         '0x4B8Aa8A96078689384DAb49691E9bA51F9d2F9E1',
      //       ),
      //       chain: 'ethereum',
      //     },
      //   ],
      //   verificationStatus: 'notVerified',
      //   description:
      //     'Custom verifier ID: solidity codehash of the verifier smart contract, i.e. keccak256 of the EVM bytecode.',
      // },
    ],
  },
}
