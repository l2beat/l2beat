import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ZK_CATALOG_TAGS } from '../../common/zkCatalogTags'
import { TRUSTED_SETUPS } from '../../common/zkCatalogTrustedSetups'
import type { BaseProject } from '../../types'

export const zkprover: BaseProject = {
  id: ProjectId('zkprover'),
  slug: 'zkprover',
  name: 'zkProver',
  shortName: undefined,
  addedAt: UnixTime.fromDate(new Date('2025-07-18')),
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description:
      'zkProver prover originally built by Polygon Zero team to prove state transition of Polygon zkEVM chain.',
    links: {
      documentation: [
        'https://docs.polygon.technology/zkEVM/architecture/zkprover/',
      ],
      repositories: [
        'https://github.com/0xPolygon/zkevm-prover',
        'https://github.com/0xPolygon/zkevm-proverjs',
      ],
    },
    badges: [],
  },
  zkCatalogInfo: {
    creator: 'Polygon Zero',
    techStack: {
      zkVM: [
        ZK_CATALOG_TAGS.STARK['PIL-STARK'],
        ZK_CATALOG_TAGS.ISA.ZkASM,
        // ZK_CATALOG_TAGS.Arithmetization.eAIR,
        ZK_CATALOG_TAGS.Field.Goldilocks,
      ],
      finalWrap: [
        ZK_CATALOG_TAGS.Fflonk.Snarkjs,
        ZK_CATALOG_TAGS.curve.BN254,
        // ZK_CATALOG_TAGS.PCS.KZG,
        // ZK_CATALOG_TAGS.Arithmetization.R1CS,
      ],
    },
    proofSystemInfo: `
    
    ## Description

    zkProver is a STARK proving system designed to implement the zkEVM component of Polygon zkEVM. It proves the execution of EVM transactions in a zkVM running on [zkASM](https://docs.polygon.technology/zkEVM/architecture/zkprover/#zero-knowledge-assembly) ISA. zkProver allows recursive STARK aggregation as well as the final wrap in a [Fflonk](https://hecmas.github.io/talk/fflonk-for-the-polygon-zkevm/) SNARK for efficient onchain verification. zkProver onchain verifier targets 128 bits of security.

    ## Proof system

    zkProver toolkit introduces two new domain specific languages: zkASM and PIL. zkASM is the instruction language of the internal zkVM, and the execution of EVM transactions is proven with a specific zkASM program called [ROM](https://docs.polygon.technology/zkEVM/architecture/zkprover/main-state-machine/?h=zkevm+rom#the-rom). PIL is a language for creating circuits, conceptually similar to [circom](https://docs.circom.io).

    zkProver is based on [eSTARK paper](https://eprint.iacr.org/2023/474), meaning that it implements a FRI-based STARK with AIR arithmetization extended with additional arguments. It also [provides tools](https://docs.polygon.technology/zkEVM/architecture/zkprover/stark-recursion/composition-recursion-aggregation/#setup-phase) to automatically generate circom arithmetic circuits for verifying the STARK proof, which plays an essential role in proof compression and recursive proving. 

    ### Polynomial Identity Language (PIL)

    The polynomial constraints that define circuits within zkProver are specified using a language called [polynomial identity language](https://github.com/0xPolygon/pilcom) (PIL). PIL supports complicated and powerful polynomial constraints, like [permutation](https://docs.polygon.technology/zkEVM/spec/pil/permutation-arguments/), [inclusion](https://docs.polygon.technology/zkEVM/spec/pil/inclusion-arguments/) and [connection](https://docs.polygon.technology/zkEVM/spec/pil/connection-arguments/) arguments. PIL was designed to be applicable in other zk tools as well. The next iteration of PIL called PIL2 could be found [here](https://github.com/0xPolygonHermez/pil2-compiler).

    ### State machine

    zkProver state machine (zkVM) consists of [13 separate state machines](https://github.com/0xPolygon/zkevm-prover/tree/main/src/sm) specified in PIL, including [main SM](https://docs.polygon.technology/zkEVM/architecture/zkprover/main-state-machine/), [arithmetic SM](https://docs.polygon.technology/zkEVM/architecture/zkprover/arithmetic-sm/), [binary SM](https://docs.polygon.technology/zkEVM/architecture/zkprover/binary-sm/), etc. Each state machine creates its own execution trace, which is connected to the rest using connection argument. The state machine has access to EVM state trie, EVM memory and the ROM program that implements verification of EVM transactions in zkASM language. 

    ### Recursion circuits

    [Proving architecture](https://docs.polygon.technology/zkEVM/architecture/zkprover/stark-recursion/proving-architecture/) of zkProver consists of several stages. Compression stage reduces the size of STARK proofs of zkEVM batch execution for efficiency of further computations. Normalization stage prepares for aggregation by correctly aligning public inputs across several batches. Aggregation stage repeatedly joins pairs of STARK proofs to produce a single proof of multiple zkEVM batches. Final STARK stage changes the field over which the proof is generated to prepare for the SNARK wrap. Finally, SNARK stage produces a Fflonk proof to be posted onchain.

    Each recursion step uses a circom R1CS arithmetic circuit to verify input PIL-STARK proofs (see [here](https://docs.polygon.technology/zkEVM/architecture/zkprover/stark-recursion/composition-recursion-aggregation/#stark-to-circuit-or-s2c-sub-process)). The proof of verification is a PIL-STARK that is generated on the Plonkish arithmetization of this circom circuit.
    `,
    trustedSetups: [
      {
        proofSystem: ZK_CATALOG_TAGS.Fflonk.Snarkjs,
        ...TRUSTED_SETUPS.PolygonZkEVM,
      },
    ],
    verifierHashes: [
      {
        hash: '0x28ddf3744fb9b64bc428bee318e026bee0cf210e23ff5932f645e32aa916c28f',
        proofSystem: ZK_CATALOG_TAGS.Fflonk.Snarkjs,
        knownDeployments: [
          {
            address: '0x0775e11309d75aA6b0967917fB0213C5673eDf81',
            chain: 'ethereum',
          },
        ],
        verificationStatus: 'notVerified',
        usedBy: [
          // ProjectId('astarzkevm'),
          // ProjectId('gpt'),
          ProjectId('wirex'),
          // ProjectId('witness'),
        ],
        description:
          'Custom verifier ID: SHA256 hash of the following values from the verifier smart contract, abi packed in the same order they are defined: verification key data, omegas, verifier preprocessed inputs (all values from k1 to X2y2).',
      },
      {
        hash: '0x237bc5d6efad6d844534c4a45f5f19fa86344615ac00054821915c219e9abd81',
        proofSystem: ZK_CATALOG_TAGS.Fflonk.Snarkjs,
        knownDeployments: [
          {
            address: '0x9B9671dB83CfcB4508bF361942488C5cA2b1286D',
            chain: 'ethereum',
          },
        ],
        verificationStatus: 'notVerified',
        usedBy: [
          ProjectId('polygonzkevm'),
          ProjectId('lumia'),
          ProjectId('silicon'),
          ProjectId('ternoa'),
          ProjectId('penchain'),
        ],
        description:
          'Custom verifier ID: SHA256 hash of the following values from the verifier smart contract, abi packed in the same order they are defined: verification key data, omegas, verifier preprocessed inputs (all values from k1 to X2y2).',
      },
      {
        hash: '0xd7331eca890a6201708336d89e099d242f8b5b57ead785225220f7ef36b6aaf6',
        proofSystem: ZK_CATALOG_TAGS.Fflonk.Snarkjs,
        knownDeployments: [
          {
            address: '0x455ac63E96e6a64EA59C6Da0D8F90FCa3F1535aB',
            chain: 'ethereum',
          },
        ],
        verificationStatus: 'notVerified',
        usedBy: [ProjectId('xlayer')],
        description:
          'Custom verifier ID: SHA256 hash of the following values from the verifier smart contract, abi packed in the same order they are defined: verification key data, omegas, verifier preprocessed inputs (all values from k1 to X2y2).',
      },
    ],
  },
}
