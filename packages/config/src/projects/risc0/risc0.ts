import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ZK_CATALOG_TAGS } from '../../common/zkCatalogTags'
import { TRUSTED_SETUPS } from '../../common/zkCatalogTrustedSetups'
import type { BaseProject } from '../../types'

export const risc0: BaseProject = {
  id: ProjectId('risc0'),
  slug: 'risc0',
  name: 'RISC Zero',
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
        ZK_CATALOG_TAGS.ISA.RISCV,
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
    verifierHashes: [
      {
        hash: '0x1dcf73cbd51c9eba43c437c5a5ebc5328ca2d7a590c701a9a9bc1136eceeeea7',
        proofSystem: ZK_CATALOG_TAGS.Groth16.Snarkjs,
        knownDeployments: [
          {
            address: '0xafB31f5b70623CDF4b20Ada3f7230916A5A79df9',
            chain: 'ethereum',
          },
          {
            address: '0x34Eda8BfFb539AeC33078819847B36D221c6641c',
            chain: 'ethereum',
          },
        ],
        verificationStatus: 'notVerified',
        description:
          'Custom verifier ID: SHA256 hash of the following values abi packed together: the bytes32 value of internal pure function verifier_key_digest() of the RiscZeroGroth16Verifier.sol, bytes16 value of CONTROL_ROOT_1, bytes16 value of CONTROL_ROOT_2.',
      },
      {
        hash: '0xc6fcb1951eb5b45a669431346a01577df99f30d72baa9d5c7eea40ec6cccfab9',
        proofSystem: ZK_CATALOG_TAGS.Groth16.Snarkjs,
        knownDeployments: [
          {
            address: '0x2a098988600d87650Fb061FfAff08B97149Fa84D',
            chain: 'ethereum',
          },
        ],
        verificationStatus: 'notVerified',
        description:
          'Custom verifier ID: SHA256 hash of the following values abi packed together: the bytes32 value of internal pure function verifier_key_digest() of the RiscZeroGroth16Verifier.sol, bytes16 value of CONTROL_ROOT_1, bytes16 value of CONTROL_ROOT_2.',
      },
    ],
  },
}
