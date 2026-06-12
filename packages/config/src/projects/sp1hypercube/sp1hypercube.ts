import { ChainSpecificAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ZK_CATALOG_ATTESTERS } from '../../common/zkCatalogAttesters'
import { ZK_CATALOG_TAGS } from '../../common/zkCatalogTags'
import { TRUSTED_SETUPS } from '../../common/zkCatalogTrustedSetups'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

export const sp1hypercube: BaseProject = {
  id: ProjectId('sp1hypercube'),
  slug: 'sp1hypercube',
  name: 'SP1 Hypercube',
  shortName: undefined,
  aliases: ['Succinct'],
  addedAt: UnixTime.fromDate(new Date('2026-03-04')),
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description:
      'SP1 Hypercube is a zk proving system for RISC-V programs built by Succinct, release v6.',
    links: {
      websites: ['https://www.succinct.xyz'],
      documentation: ['https://docs.succinct.xyz/docs/protocol/introduction'],
      repositories: ['https://github.com/succinctlabs/sp1/tree/v6.0.0'],
      socialMedia: [
        'https://x.com/SuccinctLabs',
        'https://discord.com/invite/succinctlabs',
      ],
    },
    badges: [],
  },
  zkCatalogInfo: {
    creator: 'Succinct',
    techStack: {
      zkVM: [
        ZK_CATALOG_TAGS.STARK.Plonky3,
        ZK_CATALOG_TAGS.ISA.RISCV64,
        ZK_CATALOG_TAGS.Field.BabyBear,
        ZK_CATALOG_TAGS.Field.KoalaBear,
      ],
      finalWrap: [
        ZK_CATALOG_TAGS.Plonk.Gnark,
        ZK_CATALOG_TAGS.Groth16.SP1_v6_0_0,
        ZK_CATALOG_TAGS.Groth16.SP1_v6_1_0,
        ZK_CATALOG_TAGS.curve.BN254,
        // ZK_CATALOG_TAGS.PCS.KZG,
      ],
    },
    proofSystemInfo: readProjectMarkdown('sp1hypercube', 'proofSystemInfo'),
    trustedSetups: [
      {
        proofSystem: ZK_CATALOG_TAGS.Plonk.Gnark,
        ...TRUSTED_SETUPS.AztecIgnition,
      },
      {
        proofSystem: ZK_CATALOG_TAGS.Groth16.SP1_v6_1_0,
        ...TRUSTED_SETUPS.SP1HypercubeGroth16_v6_1_0,
      },
      {
        proofSystem: ZK_CATALOG_TAGS.Groth16.SP1_v6_0_0,
        ...TRUSTED_SETUPS.SP1HypercubeGroth16,
      },
    ],
    projectsForTvs: [
      {
        projectId: ProjectId('fluent'),
        sinceTimestamp: UnixTime(1776599267), // first onchain commitBatch 2026-04-19
      },
      {
        projectId: ProjectId('celo'),
        sinceTimestamp: UnixTime(1771445567),
      },
      {
        projectId: ProjectId('vector'),
        sinceTimestamp: UnixTime(1771445567),
      },
      {
        projectId: ProjectId('sophon'),
        sinceTimestamp: UnixTime(1771445567),
      },
      {
        projectId: ProjectId('lens'),
        sinceTimestamp: UnixTime(1771445567),
      },
      {
        projectId: ProjectId('galxegravity'),
        sinceTimestamp: UnixTime(1771445567),
        untilTimestamp: UnixTime(1763420400),
      },
      {
        projectId: ProjectId('rari'),
        sinceTimestamp: UnixTime(1771445567),
      },
      {
        projectId: ProjectId('blobstream'),
        sinceTimestamp: UnixTime(1771445567),
      },
      {
        projectId: ProjectId('molten'),
        sinceTimestamp: UnixTime(1771445567),
      },
      {
        projectId: ProjectId('winr'),
        sinceTimestamp: UnixTime(1771445567),
      },
      {
        projectId: ProjectId('phala'),
        sinceTimestamp: UnixTime(1771445567),
      },
      {
        projectId: ProjectId('kroma'),
        sinceTimestamp: UnixTime(1771445567),
      },
      {
        projectId: ProjectId('taiko'),
        sinceTimestamp: UnixTime(1774964687),
      },
      {
        projectId: ProjectId('mantle'),
        sinceTimestamp: UnixTime(1778001356),
      },
      {
        projectId: ProjectId('morph'),
        sinceTimestamp: UnixTime(1779354407),
      },
      {
        projectId: ProjectId('base'),
        sinceTimestamp: UnixTime(1779825599), // 2026-05-26 AggregateVerifier upgrade
      },
      {
        projectId: ProjectId('appchain'),
        sinceTimestamp: UnixTime(1780326419),
      },
      {
        projectId: ProjectId('apechain'),
        sinceTimestamp: UnixTime(1780346337),
      },
    ],
    verifierHashes: [
      {
        hash: '0x4388a21c687fdd5f218d7e3d13190cac4c5355818d3605fd5fb811df468ee696',
        name: 'SP1 Hypercube Groth16 v6.1.0',
        sourceLink:
          'https://github.com/succinctlabs/sp1/tree/v6.1.0/crates/prover',
        proofSystem: ZK_CATALOG_TAGS.Groth16.SP1_v6_1_0,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0xb69f2584CBcFf99a58C4e7002E8b89Af54a6f4e2',
            ),
          },
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0xD9d5C8456a168Dd25561064F47bF116111131B1D',
            ),
          },
          {
            address: ChainSpecificAddress.fromLong(
              'arbitrum',
              '0xD9d5C8456a168Dd25561064F47bF116111131B1D',
            ),
          },
        ],
        verificationStatus: 'successful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        verificationSteps: `
    The regeneration process consumed around 70 GiB of memory on the peak.
    
    1. Install necessary dependencies: rust, docker, sp1 toolkit, go.
    
    \`\`\`
    sudo apt update
    sudo apt install build-essential golang-go protobuf-compiler
    
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
    . .cargo/env
    cargo install --debug --locked cargo-make
    
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
    sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"
    sudo apt install -y docker-ce
    sudo usermod -aG docker $\{USER\}
    
    curl -L https://sp1up.succinct.xyz/ | bash
    source ~/.bashrc
    sp1up
    \`\`\`
    
    2. Clone [sp1 repo](https://github.com/succinctlabs/sp1), set \`SP1_ALLOW_DEPRECATED_HOOKS\` for correct compilation and run the script to build groth16 circuit file.
    
    \`\`\`
    git clone https://github.com/succinctlabs/sp1.git
    cd sp1/crates/prover
    git checkout v6.1.0   # commit should be d454975ac7c1126097e36eceda9bce2cb9899da4
    export SP1_ALLOW_DEPRECATED_HOOKS=true  # fixes compilation errors
    
    make build-circuits
    \`\`\`
    
    This script will generate \`groth16_circuit.bin\` file in the \`prover/build/groth16\` directory, however it will not generate correct prover and verifier keys.
    
    3. Generate correct pk and vk using the correct SP1 trusted setup. This will require [semaphore-gnark-11](https://github.com/succinctlabs/semaphore-gnark-11/tree/main) repo.
    
    \`\`\`
    cd
    git clone https://github.com/succinctlabs/semaphore-gnark-11.git  # tested on commit hash 6d6ebc3608e609ec879e9ba99abee6b6b97d937d
    cd semaphore-gnark-11
    # Download the trusted setup transcript
    curl "https://sp1-circuits.s3-us-east-2.amazonaws.com/v6.1.0-trusted-setup.tar.gz" -o trusted-setup.tar.gz
    
    # Extract trusted setup transcript.
    tar -xzf trusted-setup.tar.gz
    
    # Build the binary.
    go build
    
    # Generate keys. They are outputted to the files pk and vk in the root directory.
    ./semaphore-gnark-11 key trusted-setup/phase1 trusted-setup/phase2-17 trusted-setup/evals /path/to/sp1/crates/prover/build/groth16/groth16_circuit.bin
    \`\`\`
    The last step will take several hours to complete.
    
    4. Compute the hash of generated \`vk\` file: \`shasum vk -a 256\`.
        `,
      },
      {
        hash: '0x0e78f4db7a6771a3a6a7d9c3b0de6fe73d58781368967a7fe84d87aefffec896',
        name: 'SP1 Hypercube Groth16 v6.0.0',
        sourceLink:
          'https://github.com/succinctlabs/sp1/tree/v6.0.0/crates/prover',
        proofSystem: ZK_CATALOG_TAGS.Groth16.SP1_v6_0_0,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0x99A74A05a0FaBEB217C1A329b0dac59a1FA52508',
            ),
          },
        ],
        verificationStatus: 'successful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        verificationSteps: `
    The regeneration process consumed around 70 GiB of memory on the peak.
    
    1. Install necessary dependencies: rust, docker, sp1 toolkit, go.
    
    \`\`\`
    sudo apt update
    sudo apt install build-essential golang-go protobuf-compiler
    
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
    . .cargo/env
    cargo install --debug --locked cargo-make
    
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
    sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"
    sudo apt install -y docker-ce
    sudo usermod -aG docker $\{USER\}
    
    curl -L https://sp1up.succinct.xyz/ | bash
    source ~/.bashrc
    sp1up
    \`\`\`
    
    2. Clone [sp1 repo](https://github.com/succinctlabs/sp1), set \`SP1_ALLOW_DEPRECATED_HOOKS\` for correct compilation and run the script to build groth16 circuit file.
    
    \`\`\`
    git clone https://github.com/succinctlabs/sp1.git
    cd sp1/crates/prover
    git checkout v6.0.0   # commit should be f87f8d6ff005d542db22e241928319f5e96a4609
    export SP1_ALLOW_DEPRECATED_HOOKS=true  # fixes compilation errors
    
    make build-circuits
    \`\`\`
    
    This script will generate \`groth16_circuit.bin\` file in the \`prover/build/groth16\` directory, however it will not generate correct prover and verifier keys.
    
    3. Generate correct pk and vk using the correct SP1 trusted setup. This will require [semaphore-gnark-11](https://github.com/succinctlabs/semaphore-gnark-11/tree/main) repo.
    
    \`\`\`
    cd
    git clone https://github.com/succinctlabs/semaphore-gnark-11.git  # tested on commit hash 6d6ebc3608e609ec879e9ba99abee6b6b97d937d
    cd semaphore-gnark-11
    # Download the trusted setup transcript
    curl "https://sp1-circuits.s3-us-east-2.amazonaws.com/v6.0.0-trusted-setup.tar.gz" -o trusted-setup.tar.gz
    
    # Extract trusted setup transcript.
    tar -xzf trusted-setup.tar.gz
    
    # Build the binary.
    go build
    
    # Generate keys. They are outputted to the files pk and vk in the root directory.
    ./semaphore-gnark-11 key trusted-setup/phase1 trusted-setup/phase2-11 trusted-setup/evals /path/to/sp1/crates/prover/build/groth16/groth16_circuit.bin
    \`\`\`
    The last step will take several hours to complete.
    
    4. Compute the hash of generated \`vk\` file: \`shasum vk -a 256\`.
        `,
      },
      {
        hash: '0x5a093a2fcb46394f5cadfe55c44d4d572fad9cec7aeb38026b0278322ef07fac',
        name: 'SP1 Hypercube Plonk v6.1.0',
        sourceLink:
          'https://github.com/succinctlabs/sp1/tree/v6.1.0/crates/prover',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Gnark,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0xc3c6dDDAc8829b233Dc6536Ec024775a57b0AF2A',
            ),
          },
          {
            address: ChainSpecificAddress.fromLong(
              'arbitrum',
              '0xc3c6dDDAc8829b233Dc6536Ec024775a57b0AF2A',
            ),
          },
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0x9774CE99E8Ab3f13582bC6c2Bd2832e5A25C4624',
            ),
          },
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0xD9F24400816c4CC1a3cBb9B851C9B0bAB63Ad692',
            ),
          },
        ],
        verificationStatus: 'successful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        verificationSteps: `
The regeneration process consumed around 100 GiB of memory on the peak.

1. Install necessary dependencies: rust, docker, sp1 toolkit, go.

\`\`\`
sudo apt update
sudo apt install build-essential golang-go protobuf-compiler

curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
. .cargo/env
cargo install --debug --locked cargo-make

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"
sudo apt install -y docker-ce
sudo usermod -aG docker $\{USER\}

curl -L https://sp1up.succinct.xyz/ | bash
source ~/.bashrc
sp1up
\`\`\`

2. Clone [sp1 repo](https://github.com/succinctlabs/sp1), set \`SP1_ALLOW_DEPRECATED_HOOKS\` for correct compilation and run the script to regenerate verifiers.

\`\`\`
git clone https://github.com/succinctlabs/sp1.git
cd sp1/crates/prover
git checkout v6.1.0   # commit should be d454975ac7c1126097e36eceda9bce2cb9899da4
export SP1_ALLOW_DEPRECATED_HOOKS=true  # fixes compilation errors

make build-circuits
\`\`\`
      
The script will generate Plonk verifier smart contract with verification keys and the verifier hash in \`build/plonk\` dir.
        `,
      },
      {
        hash: '0xbb1a6f2930e94bfe8b35e794faf43133214534a17d2ad8e51358cad437b3c317',
        name: 'SP1 Hypercube Plonk v6.0.0',
        sourceLink:
          'https://github.com/succinctlabs/sp1/tree/v6.0.0/crates/prover',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Gnark,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0x8a0fd5e825D14368d90Fe68F31fceAe3E17AFc5C',
            ),
          },
          {
            address: ChainSpecificAddress.fromLong(
              'arbitrum',
              '0x8a0fd5e825D14368d90Fe68F31fceAe3E17AFc5C',
            ),
          },
        ],
        verificationStatus: 'successful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        verificationSteps: `
    The regeneration process consumed around 70 GiB of memory on the peak.
    
    1. Install necessary dependencies: rust, docker, sp1 toolkit, go.
    
    \`\`\`
    sudo apt update
    sudo apt install build-essential golang-go protobuf-compiler
    
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
    . .cargo/env
    cargo install --debug --locked cargo-make
    
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
    sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"
    sudo apt install -y docker-ce
    sudo usermod -aG docker $\{USER\}
    
    curl -L https://sp1up.succinct.xyz/ | bash
    source ~/.bashrc
    sp1up
    \`\`\`
    
    2. Clone [sp1 repo](https://github.com/succinctlabs/sp1), set \`SP1_ALLOW_DEPRECATED_HOOKS\` for correct compilation and run the script to regenerate verifiers.
    
    \`\`\`
    git clone https://github.com/succinctlabs/sp1.git
    cd sp1/crates/prover
    git checkout v6.0.0   # commit should be f87f8d6ff005d542db22e241928319f5e96a4609
    export SP1_ALLOW_DEPRECATED_HOOKS=true  # fixes compilation errors
    
    make build-circuits
    \`\`\`
          
    The script will generate Plonk verifier smart contract with verification keys and the verifier hash in \`build/plonk\` dir.
            `,
      },
    ],
  },
}
