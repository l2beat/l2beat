import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ZK_CATALOG_ATTESTERS } from '../../common/zkCatalogAttesters'
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
    creator: 'Polygon Labs',
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
      // wirex was the last chain using this verifier:
      // {
      //   hash: '0x28ddf3744fb9b64bc428bee318e026bee0cf210e23ff5932f645e32aa916c28f',
      //   proofSystem: ZK_CATALOG_TAGS.Fflonk.Snarkjs,
      //   knownDeployments: [
      //     {
      //       address: '0x0775e11309d75aA6b0967917fB0213C5673eDf81',
      //       chain: 'ethereum',
      //     },
      //   ],
      //   verificationStatus: 'notVerified',
      //   description:
      //     'Custom verifier ID: SHA256 hash of the following values from the verifier smart contract, abi packed in the same order they are defined: verification key data, omegas, verifier preprocessed inputs (all values from k1 to X2y2).',
      // },
      {
        hash: '0x237bc5d6efad6d844534c4a45f5f19fa86344615ac00054821915c219e9abd81',
        proofSystem: ZK_CATALOG_TAGS.Fflonk.Snarkjs,
        knownDeployments: [
          {
            address: '0x9B9671dB83CfcB4508bF361942488C5cA2b1286D',
            chain: 'ethereum',
          },
        ],
        verificationStatus: 'successful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        verificationSteps: `
The verification steps are based on [this guide](https://github.com/agglayer/agglayer-contracts/blob/b9a795523317eca29319f3dca56f7199a117fb78/verifyMainnetDeployment/verifyMainnetProofVerifier.md).

1. Get a machine with at least 512GB of RAM and 32 cores (e.g. r6a.16xlarge aws instance). This guide assumes Ubuntu 22.04 LTS OS.

2. Do basic OS preparation

\`\`\`jsx
sudo apt update
sudo apt install -y tmux git curl jq
sudo apt install -y build-essential libomp-dev libgmp-dev nlohmann-json3-dev libpqxx-dev nasm libgrpc++-dev libprotobuf-dev grpc-proto libsodium-dev uuid-dev libsecp256k1-dev
\`\`\`

3. Tweak the OS to accept high amount of memory

\`\`\`jsx
echo "vm.max_map_count=655300" | sudo tee -a /etc/sysctl.conf
sudo sysctl -w vm.max_map_count=655300
export NODE_OPTIONS="--max-old-space-size=230000"
\`\`\`

4. Install node, npm, python deps

\`\`\`jsx
curl -sL https://deb.nodesource.com/setup_18.x -o nodesource_setup.sh
sudo bash nodesource_setup.sh
sudo apt install -y nodejs
node -v
apt install python3-pip
pip install z3-solver==4.13.0.0
\`\`\`

The version of node should be: 18 (e.g. 18.19.0 ) Note that hardhat will complain that this node version is not supported byt hardhat. It seems to be just a warning and \`v24.8.0\` produces the same contract bytecode, so maybe it can be ignored.

5. Download and prepare circom

\`\`\`jsx
cd ~
git clone https://github.com/iden3/circom.git
cd circom
git checkout v2.1.8
git log --pretty=format:'%H' -n 1
\`\`\`

The hash of the commit should be: f0deda416abe91e5dd906c55507c737cd9986ab5.

\`\`\`jsx
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
cd ~
cd circom
cargo build --release
cargo install --path circom
export PATH=$PATH:~/.cargo/bin
echo 'PATH=$PATH:~/.cargo/bin' >> ~/.profile
circom --version
\`\`\`

The version of circom should be: 2.1.8.

6. Prepare fast build constant tree tool and fflonk setup

\`\`\`jsx
cd ~
git clone https://github.com/0xPolygonHermez/zkevm-prover.git
cd zkevm-prover
git checkout v8.0.0-RC9
git submodule init
git submodule update
sed -i -E 's|^(SRCS_BCT := .*./src/starkpil/stark_info\\.\\*)|\\1 ./tools/sm/sha256/sha256.cpp ./tools/sm/sha256/bcon/bcon_sha256.cpp|' Makefile
make -j bctree fflonk_setup
\`\`\`

7. Prepare and launch setup (zkevm-proverjs). This step is quite long, it takes approximately 4.5 hours.

\`\`\`jsx
cd ~
git clone https://github.com/0xPolygonHermez/zkevm-proverjs.git
cd zkevm-proverjs
git checkout v8.0.0-fork.12
rm -f package-lock.json
sed -i -E 's|https://hermez\\.s3-eu-west-1\\.amazonaws\\.com/powersOfTau28_hez_final\\.ptau|https://storage.googleapis.com/zkevm/ptau/powersOfTau28_hez_final.ptau|g' package.json
npm install
tmux -c "npm run buildsetup --bctree=../zkevm-prover/build/bctree --fflonksetup=../zkevm-prover/build/fflonkSetup --mode=25"
\`\`\`

The last step generates the \`zkevm-proverjs_build_proof_build_final.fflonk.verifier.sol\`  file which contains the verification keys that can be checked against the onchain deployment.
        `,
        description:
          'Custom verifier ID: SHA256 hash of the following values from the verifier smart contract, abi packed in the same order they are defined: verification key data, omegas, verifier preprocessed inputs (all values from k1 to X2y2).',
      },
    ],
  },
}
