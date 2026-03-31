import { ChainSpecificAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ZK_CATALOG_ATTESTERS } from '../../common/zkCatalogAttesters'
import { ZK_CATALOG_TAGS } from '../../common/zkCatalogTags'
import { TRUSTED_SETUPS } from '../../common/zkCatalogTrustedSetups'
import type { BaseProject } from '../../types'

export const barretenberg: BaseProject = {
  id: ProjectId('barretenberg'),
  slug: 'barretenberg',
  name: 'Barretenberg',
  shortName: undefined,
  addedAt: UnixTime.fromDate(new Date('2026-03-17')),
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description:
      'Barretenberg includes several zk-SNARK proof systems built by Aztec, including UltraHonk and CHONK.',
    links: {
      websites: ['https://aztec.network'],
      documentation: [
        'https://barretenberg.aztec.network/docs/',
        'https://eprint.iacr.org/2022/1355',
      ],
      repositories: [
        'https://github.com/AztecProtocol/aztec-packages/tree/next/barretenberg',
      ],
      socialMedia: ['https://x.com/aztecnetwork'],
    },
    badges: [],
  },
  zkCatalogInfo: {
    creator: 'Aztec',
    techStack: {
      zkVM: [
        ZK_CATALOG_TAGS.Plonk.UltraHonk,
        ZK_CATALOG_TAGS.Plonk.CHONK,
        ZK_CATALOG_TAGS.curve.BN254,
        ZK_CATALOG_TAGS.curve.Grumpkin,
        ZK_CATALOG_TAGS.ISA.AVM,
      ],
    },
    proofSystemInfo: `
## Description

Barretenberg is a C++ library that implements several Plonk-based proof systems, developed by Aztec. It notably includes UltraHonk SNARK as an optimized version of previous Plonk implementation, and CHONK (Client-side Highly Optimized ploNK) SNARK for client-side proving on weaker devices. Barretenberg implements actual zero-knowledge SNARK modifications that allow proving over private data, and provides tools to generate UltraHonk smart contract verifiers. It also contains circuits to prove private and public transactions on Aztec L2.

## Proof system

The main application of Barretenberg is proving Aztec L2 state transition, which includes users locally proving private transactions with true ZK CHONK and more powerful nodes proving public transactions using UltraHonk. CHONK proofs must be verified within UltraHonk, so Barretenberg also includes tools for recursive proving. Both proving systems operate on arithmetic circuits that could be compiled from [Noir](https://github.com/noir-lang/noir) programs into ACIR, which is a [native circuit representation for Barretenberg](https://barretenberg.aztec.network/docs/#relationship-with-noir). 

### UltraHonk

UltraHonk is built on top of [Plonk](https://eprint.iacr.org/archive/2019/953/1624533038.pdf) proof system, with several optimizations for performance. It also serves as a basis for CHONK. The main optimization comes from using sumcheck protocol over the boolean hypercube as described in the [HyperPlonk paper](https://eprint.iacr.org/2022/1355). This trick allows reducing prover time and memory requirements at the expense of larger proofs. Barretenberg also contains code for circuits [verifying Honk proofs within UltraHonk verifier](https://github.com/AztecProtocol/aztec-packages/tree/next/barretenberg/cpp/src/barretenberg/stdlib/honk_verifier), allowing prover recursion. For more technical details on UltraHonk see [here](https://github.com/AztecProtocol/aztec-packages/tree/99c1647e91c83a3b1b3e040fce481fb4c7265522/barretenberg/cpp/src/barretenberg/ultra_honk#readme).

### CHONK

CHONK is the proof system that is most optimized for client side proving in memory-restricted environments like mobile and browsers. In addition, CHONK has zero-knowledge property to protect prover private inputs, which is achieved by adding random masking polynomials at several stages of the pipeline and some other measures. For the full description of ZK-related modifications see [here](https://github.com/AztecProtocol/aztec-packages/tree/99c1647e91c83a3b1b3e040fce481fb4c7265522/barretenberg/cpp/src/barretenberg/ultra_honk#zero-knowledge).

One of CHONK’s key innovations is Goblin architecture that efficiently manages elliptic curve operations over BN254 used e.g. in signatures. Elliptic curve operations are collected in a queue during the circuit proving, but the proof of their correctness is deferred to the very end of the proving process. The final step of the proving is done over a different curve called Grumpkin, which is chosen to make these EC operations native (i.e. extremely efficient). The correctness of translation between BN254 and Grumpkin is handled by the [Translator VM](https://github.com/AztecProtocol/aztec-packages/blob/7d03c441df4935ec5b08069446f3e8d59966532e/barretenberg/cpp/src/barretenberg/translator_vm/README.md) and the correctness of EC operations is proven by the [ECCVM](https://github.com/AztecProtocol/aztec-packages/blob/7d03c441df4935ec5b08069446f3e8d59966532e/barretenberg/cpp/src/barretenberg/eccvm/README.md).

CHONK also introduces a folding scheme inspired by [HyperNova](https://eprint.iacr.org/2023/573) for more memory-efficient proving of recursive smart contract calls. In this case different smart contract are represented by different circuits, which are proven separately and then aggregated. The folding scheme allows efficient aggregation of these proofs that results in only one expensive polynomial commitment check in the end, instead of having to check it for each smart contract call.

For more technical details on CHONK see [here](https://github.com/AztecProtocol/aztec-packages/tree/7d03c441df4935ec5b08069446f3e8d59966532e/barretenberg/cpp/src/barretenberg/chonk#readme).

### Noir and trusted setups

Although not technically a part of Barretenberg proving repo, [Noir language](https://noir-lang.org) represents the most developer-friendly way to create circuits to be proven with UltraHonk or CHONK. It’s a domain-specific language inspired by Rust.

All Barretenberg proving systems extend Plonk, which is based on KZG commitment schemes. That requires a trusted setup, which is chosen to be Aztec Ignition trusted setup. Some internal proofs, like ECCVM proof, are based on IPA (inner product argument) and thus they require no trusted setup.
    `,
    trustedSetups: [
      {
        proofSystem: ZK_CATALOG_TAGS.Plonk.UltraHonk,
        ...TRUSTED_SETUPS.AztecIgnition,
      },
    ],
    projectsForTvs: [
      {
        projectId: ProjectId('aztecnetwork'),
        sinceTimestamp: UnixTime(1774821600), //  Monday, 30. March 2026 at 04:52, aztec launch according to Basti
      },
    ],
    verifierHashes: [
      {
        hash: '0x059ad02b037fcfd4df2b9db771777d067a400f06fc55cf45fa601511e58e2c3e',
        name: 'Barretenberg Aztec verifier v4',
        sourceLink:
          'https://github.com/AztecProtocol/aztec-packages/tree/v4/noir-projects/noir-protocol-circuits',
        proofSystem: ZK_CATALOG_TAGS.Plonk.UltraHonk,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0x70aEDda427f26480D240bc0f4308ceDec8d31348',
            ),
          },
        ],
        verificationStatus: 'successful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        verificationSteps: `
The regeneration process consumed 32 GiB memory on the peak. It could be done on macOS or Linux machines, however in our experience Linux setup was smoother. 
The steps below worked for clean Ubuntu 22.04.

1. Install necessary dependencies.

\`\`\`
sudo apt-get install jq build-essential parallel ninja-build

# Install clang-format-20
wget https://apt.llvm.org/llvm.sh                                                                                                                                         
chmod +x llvm.sh                                                                                                                                                          
sudo ./llvm.sh 20                                                                                                                                                         
sudo apt-get install clang-format-20

# Install latest cmake
curl -fsSL https://apt.kitware.com/kitware-archive.sh | sudo sh
sudo apt-get install cmake

# Install zig 0.13.0
wget https://ziglang.org/download/0.13.0/zig-linux-x86_64-0.13.0.tar.xz                                                                                                   
tar xf zig-linux-x86_64-0.13.0.tar.xz                                                                                                                                     
sudo mv zig-linux-x86_64-0.13.0 /usr/local/zig                                                                                                                            
sudo ln -s /usr/local/zig/zig /usr/local/bin/zig

# Install yarn
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
npm install -g yarn

# Install gcc 13
sudo add-apt-repository ppa:ubuntu-toolchain-r/test
sudo apt-get update
sudo apt-get install g++-13

# Install docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"
sudo apt install -y docker-ce
sudo usermod -aG docker $\{USER\}

# Install rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
. .cargo/env
\`\`\`

2. Clone the repo and checkout the correct version
\`\`\`
git clone https://github.com/AztecProtocol/aztec-packages.git
cd aztec-packages
git checkout v4   # commit hash 408ff4d64fad09b8a11b0f54b56295271a113325
git submodule update --init --recursive
\`\`\`

3. Build preliminary components
\`\`\`
# build avm-transpiler binary
cd avm-transpiler
NO_CACHE=1 ./bootstrap.sh build_native

# build barretenberg binary
cd ../barretenberg/cpp
NO_CACHE=1 ./bootstrap.sh build_native

# build nargo binary
cd ../../noir
NO_CACHE=1 ./bootstrap.sh
\`\`\`

4. Remove the pinned build files and build the verifier smart contract:
\`\`\`
cd ../noir-projects/noir-protocol-circuits
rm pinned-build.tar.gz
corepack enable
NO_CACHE=1 ./bootstrap.sh
\`\`\`
The build should produce correct onchain verifier in \`target/keys/rollup_root_verifier.sol\`.
            `,
      },
    ],
  },
}
