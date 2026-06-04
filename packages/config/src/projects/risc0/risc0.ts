import { ChainSpecificAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ZK_CATALOG_ATTESTERS } from '../../common/zkCatalogAttesters'
import { ZK_CATALOG_TAGS } from '../../common/zkCatalogTags'
import { TRUSTED_SETUPS } from '../../common/zkCatalogTrustedSetups'
import type { BaseProject } from '../../types'

export const risc0: BaseProject = {
  id: ProjectId('risc0'),
  slug: 'risc0',
  name: 'RISC Zero',
  shortName: undefined,
  aliases: ['Risc0'],
  addedAt: UnixTime.fromDate(new Date('2025-07-21')),
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description: 'Risc0 is a zkVM proving system for RISC-V programs.',
    links: {
      websites: ['https://risczero.com'],
      documentation: ['https://dev.risczero.com/'],
      repositories: ['https://github.com/risc0/risc0'],
      socialMedia: [
        'https://x.com/RiscZero',
        'https://youtube.com/@risczero',
        'https://discord.com/invite/risczero',
      ],
    },
    badges: [],
  },
  milestones: [
    {
      title: '[Disclosed vulnerability] rv32im circuit soundness vulnerability',
      url: 'https://x.com/RiscZero/status/1935404812146725042',
      date: '2025-06-18T00:00:00Z',
      description:
        'Release of risc0-zkVM 2.1.0 with a fix of a missing constraint in rv32im circuit that affected any 3-register RISC-V instruction.',
      type: 'incident',
    },
    {
      title:
        '[Disclosed vulnerability] Underconstrained division vulnerability',
      url: 'https://x.com/RiscZero/status/1952503598056882225',
      date: '2025-08-05T00:00:00Z',
      description:
        'Release of risc0-zkVM 2.2.0 with a fix of a signed integer division soundness vulnerability.',
      type: 'incident',
    },
    {
      title: '[Disclosed vulnerability] Critical malicious host vulnerability',
      url: 'https://x.com/RiscZero/status/1973490104883990791',
      date: '2025-10-02T00:00:00Z',
      description:
        'Release of risc0-zkvm versions 2.3.2 and 3.0.3 with a fix of critical vulnerability where a malicious host can write to an arbitrary memory location in the guest.',
      type: 'incident',
    },
  ],
  zkCatalogInfo: {
    creator: 'RISC Zero',
    techStack: {
      zkVM: [
        ZK_CATALOG_TAGS.STARK.RISC0,
        ZK_CATALOG_TAGS.ISA.RISCV32,
        // ZK_CATALOG_TAGS.Arithmetization.AIR,
        ZK_CATALOG_TAGS.Field.BabyBear,
      ],
      finalWrap: [
        ZK_CATALOG_TAGS.Groth16.Snarkjs,
        ZK_CATALOG_TAGS.curve.BN254,
        // ZK_CATALOG_TAGS.Arithmetization.R1CS,
        // ZK_CATALOG_TAGS.PCS.KZG,
      ],
    },
    proofSystemInfo: `
    
    ## Description

    RISC Zero is the first zkVM proving RISC-V ISA programs. Its STARK proving system is based on a rather standard theoretical construction of [Ben-Sasson et al paper](https://eprint.iacr.org/2018/046) and [DEEP-ALI version of FRI](https://eprint.iacr.org/2019/336). The proof of zkVM execution is wrapped in Groth16 SNARK for efficient onchain verification. RISC Zero onchain verifier targets [96 bits of security](https://dev.risczero.com/api/security-model#cryptographic-security).

    ## Proof system

    ### RISC-V circuit

    RISC Zero implements a [circuit that proves RISC-V RV32IM instruction set](https://github.com/risc0/risc0/tree/main/risc0/circuit/rv32im) (see [here](https://dev.risczero.com/api/zkvm/zkvm-specification#the-zkvm-execution-model) for more details). Arithmetization of this circuit has different types of columns: control, data and accumulator. Control columns contain public data that describes the RISC-V program being executed and proven. Data and accumulator columns contain private data (accessible only to prover), data represents the running state of the processor and memory and accumulator is auxiliary data for the PLOOKUP argument.

    ### Recursion circuit

    RISC Zero prover supports recursive proving of RISC-V programs using [recursion circuit](https://github.com/risc0/risc0/tree/main/risc0/circuit/recursion). This is a separate STARK circuit that is designed to efficiently generate proofs for the verification of STARK proofs, it uses the same proving system as the RISC-V circuit.

    Big programs are split into several segments that are executed and proven in parallel. Segment receipts (i.e. proofs of correct execution) are verified with recursion circuits and succinct receipts are produced. These succinct receipts could be recursively joined in pairs of two until a single succinct proof of the whole execution is produced. 

    ### Final wrap

    RISC Zero [implements a SNARK wrapping](https://github.com/risc0/risc0/tree/main/risc0/groth16) of a recursive succinct receipt into a Groth16 proof over BN254 curve for onchain verification. This Groth16 R1CS circuit uses a circuit-specific trusted setup, the ceremony was run by RISC Zero, see [below](#trusted-setups) for more details. 

    The final wrap circuit has a [control root](https://dev.risczero.com/terminology#control-root) public input that depends on the RISC-V and recursion circuit versions. This design allows upgrading RISC Zero proving system without changing the final wrapper and thus without running a new trusted setup ceremony.
    `,
    trustedSetups: [
      {
        proofSystem: ZK_CATALOG_TAGS.Groth16.Snarkjs,
        ...TRUSTED_SETUPS.Risc0,
      },
    ],
    projectsForTvs: [
      {
        projectId: ProjectId('taiko'),
        sinceTimestamp: UnixTime(1730452800),
      },
      {
        projectId: ProjectId('bob'),
        sinceTimestamp: UnixTime(1752703200),
      },
      {
        projectId: ProjectId('megaeth'),
        sinceTimestamp: UnixTime(1763954183),
      },
      {
        projectId: ProjectId('soon'),
        sinceTimestamp: UnixTime(1765180787),
      },
      {
        projectId: ProjectId('base'),
        sinceTimestamp: UnixTime(1779825599), // 2026-05-26 AggregateVerifier upgrade
      },
    ],
    verifierHashes: [
      {
        hash: '0xa42b7a9c647b7bea4f92660bfd9cd3c5afc91b4c40773f9fb410eb55c8402e40',
        name: 'RiscZero v2.2.0',
        sourceLink: 'https://github.com/risc0/risc0/tree/v2.2.0',
        proofSystem: ZK_CATALOG_TAGS.Groth16.Snarkjs,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0xafB31f5b70623CDF4b20Ada3f7230916A5A79df9',
            ),
            // Base also references this verifier via its TEE arm (Nitro attestation), not for state validation.
            overrideUsedIn: [
              ProjectId('taiko'),
              ProjectId('bob'),
              ProjectId('megaeth'),
              ProjectId('soon'),
            ],
          },
        ],
        verificationStatus: 'successful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        verificationSteps: `
Verification works on a linux machine, 36 GiB of memory is enough to regenerate the verifier. Approximately 14 GiB of trusted setup files need to be downloaded.

To regenerate the verifier, both Groth16 verifier keys and constructor parameters \`control_root\` and \`bn254_control_id\` need to be regenerated.

1. Install npm, rust, git-lfs:
\`\`\`
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
. .cargo/env

sudo apt install npm git-lfs
\`\`\`

2. Install snarkjs and circom v2.1.0 (from sources):
\`\`\`
npm install -g snarkjs

git clone https://github.com/iden3/circom.git
cd circom
git checkout v2.1.0
cargo build --release
cargo install --path circom
export PATH="$HOME/.cargo/bin:$PATH"
\`\`\`

3. Clone risc0 repo, lfs pull the circuit for verifying Risc Zero STARK proofs and compile it into R1CS:
\`\`\`
git clone https://github.com/risc0/risc0.git
cd risc0
git checkout v2.0.0  # hash 3f26f9d4c2fb8a7e5eb830ae2433c8eae67f5a38
git lfs install
git lfs pull --include=groth16_proof/groth16/stark_verify.circom
cd groth16_proof/groth16
circom stark_verify.circom --r1cs

# check that the circuit is correct:
shasum -a 256 stark_verify.r1cs   # output should be 84d3c34b7c0eb55ad1b16b24f75e0b9de307f7b74089ea4a20a998390ee24178
\`\`\`

4. Download phase 1 and phase 2 trusted setup files, verify their correctness:
\`\`\`
wget https://storage.googleapis.com/zkevm/ptau/powersOfTau28_hez_final_23.ptau
wget https://risc0-artifacts.s3.us-west-2.amazonaws.com/tsc/2024-04-04/stark_verify_final.zkey

export NODE_OPTIONS="--max-old-space-size=32768"    # without this snarkjs runs out of mem
snarkjs zkey verify stark_verify.r1cs powersOfTau28_hez_final_23.ptau stark_verify_final.zkey
\`\`\`

5. Export the solidity verifier. Check it manually against the deployed smart contract: \`snarkjs zkey export solidityverifier stark_verify_final.zkey verifier.sol\`.

6. Check out to the \`v2.2.0\` tag of risc0 repo: \`git checkout v2.2.0\`, commit hash should be \`eff3c74bf9992401c2c68bea95eb6c93b27999ec\`. 
From the risc0 repo root dir, call \`RUST_LOG=info cargo xtask bootstrap\`. 
It will output computed \`allowed_control_root\` and \`bn254_identity_control_id\` that could be compared with the contract constructor values: \`0xce52bf56033842021af3cf6db8a50d1b7535c125a34f1a22c6fdcf002c5a1529\` and \`0x04446e66d300eb7fb45c9726bb53c793dda407a62e9601618bb43c5c14657ac0\`. Note that the bytes of \`bn254_identity_control_id\` will be output in the reversed order.
        `,
        description:
          'Custom verifier ID: SHA256 hash of the following values abi packed together: the bytes32 value of internal pure function verifier_key_digest() of the RiscZeroGroth16Verifier.sol, bytes32 value of \`control_root\` and bytes32 value of \`bn254_control_id\` of contract constructor values.',
      },
      {
        hash: '0x10ab33bc472e3e9024d89e512d33781519ba9b1621e4fe0ffd80cd20523062a8',
        name: 'RiscZero v3.0.0',
        sourceLink: 'https://github.com/risc0/risc0/tree/v3.0.0',
        proofSystem: ZK_CATALOG_TAGS.Groth16.Snarkjs,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0x2a098988600d87650Fb061FfAff08B97149Fa84D',
            ),
            // Base also references this verifier via its TEE arm (Nitro attestation), not for state validation.
            overrideUsedIn: [ProjectId('bob'), ProjectId('taiko')],
          },
          // {
          //   address: ChainSpecificAddress.fromLong(
          //     'ethereum',
          //     '0x7CCA385bdC790c25924333F5ADb7F4967F5d1599',
          //   ),
          // },
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0x411e56a890c5fe0712f6F345977815Ba8E7785C3',
            ),
          },
        ],
        verificationStatus: 'successful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        verificationSteps: `
Verification works on a linux machine, 36 GiB of memory is enough to regenerate the verifier. Approximately 14 GiB of trusted setup files need to be downloaded.

To regenerate the verifier, both Groth16 verifier keys and constructor parameters \`control_root\` and \`bn254_control_id\` need to be regenerated.

1. Install npm, rust, git-lfs:
\`\`\`
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
. .cargo/env

sudo apt install npm git-lfs
\`\`\`

2. Install snarkjs and circom v2.1.0 (from sources):
\`\`\`
npm install -g snarkjs

git clone https://github.com/iden3/circom.git
cd circom
git checkout v2.1.0
cargo build --release
cargo install --path circom
export PATH="$HOME/.cargo/bin:$PATH"
\`\`\`

3. Clone risc0 repo, lfs pull the circuit for verifying Risc Zero STARK proofs and compile it into R1CS:
\`\`\`
git clone https://github.com/risc0/risc0.git
cd risc0
git checkout v2.0.0  # hash 3f26f9d4c2fb8a7e5eb830ae2433c8eae67f5a38
git lfs install
git lfs pull --include=groth16_proof/groth16/stark_verify.circom
cd groth16_proof/groth16
circom stark_verify.circom --r1cs

# check that the circuit is correct:
shasum -a 256 stark_verify.r1cs   # output should be 84d3c34b7c0eb55ad1b16b24f75e0b9de307f7b74089ea4a20a998390ee24178
\`\`\`

4. Download phase 1 and phase 2 trusted setup files, verify their correctness:
\`\`\`
wget https://storage.googleapis.com/zkevm/ptau/powersOfTau28_hez_final_23.ptau
wget https://risc0-artifacts.s3.us-west-2.amazonaws.com/tsc/2024-04-04/stark_verify_final.zkey

export NODE_OPTIONS="--max-old-space-size=32768"    # without this snarkjs runs out of mem
snarkjs zkey verify stark_verify.r1cs powersOfTau28_hez_final_23.ptau stark_verify_final.zkey
\`\`\`

5. Export the solidity verifier. Check it manually against the deployed smart contract: \`snarkjs zkey export solidityverifier stark_verify_final.zkey verifier.sol\`.

6. Check out to the \`v3.0.0\` tag of risc0 repo: \`git checkout v3.0.0\`, commit hash should be \`96eef1c3c9c6dde65dcc2fc86791a4358fcc8e4d\`. 
From the risc0 repo root dir, call \`RUST_LOG=info cargo xtask bootstrap\`. 
It will output computed \`allowed_control_root\` and \`bn254_identity_control_id\` that could be compared with the contract constructor values: \`0xa54dc85ac99f851c92d7c96d7318af41dbe7c0194edfcc37eb4d422a998c1f56\` and \`0x04446e66d300eb7fb45c9726bb53c793dda407a62e9601618bb43c5c14657ac0\`. Note that the bytes of \`bn254_identity_control_id\` will be output in the reversed order.
        `,
        description:
          'Custom verifier ID: SHA256 hash of the following values abi packed together: the bytes32 value of internal pure function verifier_key_digest() of the RiscZeroGroth16Verifier.sol, bytes32 value of \`control_root\` and bytes32 value of \`bn254_control_id\` of contract constructor values.',
      },
      {
        // Is a dummy to show soon as using risc0 proof system. Verifier
        // contract sources are unknown, so the actual hash cannot be computed.
        // Fix once the sources are on etherscan.
        hash: '0x0000000000000000000000000000000000000000000000000000000000000000',
        name: 'RiscZero Soon verifier',
        proofSystem: ZK_CATALOG_TAGS.Groth16.Snarkjs,
        knownDeployments: [
          {
            // Based on standard Risc0 verifier architecture, this contract should be
            // a verifier router that points to an actual verifier. But it's unverified, so idk
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0x455218fa82e96A6adCcf182EE8A90A93BE7a6Bc6',
            ),
          },
        ],
        verificationStatus: 'unsuccessful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        description:
          'Verifier smart contract sources are not available on Etherscan, hash value is set to 0x0 to indicate that it is not known.',
      },
      {
        hash: '0x79325d9dc09af1afcea4dbf04db9fada7a71846045ad56daa1996bbebf9468d8',
        name: 'RiscZero v1.0.0',
        sourceLink: 'https://github.com/risc0/risc0/tree/v1.0.0',
        proofSystem: ZK_CATALOG_TAGS.Groth16.Snarkjs,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0xf70aBAb028Eb6F4100A24B203E113D94E87DE93C',
            ),
          },
        ],
        verificationStatus: 'successful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        verificationSteps: `
Verification works on a linux machine, 36 GiB of memory is enough to regenerate the verifier. Approximately 14 GiB of trusted setup files need to be downloaded.

To regenerate the verifier, both Groth16 verifier keys and constructor parameters \`control_root\` and \`bn254_control_id\` need to be regenerated.

1. Install npm, rust, git-lfs:
\`\`\`
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
. .cargo/env

sudo apt install npm git-lfs
\`\`\`

2. Install snarkjs and circom v2.1.0 (from sources):
\`\`\`
npm install -g snarkjs

git clone https://github.com/iden3/circom.git
cd circom
git checkout v2.1.0
cargo build --release
cargo install --path circom
export PATH="$HOME/.cargo/bin:$PATH"
\`\`\`

3. Clone risc0 repo, lfs pull the circuit for verifying Risc Zero STARK proofs and compile it into R1CS:
\`\`\`
git clone https://github.com/risc0/risc0.git
cd risc0
git checkout v2.0.0  # hash 3f26f9d4c2fb8a7e5eb830ae2433c8eae67f5a38
git lfs install
git lfs pull --include=groth16_proof/groth16/stark_verify.circom
cd groth16_proof/groth16
circom stark_verify.circom --r1cs

# check that the circuit is correct:
shasum -a 256 stark_verify.r1cs   # output should be 84d3c34b7c0eb55ad1b16b24f75e0b9de307f7b74089ea4a20a998390ee24178
\`\`\`

4. Download phase 1 and phase 2 trusted setup files, verify their correctness:
\`\`\`
wget https://storage.googleapis.com/zkevm/ptau/powersOfTau28_hez_final_23.ptau
wget https://risc0-artifacts.s3.us-west-2.amazonaws.com/tsc/2024-04-04/stark_verify_final.zkey

export NODE_OPTIONS="--max-old-space-size=32768"    # without this snarkjs runs out of mem
snarkjs zkey verify stark_verify.r1cs powersOfTau28_hez_final_23.ptau stark_verify_final.zkey
\`\`\`

5. Export the solidity verifier. Check it manually against the deployed smart contract: \`snarkjs zkey export solidityverifier stark_verify_final.zkey verifier.sol\`.

6. Check out to the \`v1.0.0\` tag of risc0 repo: \`git checkout v1.0.0\`, commit hash should be \`f2d27817a953ca4548739164afaf065de4d9a54a\`.
From the risc0 repo root dir, call \`RUST_LOG=info cargo xtask bootstrap\`. 
It will output computed \`allowed_control_root\` and \`bn254_identity_control_id\` that could be compared with the contract constructor values: \`0xa516a057c9fbf5629106300934d48e0e775d4230e41e503347cad96fcbde7e2e\` and \`0x0eb6febcf06c5df079111be116f79bd8c7e85dc9448776ef9a59aaf2624ab551\`. Note that the bytes of \`bn254_identity_control_id\` will be output in the reversed order.
        `,
        description:
          'Custom verifier ID: SHA256 hash of the following values abi packed together: the bytes32 value of internal pure function verifier_key_digest() of the RiscZeroGroth16Verifier.sol, bytes32 value of \`control_root\` and bytes32 value of \`bn254_control_id\` of contract constructor values.',
      },
      {
        hash: '0x55c1a9d623f4b589ad496bf8fde885abfafbcbf0129c67f1dbc78c8430b69eaf',
        name: 'RiscZero v2.0.0-rc.3',
        sourceLink: 'https://github.com/risc0/risc0/tree/v2.0.0-rc.3',
        proofSystem: ZK_CATALOG_TAGS.Groth16.Snarkjs,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0x20ff7C2Cf391a5F096A2Cc181cb41916680f8E97',
            ),
          },
        ],
        verificationStatus: 'successful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        verificationSteps: `
Verification works on a linux machine, 36 GiB of memory is enough to regenerate the verifier. Approximately 14 GiB of trusted setup files need to be downloaded.

To regenerate the verifier, both Groth16 verifier keys and constructor parameters \`control_root\` and \`bn254_control_id\` need to be regenerated.

1. Install npm, rust, git-lfs:
\`\`\`
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
. .cargo/env

sudo apt install npm git-lfs
\`\`\`

2. Install snarkjs and circom v2.1.0 (from sources):
\`\`\`
npm install -g snarkjs

git clone https://github.com/iden3/circom.git
cd circom
git checkout v2.1.0
cargo build --release
cargo install --path circom
export PATH="$HOME/.cargo/bin:$PATH"
\`\`\`

3. Clone risc0 repo, lfs pull the circuit for verifying Risc Zero STARK proofs and compile it into R1CS:
\`\`\`
git clone https://github.com/risc0/risc0.git
cd risc0
git checkout v2.0.0  # hash 3f26f9d4c2fb8a7e5eb830ae2433c8eae67f5a38
git lfs install
git lfs pull --include=groth16_proof/groth16/stark_verify.circom
cd groth16_proof/groth16
circom stark_verify.circom --r1cs

# check that the circuit is correct:
shasum -a 256 stark_verify.r1cs   # output should be 84d3c34b7c0eb55ad1b16b24f75e0b9de307f7b74089ea4a20a998390ee24178
\`\`\`

4. Download phase 1 and phase 2 trusted setup files, verify their correctness:
\`\`\`
wget https://storage.googleapis.com/zkevm/ptau/powersOfTau28_hez_final_23.ptau
wget https://risc0-artifacts.s3.us-west-2.amazonaws.com/tsc/2024-04-04/stark_verify_final.zkey

export NODE_OPTIONS="--max-old-space-size=32768"    # without this snarkjs runs out of mem
snarkjs zkey verify stark_verify.r1cs powersOfTau28_hez_final_23.ptau stark_verify_final.zkey
\`\`\`

5. Export the solidity verifier. Check it manually against the deployed smart contract: \`snarkjs zkey export solidityverifier stark_verify_final.zkey verifier.sol\`.

6. Check out to the \`v2.0.0-rc.3\` tag of risc0 repo: \`git checkout v2.0.0-rc.3\`, commit hash should be \`99e8616b4e74203a5aa361a485e0196516b4b308\`. 
From the risc0 repo root dir, call \`RUST_LOG=info cargo xtask bootstrap\`. 
It will output computed \`allowed_control_root\` and \`bn254_identity_control_id\` that could be compared with the contract constructor values: \`0x539032186827b06719244873b17b2d4c122e2d02cfb1994fe958b2523b844576\` and \`0x04446e66d300eb7fb45c9726bb53c793dda407a62e9601618bb43c5c14657ac0\`. Note that the bytes of \`bn254_identity_control_id\` will be output in the reversed order.
        `,
        description:
          'Custom verifier ID: SHA256 hash of the following values abi packed together: the bytes32 value of internal pure function verifier_key_digest() of the RiscZeroGroth16Verifier.sol, bytes32 value of \`control_root\` and bytes32 value of \`bn254_control_id\` of contract constructor values.',
      },
      {
        hash: '0x23aae7a460d8470faa11d2b75a9005eee1d3e0bce0e88ac2288f1ada4e4664df',
        name: 'RiscZero v2.1.0',
        sourceLink: 'https://github.com/risc0/risc0/tree/v2.1.0',
        proofSystem: ZK_CATALOG_TAGS.Groth16.Snarkjs,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0x54aCE3ED46529B4d4F3770C8Bad5dDC48717B9bF',
            ),
          },
        ],
        verificationStatus: 'successful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        verificationSteps: `
Verification works on a linux machine, 36 GiB of memory is enough to regenerate the verifier. Approximately 14 GiB of trusted setup files need to be downloaded.

To regenerate the verifier, both Groth16 verifier keys and constructor parameters \`control_root\` and \`bn254_control_id\` need to be regenerated.

1. Install npm, rust, git-lfs:
\`\`\`
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
. .cargo/env

sudo apt install npm git-lfs
\`\`\`

2. Install snarkjs and circom v2.1.0 (from sources):
\`\`\`
npm install -g snarkjs

git clone https://github.com/iden3/circom.git
cd circom
git checkout v2.1.0
cargo build --release
cargo install --path circom
export PATH="$HOME/.cargo/bin:$PATH"
\`\`\`

3. Clone risc0 repo, lfs pull the circuit for verifying Risc Zero STARK proofs and compile it into R1CS:
\`\`\`
git clone https://github.com/risc0/risc0.git
cd risc0
git checkout v2.0.0  # hash 3f26f9d4c2fb8a7e5eb830ae2433c8eae67f5a38
git lfs install
git lfs pull --include=groth16_proof/groth16/stark_verify.circom
cd groth16_proof/groth16
circom stark_verify.circom --r1cs

# check that the circuit is correct:
shasum -a 256 stark_verify.r1cs   # output should be 84d3c34b7c0eb55ad1b16b24f75e0b9de307f7b74089ea4a20a998390ee24178
\`\`\`

4. Download phase 1 and phase 2 trusted setup files, verify their correctness:
\`\`\`
wget https://storage.googleapis.com/zkevm/ptau/powersOfTau28_hez_final_23.ptau
wget https://risc0-artifacts.s3.us-west-2.amazonaws.com/tsc/2024-04-04/stark_verify_final.zkey

export NODE_OPTIONS="--max-old-space-size=32768"    # without this snarkjs runs out of mem
snarkjs zkey verify stark_verify.r1cs powersOfTau28_hez_final_23.ptau stark_verify_final.zkey
\`\`\`

5. Export the solidity verifier. Check it manually against the deployed smart contract: \`snarkjs zkey export solidityverifier stark_verify_final.zkey verifier.sol\`.

6. Check out to the \`v2.1.0\` tag of risc0 repo: \`git checkout v2.1.0\`, commit hash should be \`0f60032dce731863eba197c8494bdf455445c4af\`. 
From the risc0 repo root dir, call \`RUST_LOG=info cargo xtask bootstrap\`. 
It will output computed \`allowed_control_root\` and \`bn254_identity_control_id\` that could be compared with the contract constructor values: \`0x884389273e128b32475b334dec75ee619b77cb33d41c332021fe7e44c746ee60\` and \`0x04446e66d300eb7fb45c9726bb53c793dda407a62e9601618bb43c5c14657ac0\`. Note that the bytes of \`bn254_identity_control_id\` will be output in the reversed order.
        `,
        description:
          'Custom verifier ID: SHA256 hash of the following values abi packed together: the bytes32 value of internal pure function verifier_key_digest() of the RiscZeroGroth16Verifier.sol, bytes32 value of \`control_root\` and bytes32 value of \`bn254_control_id\` of contract constructor values.',
      },
    ],
  },
}
