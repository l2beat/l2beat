import { ChainSpecificAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ZK_CATALOG_ATTESTERS } from '../../common/zkCatalogAttesters'
import { ZK_CATALOG_TAGS } from '../../common/zkCatalogTags'
import { TRUSTED_SETUPS } from '../../common/zkCatalogTrustedSetups'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

export const zkprover: BaseProject = {
  id: ProjectId('zkprover'),
  slug: 'zkprover',
  name: 'zkProver',
  shortName: undefined,
  aliases: ['Polygon Zero'],
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
        'https://docs.polygon.technology/tools/zkevm/architecture/#zkprover',
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
    proofSystemInfo: readProjectMarkdown('zkprover', 'proofSystemInfo'),
    trustedSetups: [
      {
        proofSystem: ZK_CATALOG_TAGS.Fflonk.Snarkjs,
        ...TRUSTED_SETUPS.PolygonZkEVM,
      },
    ],
    projectsForTvs: [
      {
        projectId: ProjectId('polygonzkevm'),
        sinceTimestamp: UnixTime(1679868000),
        untilTimestamp: UnixTime(1764716400),
      },
      {
        projectId: ProjectId('silicon'),
        sinceTimestamp: UnixTime(1724796000),
      },
      {
        projectId: ProjectId('ternoa'),
        sinceTimestamp: UnixTime(1738105200),
      },
      {
        projectId: ProjectId('penchain'),
        sinceTimestamp: UnixTime(1749938400),
      },
      {
        projectId: ProjectId('wirex'),
        sinceTimestamp: UnixTime(1724796000),
      },
      {
        projectId: ProjectId('astarzkevm'),
        sinceTimestamp: UnixTime(1709679600),
        // untilTimestamp: UnixTime(1743372000),
      },
      {
        projectId: ProjectId('gpt'),
        sinceTimestamp: UnixTime(1724450400),
        // untilTimestamp: UnixTime(1737676800),
      },
      {
        projectId: ProjectId('witness'),
        sinceTimestamp: UnixTime(1719871200),
        // untilTimestamp: UnixTime(1738022400),
      },
    ],
    verifierHashes: [
      // wirex was the last chain using this verifier:
      {
        hash: '0x28ddf3744fb9b64bc428bee318e026bee0cf210e23ff5932f645e32aa916c28f',
        proofSystem: ZK_CATALOG_TAGS.Fflonk.Snarkjs,
        name: 'zkProver Fflonk verifier Wirex',
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0x0775e11309d75aA6b0967917fB0213C5673eDf81',
            ),
          },
        ],
        verificationStatus: 'notVerified',
        description:
          'Custom verifier ID: SHA256 hash of the following values from the verifier smart contract, abi packed in the same order they are defined: verification key data, omegas, verifier preprocessed inputs (all values from k1 to X2y2).',
      },
      {
        hash: '0x237bc5d6efad6d844534c4a45f5f19fa86344615ac00054821915c219e9abd81',
        name: 'zkProver Fflonk v8.0.0-fork.12',
        sourceLink:
          'https://github.com/0xPolygon/zkevm-proverjs/tree/v8.0.0-fork.12',
        proofSystem: ZK_CATALOG_TAGS.Fflonk.Snarkjs,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0x9B9671dB83CfcB4508bF361942488C5cA2b1286D',
            ),
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
