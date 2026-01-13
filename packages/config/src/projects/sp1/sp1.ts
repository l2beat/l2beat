import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ZK_CATALOG_ATTESTERS } from '../../common/zkCatalogAttesters'
import { ZK_CATALOG_TAGS } from '../../common/zkCatalogTags'
import { TRUSTED_SETUPS } from '../../common/zkCatalogTrustedSetups'
import type { BaseProject } from '../../types'

export const sp1: BaseProject = {
  id: ProjectId('sp1'),
  slug: 'sp1',
  name: 'SP1',
  shortName: undefined,
  addedAt: UnixTime.fromDate(new Date('2025-07-08')),
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description:
      'SP1 is a zk proving system for RISC-V programs built by Succinct.',
    links: {
      websites: ['https://www.succinct.xyz'],
      documentation: ['https://docs.succinct.xyz/docs/sp1/introduction'],
      repositories: ['https://github.com/succinctlabs/sp1'],
      socialMedia: [
        'https://x.com/SuccinctLabs',
        'https://discord.com/invite/succinctlabs',
      ],
    },
    badges: [],
  },
  milestones: [
    {
      title: '[Disclosed vulnerability] Plonky3 FRI size check vulnerability',
      url: 'https://x.com/SuccinctLabs/status/1905818676848406801',
      date: '2025-03-28T00:00:00Z',
      description:
        'Fix of a Plonky3 library soundness issue that affected the security of SP1 zkVM.',
      type: 'incident',
    },
    {
      title:
        '[Disclosed vulnerability] Plonky3 final polynomial degree check vulnerability',
      url: 'https://x.com/SuccinctLabs/status/1929773028034204121',
      date: '2025-06-03T00:00:00Z',
      description:
        'Release of SP1 V5.0.0 with a fix of a Plonky3 library issue that affected the security of SP1 zkVM.',
      type: 'incident',
    },
  ],
  zkCatalogInfo: {
    creator: 'Succinct',
    techStack: {
      zkVM: [
        ZK_CATALOG_TAGS.STARK.Plonky3,
        ZK_CATALOG_TAGS.ISA.RISCV,
        ZK_CATALOG_TAGS.Field.BabyBear,
      ],
      finalWrap: [
        ZK_CATALOG_TAGS.Plonk.Gnark,
        ZK_CATALOG_TAGS.Groth16.Gnark,
        ZK_CATALOG_TAGS.curve.BN254,
        // ZK_CATALOG_TAGS.PCS.KZG,
      ],
    },
    proofSystemInfo: `
      ## Description

      SP1 is a RISC-V zkVM using the [Plonky3](https://github.com/Plonky3/Plonky3) stack. The zkVM execution is proven recursively and is wrapped into a SNARK for final verification. It provides tools to generate onchain Groth16 or Plonk verifiers. SP1 targets [100 bits of security](https://docs.succinct.xyz/docs/sp1/security/security-model#conjectures-for-fris-security).

      ## Proof system

      SP1 proves execution of a RISC-V VM using several ZK circuits connected by lookup arguments, as implemented in Plonky3. VM execution trace is split into several chunks that could be proven in parallel with a STARK proving system. The parallelized proofs are recursively checked by the next layer of STARK circuits. The correctness of the final STARK proof is verified with the final wrap SNARK program, the wrap SNARK proof is verified onchain.

      ### zkVM component

      Verifies execution of a RISC-V program in a zkVM. Uses [Plonky3](https://github.com/Plonky3/Plonky3) STARK toolkit with AIR arithmetization and FRI-based polynomial commitment scheme within the [BabyBear field](https://docs.succinct.xyz/docs/sp1/security/security-model#hash-functions-and-the-random-oracle-model).

      ### Recursion circuits

      SP1 provides tools for recursive proof generation by [verifying proofs in a zkVM](https://docs.succinct.xyz/docs/sp1/writing-programs/proof-aggregation#verifying-proofs-inside-the-zkvm). This uses the same toolkit as top-level proof system, but proves the correct verification of all proofs generated on the previous step.

      ### Final wrap

      SP1 supports Plonk (with KZG polynomial commitments) or Groth16 final SNARK wrap of the STARK proof for performant onchain proof verification ([link](https://docs.succinct.xyz/docs/sp1/generating-proofs/proof-types#compressed)). The [gnark](https://github.com/Consensys/gnark) implementation of these proof systems over BN254 curve is used. For Plonk, Aztec Ignition trusted setup ceremony is used, for Groth16 Succinct run internal circuit-dependent phase 2 trusted setup, see [below](#trusted-setups) for more details.
      `,
    trustedSetups: [
      {
        proofSystem: ZK_CATALOG_TAGS.Plonk.Gnark,
        ...TRUSTED_SETUPS.AztecIgnition,
      },
      {
        proofSystem: ZK_CATALOG_TAGS.Groth16.Gnark,
        ...TRUSTED_SETUPS.SP1Groth16,
      },
    ],
    projectsForTvs: [
      {
        projectId: ProjectId('forknet'),
        sinceTimestamp: UnixTime(1753882500),
      },
      {
        projectId: ProjectId('katana'),
        sinceTimestamp: UnixTime(1751328000),
      },
      {
        projectId: ProjectId('blobstream'),
        sinceTimestamp: UnixTime(1717608107),
      },
      {
        projectId: ProjectId('vector'),
        sinceTimestamp: UnixTime(1720128227),
      },
      {
        projectId: ProjectId('sophon'),
        sinceTimestamp: UnixTime(1745341091),
      },
      {
        projectId: ProjectId('lens'),
        sinceTimestamp: UnixTime(1745359200),
      },
      {
        projectId: ProjectId('plumenetwork'),
        sinceTimestamp: UnixTime(1746735060),
      },
      {
        projectId: ProjectId('galxegravity'),
        sinceTimestamp: UnixTime(1745880540),
      },
      {
        projectId: ProjectId('rari'),
        sinceTimestamp: UnixTime(1734562800),
      },
      {
        projectId: ProjectId('winr'),
        sinceTimestamp: UnixTime(1747088280),
      },
      {
        projectId: ProjectId('molten'),
        sinceTimestamp: UnixTime(1731480840),
      },
      {
        projectId: ProjectId('taiko'),
        sinceTimestamp: UnixTime(1730452800),
      },
      {
        projectId: ProjectId('lumia'),
        sinceTimestamp: UnixTime(1753882500),
      },
      {
        projectId: ProjectId('polygonzkevm'),
        sinceTimestamp: UnixTime(1753882500),
      },
      {
        projectId: ProjectId('xlayer'),
        sinceTimestamp: UnixTime(1753882500),
      },
      {
        projectId: ProjectId('silicon'),
        sinceTimestamp: UnixTime(1753882500),
      },
      {
        projectId: ProjectId('facet'),
        sinceTimestamp: UnixTime(1751407200),
      },
      {
        projectId: ProjectId('ternoa'),
        sinceTimestamp: UnixTime(1753882500),
      },
      {
        projectId: ProjectId('wirex'),
        sinceTimestamp: UnixTime(1753882500),
      },
      {
        projectId: ProjectId('penchain'),
        sinceTimestamp: UnixTime(1753882500),
      },
      {
        projectId: ProjectId('phala'),
        sinceTimestamp: UnixTime(1736290800),
      },
      {
        projectId: ProjectId('mantle'),
        sinceTimestamp: UnixTime(1757973600),
      },
      {
        projectId: ProjectId('zircuit'),
        sinceTimestamp: UnixTime(1756072800),
      },
      {
        projectId: ProjectId('omni'),
        sinceTimestamp: UnixTime(1748856160),
      },
      {
        projectId: ProjectId('morph'),
        sinceTimestamp: UnixTime(1737359447),
      },
      // archived projects
      {
        projectId: ProjectId('gpt'),
        sinceTimestamp: UnixTime(1753882500),
      },
      {
        projectId: ProjectId('astarzkevm'),
        sinceTimestamp: UnixTime(1753882500),
      },
      {
        projectId: ProjectId('witness'),
        sinceTimestamp: UnixTime(1753882500),
      },
      {
        projectId: ProjectId('kroma'),
        sinceTimestamp: UnixTime(1739228400),
      },
      {
        projectId: ProjectId('haust'),
        sinceTimestamp: UnixTime(1756808195),
      },
      {
        projectId: ProjectId('celo'),
        sinceTimestamp: UnixTime(1765324800),
      },
    ],
    verifierHashes: [
      {
        hash: '0xd4e8ecd2357dd882209800acd6abb443d231cf287d77ba62b732ce937c8b56e7',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Gnark,
        knownDeployments: [
          {
            address: EthereumAddress(
              '0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459',
            ),
            chain: 'ethereum',
          },
          {
            address: EthereumAddress(
              '0xFF5Adab685362DC4C33536a65aF5873738D1216B',
            ),
            chain: 'ethereum',
          },
        ],
        verificationStatus: 'successful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        verificationSteps: `
The regeneration process consumed around 50 GiB of memory on the peak. Also, due to some os indeterminism, 
the sp1 repo must be cloned into \`/home/aurel/dev/sp1-wip/\` directory, so we recommend creating \`aurel\` user on an Ubuntu 24.04 machine.

1. Create a new \`aurel\` user on a linux os and login as this user.
2. Install necessary dependencies: rust, sp1 toolkit, go.

\`\`\`
sudo apt update
sudo apt install build-essential golang-go

curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
. .cargo/env
cargo install --debug --locked cargo-make

curl -L https://sp1up.succinct.xyz/ | bash
sp1up
\`\`\`

3. Clone sp1 repo in the correct directory, set \`SP1_ALLOW_DEPRECATED_HOOKS\` for correct compilation and run the script to regenerate verifiers.

\`\`\`
mkdir -p dev/sp1-wip/
cd dev/sp1-wip/
git clone https://github.com/succinctlabs/sp1.git
cd sp1/crates/prover
git checkout v5.0.0   # commit should be 38f0f143dece864e8bffafad64196a924f190336
export SP1_ALLOW_DEPRECATED_HOOKS=true  # fixes compilation errors

make build-circuits
\`\`\`
      
The script will generate Plonk verifier smart contract with verification keys and the verifier hash in \`build/plonk\` dir.
        `,
      },
      // {
      //   hash: '0x1b34fe11a637737f0c75c88241669dcf9ca3c03713659265b8241f398a2d286d',
      //   proofSystem: ZK_CATALOG_TAGS.Plonk.Gnark,
      //   knownDeployments: [
      //     {
      //       address: EthereumAddress(
      //         '0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63',
      //       ),
      //       chain: 'ethereum',
      //     },
      //   ],
      //   verificationStatus: 'successful',
      //   verificationSteps: `
      // - Check out [sp1 repo](https://github.com/succinctlabs/sp1) at commit \`76c28bf986ba102127788ce081c21fa09cf93b18\`.
      // - Set an environment variable by calling \`export SP1_ALLOW_DEPRECATED_HOOKS=true\`. It is needed for the correct execution of circuit building.
      // - Make sure that you have [go lang installed](https://go.dev/doc/install).
      // - From \`crates/prover\` call \`make build-circuits\`. Note that the execution could take a while.
      // `,
      //   attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
      // },
      {
        hash: '0xa4594c59bbc142f3b81c3ecb7f50a7c34bc9af7c4c444b5d48b795427e285913',
        proofSystem: ZK_CATALOG_TAGS.Groth16.Gnark,
        knownDeployments: [
          {
            address: EthereumAddress(
              '0x50ACFBEdecf4cbe350E1a86fC6f03a821772f1e5',
            ),
            chain: 'ethereum',
          },
          // {
          //   address: EthereumAddress(
          //     '0x50ACFBEdecf4cbe350E1a86fC6f03a821772f1e5',
          //   ),
          //   chain: 'arbitrum',
          // },
          {
            address: EthereumAddress(
              '0xa5E60dbBAc6A65B654E5A14A5E357da3Fcf139dd',
            ),
            chain: 'gnosis',
          },
        ],
        verificationStatus: 'notVerified',
      },
      {
        hash: '0xffea2d2e12ed24da258af874d77eee7ee91a1e050ee197052908089e57681e67',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Gnark,
        knownDeployments: [
          {
            address: EthereumAddress(
              '0x045d4BC73Bd1918192f34e98532A5272Ef620423',
            ),
            chain: 'ethereum',
          },
        ],
        verificationStatus: 'notVerified',
      },
    ],
  },
}
